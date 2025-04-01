import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { status } = await request.json();

    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }

    // Update the order status
    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { 
        status,
        updatedAt: new Date() 
      },
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

    // Create a timeline entry for the status change
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status,
        description: `Order ${status.toLowerCase()}`,
        performedBy: 'Admin', // In a real app, this would be the current user
      },
    });

    // Get all timeline entries
    const timeline = await prisma.orderTimeline.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'desc' },
    });

    // Format the order data for the frontend
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
      timeline: timeline.map(entry => ({
        status: entry.status,
        timestamp: entry.createdAt.toISOString(),
        description: entry.description,
        performedBy: entry.performedBy,
      })),
    };

    return NextResponse.json(formattedOrder);
  } catch (error) {
    console.error('Error updating order status:', error);
    return NextResponse.json(
      { error: 'Failed to update order status' },
      { status: 500 }
    );
  }
}
