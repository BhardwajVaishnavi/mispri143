import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';
import { createId } from '@paralleldrive/cuid2';

const reservationSchema = z.object({
  inventoryId: z.string(),
  quantity: z.number().int().min(1),
  orderId: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { inventoryId, quantity, orderId } = reservationSchema.parse(body);

    const result = await prisma.$transaction(async (tx) => {
      // Check current inventory
      const inventory = await tx.inventory.findUnique({
        where: { id: inventoryId },
      });

      if (!inventory) {
        throw new Error('Inventory not found');
      }

      // Check available quantity
      const reservedQuantity = await tx.stockReservation.aggregate({
        where: {
          inventoryId,
          status: 'PENDING',
        },
        _sum: {
          quantity: true,
        },
      });

      const availableQuantity = inventory.quantity - (reservedQuantity._sum.quantity || 0);

      if (availableQuantity < quantity) {
        throw new Error('Insufficient stock');
      }

      // Create reservation
      const reservation = await tx.stockReservation.create({
        data: {
          id: createId(),
          inventoryId,
          quantity,
          orderId,
          status: 'PENDING',
          expiresAt: new Date(Date.now() + 30 * 60000), // 30 minutes expiry
        },
      });

      return reservation;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error creating reservation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create reservation' },
      { status: 500 }
    );
  }
}