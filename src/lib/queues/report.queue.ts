import Queue from 'bull';
import { ReportGeneratorService } from '../services/report-generator.service';
import { WebSocketServer } from '../../server/websocket';
import { NotificationService } from '../services/notification.service';

interface ReportJob {
  templateId: string;
  recipients: string[];
  format: 'pdf' | 'xlsx' | 'csv';
}

export const reportQueue = new Queue<ReportJob>('report-generation', {
  redis: process.env.REDIS_URL || 'redis://localhost:6379',
});

reportQueue.process(async (job) => {
  const { templateId, recipients, format } = job.data;

  try {
    // Update status
    await job.progress(10);
    WebSocketServer.broadcastReportStatus(job.id.toString(), 'PROCESSING');

    // Generate report
    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
    });

    if (!template) throw new Error('Template not found');

    const config = JSON.parse(template.config as string);
    const reportBuffer = await ReportGeneratorService.generateReport({
      type: template.type,
      format,
      ...config,
    });

    // Send notifications
    await NotificationService.notifyReportCompletion(recipients, {
      reportId: job.id.toString(),
      templateName: template.name,
    });

    return { success: true, reportBuffer };
  } catch (error) {
    console.error('Report generation failed:', error);
    WebSocketServer.broadcastReportStatus(job.id.toString(), 'FAILED');
    throw error;
  }
});