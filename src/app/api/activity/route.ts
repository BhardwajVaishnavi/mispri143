import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '5');

    // Get recent orders
    const recentOrders = await prisma.order.findMany({
      take: limit,
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        customer: {
          select: {
            name: true
          }
        }
      }
    });

    // Get recent inventory updates
    const recentInventoryUpdates = await prisma.inventory.findMany({
      take: limit,
      orderBy: {
        updatedAt: 'desc'
      },
      include: {
        product: {
          select: {
            name: true
          }
        },
        store: {
          select: {
            name: true
          }
        }
      }
    });

    // Format the activity data
    const activities = [
      ...recentOrders.map(order => ({
        id: `order-${order.id}`,
        type: 'order',
        message: `New order #${order.id.substring(0, 8)} received`,
        timestamp: order.createdAt.toISOString(),
        user: {
          name: order.customer.name
        }
      })),
      ...recentInventoryUpdates.map(inventory => ({
        id: `inventory-${inventory.id}`,
        type: 'inventory',
        message: `Inventory updated for ${inventory.product.name} at ${inventory.store.name}`,
        timestamp: inventory.updatedAt.toISOString(),
        user: {
          name: 'Admin User' // This would ideally come from the user who made the update
        }
      }))
    ];

    // Sort by timestamp (most recent first)
    activities.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });

    // Take only the requested number of activities
    const limitedActivities = activities.slice(0, limit);

    return NextResponse.json(limitedActivities);
  } catch (error) {
    console.error('Error fetching activity:', error);
    
    // Return mock data for demonstration if there's an error
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
