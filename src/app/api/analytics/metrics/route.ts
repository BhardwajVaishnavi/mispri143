import { NextResponse } from 'next/server';
import { AnalyticsService } from '@/lib/services/analytics.service';
import { auth } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { startDate, endDate, storeId } = body;

    const metrics = await AnalyticsService.getMetrics({
      storeId,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Analytics API Error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics metrics' },
      { status: 500 }
    );
  }
}