import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { OrderStatus } from '@prisma/client';

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Calculate total amount by fetching product prices
    const productsWithPrices = await Promise.all(
      body.items.map(async (item: any) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { price: true }
        });
        return {
          ...item,
          price: product?.price || 0
        };
      })
    );

    const totalAmount = productsWithPrices.reduce(
      (sum, item) => sum + (item.price * item.quantity),
      0
    );

    // Create the order
    const order = await prisma.order.create({
      data: {
        customerId: body.customerId,
        status: 'PENDING',
        items: {
          create: body.items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.price || 0,
            customText: item.customText,
          })),
        },
        deliveryDate: new Date(body.deliveryDate),
        deliveryTime: body.deliveryTime,
        deliveryType: body.deliveryType,
        addressId: body.addressId,
        totalAmount,
        paymentStatus: 'PENDING',
        paymentMethod: body.paymentMethod,
        userId: body.userId, // This should come from the authenticated session
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true,
        user: true,
        address: true,
      },
    });

    // Create a timeline entry for the order creation
    await prisma.orderTimeline.create({
      data: {
        orderId: order.id,
        status: 'PENDING',
        description: 'Order created',
        performedBy: 'Customer',
      },
    }).catch(err => console.error('Failed to create timeline entry:', err));

    // Format the order for the frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryType: order.deliveryType,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime || '14:00-16:00',
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: {
        id: order.user?.id || order.customer?.id,
        name: order.user?.name || order.customer?.name || 'Unknown',
        email: order.user?.email || order.customer?.email || '',
        phone: order.user?.phone || '',
      },
      address: order.address ? {
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
      } : null,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        customText: item.customText || undefined,
        image: item.product.images[0] || undefined,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const status = searchParams.get('status');
    const paymentStatus = searchParams.get('paymentStatus');
    const fromDate = searchParams.get('fromDate');
    const toDate = searchParams.get('toDate');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    // Build the where clause based on the search parameters
    let where: any = {};

    // Add search filter if provided
    if (search) {
      where.OR = [
        { id: { contains: search, mode: 'insensitive' } },
        { user: { name: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    // Add status filter if provided
    if (status && status !== 'all') {
      where.status = status.toUpperCase() as OrderStatus;
    }

    // Add payment status filter if provided
    if (paymentStatus && paymentStatus !== 'all') {
      where.paymentStatus = paymentStatus;
    }

    // Add date range filter if provided
    if (fromDate && toDate) {
      where.createdAt = {
        gte: new Date(fromDate),
        lte: new Date(toDate),
      };
    } else if (fromDate) {
      where.createdAt = {
        gte: new Date(fromDate),
      };
    } else if (toDate) {
      where.createdAt = {
        lte: new Date(toDate),
      };
    }

    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
          customer: true,
          items: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true,
                },
              },
            },
          },
        },
      }),
      prisma.order.count({ where }),
    ]);

    // Format the orders for the frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      customer: order.user?.name || order.customer?.name || 'Unknown',
      date: order.createdAt.toISOString(),
      total: order.totalAmount,
      status: order.status,
      paymentStatus: order.paymentStatus,
      items: order.items.length,
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const order = await prisma.order.delete({
      where: { id: orderId },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, status, paymentStatus } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Update the order
    const order = await prisma.order.update({
      where: { id },
      data: {
        status: status as OrderStatus,
        paymentStatus: paymentStatus,
        updatedAt: new Date(),
      },
      include: {
        items: {
          include: {
            product: true
          }
        },
        customer: true,
        user: true,
        address: true,
      }
    });

    // Create a timeline entry for the status change if status was updated
    if (status) {
      await prisma.orderTimeline.create({
        data: {
          orderId: id,
          status: status as OrderStatus,
          description: `Order ${status.toLowerCase()}`,
          performedBy: 'Admin', // In a real app, this would be the current user
        },
      }).catch(err => console.error('Failed to create timeline entry:', err));
    }

    // Get all timeline entries
    const timeline = await prisma.orderTimeline.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'desc' },
    }).catch(() => []);

    // Format the order for the frontend
    const formattedOrder = {
      id: order.id,
      orderNumber: order.id.substring(0, 8).toUpperCase(),
      status: order.status,
      paymentStatus: order.paymentStatus,
      deliveryType: order.deliveryType,
      deliveryDate: order.deliveryDate,
      deliveryTime: order.deliveryTime || '14:00-16:00',
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      customer: {
        id: order.user?.id || order.customer?.id,
        name: order.user?.name || order.customer?.name || 'Unknown',
        email: order.user?.email || order.customer?.email || '',
        phone: order.user?.phone || '',
      },
      address: order.address ? {
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
      } : null,
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        customText: item.customText || undefined,
        image: item.product.images[0] || undefined,
      })),
      timeline: timeline.map(entry => ({
        status: entry.status,
        timestamp: entry.createdAt.toISOString(),
        description: entry.description,
        performedBy: entry.performedBy,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { error: 'Failed to update order' },
      { status: 500 }
    );
  }
}


