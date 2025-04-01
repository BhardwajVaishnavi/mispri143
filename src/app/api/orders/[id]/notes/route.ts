import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const { content } = await request.json();

    if (!content) {
      return NextResponse.json(
        { error: 'Note content is required' },
        { status: 400 }
      );
    }

    // Create a new note
    await prisma.orderNote.create({
      data: {
        orderId: id,
        content,
        createdBy: 'Admin', // In a real app, this would be the current user
      },
    });

    // Get all notes for the order
    const notes = await prisma.orderNote.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'desc' },
    });

    // Get the updated order
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

    // Get all timeline entries
    const timeline = await prisma.orderTimeline.findMany({
      where: { orderId: id },
      orderBy: { createdAt: 'desc' },
    });

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
      notes: notes.map(note => ({
        id: note.id,
        content: note.content,
        createdBy: note.createdBy,
        createdAt: note.createdAt.toISOString(),
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
    console.error('Error adding note:', error);
    return NextResponse.json(
      { error: 'Failed to add note' },
      { status: 500 }
    );
  }
}
