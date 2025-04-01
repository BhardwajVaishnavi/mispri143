import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: 'Order not found' },
        { status: 404 }
      );
    }

    // Format the order data for the frontend
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
        id: order.user.id,
        name: order.user.name,
        email: order.user.email,
        phone: order.user.phone || '',
      },
      address: {
        street: order.address.street,
        city: order.address.city,
        state: order.address.state,
        postalCode: order.address.postalCode,
        country: order.address.country,
      },
      items: order.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        customText: item.customText || undefined,
        image: item.product.images[0] || undefined,
      })),
      notes: [], // We'll add this functionality later
      timeline: [
        {
          status: order.status,
          timestamp: order.updatedAt.toISOString(),
          description: `Order ${order.status.toLowerCase()}`,
          performedBy: 'System',
        },
        {
          status: 'PENDING',
          timestamp: order.createdAt.toISOString(),
          description: 'Order created',
          performedBy: 'Customer',
        },
      ],
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    return NextResponse.json(
      { error: 'Failed to fetch order' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const body = await request.json();
    
    // Update the order
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: body,
      include: {
        user: true,
        address: true,
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    // Format the order data for the frontend (same as GET)
    const formattedOrder = {
      id: updatedOrder.id,
      orderNumber: updatedOrder.id.substring(0, 8).toUpperCase(),
      status: updatedOrder.status,
      paymentStatus: updatedOrder.paymentStatus,
      deliveryType: updatedOrder.deliveryType,
      deliveryDate: updatedOrder.deliveryDate,
      deliveryTime: updatedOrder.deliveryTime || '14:00-16:00',
      totalAmount: updatedOrder.totalAmount,
      createdAt: updatedOrder.createdAt,
      updatedAt: updatedOrder.updatedAt,
      customer: {
        id: updatedOrder.user.id,
        name: updatedOrder.user.name,
        email: updatedOrder.user.email,
        phone: updatedOrder.user.phone || '',
      },
      address: {
        street: updatedOrder.address.street,
        city: updatedOrder.address.city,
        state: updatedOrder.address.state,
        postalCode: updatedOrder.address.postalCode,
        country: updatedOrder.address.country,
      },
      items: updatedOrder.items.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.product.name,
        quantity: item.quantity,
        price: item.price,
        customText: item.customText || undefined,
        image: item.product.images[0] || undefined,
      })),
      notes: [], // We'll add this functionality later
      timeline: [
        {
          status: updatedOrder.status,
          timestamp: updatedOrder.updatedAt.toISOString(),
          description: `Order ${updatedOrder.status.toLowerCase()}`,
          performedBy: 'Admin',
        },
        {
          status: 'PENDING',
          timestamp: updatedOrder.createdAt.toISOString(),
          description: 'Order created',
          performedBy: 'Customer',
        },
      ],
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
