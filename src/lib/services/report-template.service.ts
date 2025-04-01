import prisma from '@/lib/prisma';
import { reportQueue } from '../queues/report.queue';
import cron from 'node-cron';
import { Prisma, ReportTemplate as PrismaReportTemplate } from '@prisma/client';

// Define common select object for Prisma queries
const reportTemplateSelect = {
  id: true,
  name: true,
  description: true,
  content: true,
  type: true,
  config: true,
  createdAt: true,
  updatedAt: true,
} as const;

// Type for Prisma's return with selected fields
type PrismaReportTemplateSelect = Prisma.ReportTemplateGetPayload<{
  select: typeof reportTemplateSelect;
}>;

// Define the configuration interface for report templates with index signature
export interface ReportTemplateConfig {
  [key: string]: unknown;
  metrics: string[];
  filters: Record<string, unknown>;
  visualizations: Array<{
    type: string;
    config: Record<string, unknown>;
  }>;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    time: string;
    recipients: string[];
  };
}

// Create input type for report template creation
type ReportTemplateCreateInput = Prisma.ReportTemplateCreateInput & {
  config: Prisma.InputJsonValue;
};

// Create input type for report template updates
type ReportTemplateUpdateInput = Prisma.ReportTemplateUpdateInput & {
  config: Prisma.InputJsonValue;
};

// Extended report template interface
export interface ReportTemplate extends Omit<PrismaReportTemplate, 'config'> {
  config: ReportTemplateConfig;
}

// Report template service class
export class ReportTemplateService {
  // Map to keep track of scheduled jobs
  private static scheduledJobs = new Map<string, cron.ScheduledTask>();

  /**
   * Create a new report template
   * @param data Report template creation data
   * @returns Created report template
   */
  static async createTemplate(
    data: Omit<ReportTemplateCreateInput, 'config'> & { config: ReportTemplateConfig }
  ): Promise<ReportTemplate> {
    // Prepare data for Prisma create operation
    const createData: ReportTemplateCreateInput = {
      name: data.name,
      description: data.description,
      content: data.content,
      type: data.type,
      config: data.config as Prisma.InputJsonValue,
    };

    // Create template in database
    const template = await prisma.reportTemplate.create({
      data: createData,
      select: reportTemplateSelect,
    });

    // Return template with properly typed config
    return {
      ...template,
      config: template.config as ReportTemplateConfig,
    };
  }

  /**
   * Retrieve all report templates
   * @returns Array of report templates
   */
  static async getTemplates(): Promise<ReportTemplate[]> {
    // Fetch templates from database
    const templates = await prisma.reportTemplate.findMany({
      select: reportTemplateSelect,
    });

    // Map templates to include properly typed config
    return templates.map(template => ({
      ...template,
      config: template.config as ReportTemplateConfig,
    }));
  }

  /**
   * Retrieve a single report template by ID
   * @param templateId ID of the report template
   * @returns Report template or null
   */
  static async getTemplateById(templateId: string): Promise<ReportTemplate | null> {
    // Fetch template from database
    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
      select: reportTemplateSelect,
    });

    // Return template with typed config or null
    return template ? {
      ...template,
      config: template.config as ReportTemplateConfig,
    } : null;
  }

  /**
   * Schedule a report based on template configuration
   * @param templateId ID of the report template
   * @param schedule Schedule configuration
   */
  static async scheduleReport(
    templateId: string, 
    schedule: NonNullable<ReportTemplateConfig['schedule']>
  ) {
    // Find the specific template
    const template = await prisma.reportTemplate.findUnique({
      where: { id: templateId },
      select: reportTemplateSelect,
    });

    // Throw error if template not found
    if (!template) throw new Error('Template not found');

    // Cancel any existing schedule for this template
    this.cancelSchedule(templateId);

    // Generate cron expression based on schedule
    const cronExpression = this.getCronExpression(schedule);
    
    // Create scheduled job
    const job = cron.schedule(cronExpression, () => {
      reportQueue.add({
        templateId,
        recipients: schedule.recipients,
        format: 'pdf',
      });
    });

    // Store the scheduled job
    this.scheduledJobs.set(templateId, job);

    // Update template with new schedule
    const currentConfig = template.config as ReportTemplateConfig;
    const updateData: ReportTemplateUpdateInput = {
      config: {
        ...currentConfig,
        schedule,
      } as Prisma.InputJsonValue,
    };
    
    // Persist schedule update in database
    await prisma.reportTemplate.update({
      where: { id: templateId },
      data: updateData,
    });
  }

  /**
   * Convert schedule to cron expression
   * @param schedule Schedule configuration
   * @returns Cron expression string
   */
  private static getCronExpression(schedule: NonNullable<ReportTemplateConfig['schedule']>): string {
    const [hour, minute] = schedule.time.split(':');
    switch (schedule.frequency) {
      case 'daily':
        return `${minute} ${hour} * * *`;
      case 'weekly':
        return `${minute} ${hour} * * 1`;
      case 'monthly':
        return `${minute} ${hour} 1 * *`;
      default:
        throw new Error('Invalid schedule frequency');
    }
  }

  /**
   * Cancel an existing scheduled job
   * @param templateId ID of the report template
   */
  private static cancelSchedule(templateId: string) {
    const existingJob = this.scheduledJobs.get(templateId);
    if (existingJob) {
      existingJob.stop();
      this.scheduledJobs.delete(templateId);
    }
  }
}





