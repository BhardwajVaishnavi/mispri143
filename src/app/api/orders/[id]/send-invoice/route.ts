import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    // Get the order
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        user: true,
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

    // In a real application, you would send an email with the invoice here
    // For this example, we'll just log the action and return success

    console.log(`Sending invoice for order ${id} to ${order.user.email}`);

    // Create a timeline entry for the invoice
    await prisma.orderTimeline.create({
      data: {
        orderId: id,
        status: order.status,
        description: 'Invoice sent to customer',
        performedBy: 'Admin', // In a real app, this would be the current user
      },
    });

    return NextResponse.json({
      success: true,
      message: `Invoice sent to ${order.user.email}`,
    });
  } catch (error) {
    console.error('Error sending invoice:', error);
    return NextResponse.json(
      { error: 'Failed to send invoice' },
      { status: 500 }
    );
  }
}
