import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Return mock data for demonstration
    const mockData = [
      {
        id: '1',
        type: 'order',
        message: 'New order #12345 received',
        timestamp: new Date(Date.now() - 15 * 60000).toISOString(), // 15 minutes ago
        user: {
          name: 'John Smith',
        },
      },
      {
        id: '2',
        type: 'customer',
        message: 'New customer registered',
        timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
        user: {
          name: 'Emily Johnson',
        },
      },
      {
        id: '3',
        type: 'inventory',
        message: 'Inventory updated for Premium Gift Box',
        timestamp: new Date(Date.now() - 2 * 3600000).toISOString(), // 2 hours ago
        user: {
          name: 'Admin User',
        },
      },
      {
        id: '4',
        type: 'payment',
        message: 'Payment received for order #12340',
        timestamp: new Date(Date.now() - 3 * 3600000).toISOString(), // 3 hours ago
      },
      {
        id: '5',
        type: 'product',
        message: 'New product "Holiday Special" added',
        timestamp: new Date(Date.now() - 5 * 3600000).toISOString(), // 5 hours ago
        user: {
          name: 'Admin User',
        },
      },
    ];

    return NextResponse.json(mockData);
  }
}
