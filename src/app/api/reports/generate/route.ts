import { NextResponse } from 'next/server';
import { ReportGeneratorService } from '@/lib/services/report-generator.service';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { type, format, startDate, endDate, storeId, filters } = body;

    const reportBuffer = await ReportGeneratorService.generateReport({
      type,
      format,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      storeId,
      filters,
    });

    // Set appropriate headers based on format
    const headers = new Headers();
    switch (format) {
      case 'xlsx':
        headers.set('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        break;
      case 'csv':
        headers.set('Content-Type', 'text/csv');
        break;
      case 'pdf':
        headers.set('Content-Type', 'application/pdf');
        break;
    }

    headers.set('Content-Disposition', `attachment; filename="report.${format}"`);

    return new NextResponse(reportBuffer, {
      headers,
    });
  } catch (error) {
    console.error('Report Generation API Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}