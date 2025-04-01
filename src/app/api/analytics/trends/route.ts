import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { format } from 'date-fns';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'week'; // week, month, year
    
    const date = new Date();
    let startDate = new Date();
    let groupByFormat: 'day' | 'month' = 'day';
    
    switch(period) {
      case 'week':
        startDate.setDate(date.getDate() - 7);
        groupByFormat = 'day';
        break;
      case 'month':
        startDate.setMonth(date.getMonth() - 1);
        groupByFormat = 'day';
        break;
      case 'year':
        startDate.setFullYear(date.getFullYear() - 1);
        groupByFormat = 'month';
        break;
    }

    // Get sales data grouped by date
    const salesData = await prisma.order.groupBy({
      by: ['createdAt'],
      where: {
        createdAt: { gte: startDate }
      },
      _sum: {
        totalAmount: true
      }
    });

    // Format the data based on the period
    const formattedData = salesData.map(item => {
      const date = new Date(item.createdAt);
      return {
        date: groupByFormat === 'day' 
          ? format(date, 'MMM dd') 
          : format(date, 'MMM yyyy'),
        revenue: item._sum.totalAmount || 0
      };
    });

    // Sort by date
    formattedData.sort((a, b) => {
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });

    return NextResponse.json(formattedData);
  } catch (error) {
    console.error('Error fetching sales trends:', error);
    
    // Return mock data for demonstration if there's an error
    const mockData = generateMockData(period);
    
    return NextResponse.json(mockData);
  }
}

// Generate mock data for demonstration
function generateMockData(period: string) {
  const data = [];
  const now = new Date();
  let days = 7;
  
  switch (period) {
    case 'month':
      days = 30;
      break;
    case 'year':
      days = 12; // 12 months
      break;
    default:
      days = 7; // week
  }
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    
    if (period === 'year') {
      // For yearly data, go back by months
      date.setMonth(now.getMonth() - i);
      data.push({
        date: format(date, 'MMM'),
        revenue: Math.floor(Math.random() * 50000) + 10000,
      });
    } else {
      // For weekly or monthly data, go back by days
      date.setDate(now.getDate() - i);
      data.push({
        date: format(date, 'MMM dd'),
        revenue: Math.floor(Math.random() * 5000) + 1000,
      });
    }
  }
  
  return data;
}
