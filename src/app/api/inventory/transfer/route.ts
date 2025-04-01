import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { sourceStoreId, destinationStoreId, productId, quantity, notes } = body;

    // Start a transaction
    const transfer = await prisma.$transaction(async (tx) => {
      // Check source inventory
      const sourceInventory = await tx.inventory.findFirst({
        where: {
          storeId: sourceStoreId,
          productId: productId,
        },
      });

      if (!sourceInventory || sourceInventory.quantity < quantity) {
        throw new Error('Insufficient stock in source location');
      }

      // Find or create destination inventory
      let destinationInventory = await tx.inventory.findFirst({
        where: {
          storeId: destinationStoreId,
          productId: productId,
        },
      });

      if (destinationInventory) {
        // Update existing inventory
        destinationInventory = await tx.inventory.update({
          where: { id: destinationInventory.id },
          data: {
            quantity: {
              increment: quantity,
            },
          },
        });
      } else {
        // Create new inventory
        destinationInventory = await tx.inventory.create({
          data: {
            id: createId(),
            storeId: destinationStoreId,
            productId: productId,
            quantity: quantity,
          },
        });
      }

      // Decrease source inventory
      await tx.inventory.update({
        where: {
          id: sourceInventory.id,
        },
        data: {
          quantity: {
            decrement: quantity,
          },
        },
      });

      // Record transfer movements
      const transferId = createId();
      await tx.stockMovement.createMany({
        data: [
          {
            id: createId(),
            type: 'TRANSFER_OUT',
            inventoryId: sourceInventory.id,
            quantity: -quantity,
            reference: transferId,
            description: notes,
            performedBy: session.user.id,
          },
          {
            id: createId(),
            type: 'TRANSFER_IN',
            inventoryId: destinationInventory.id,
            quantity: quantity,
            reference: transferId,
            description: notes,
            performedBy: session.user.id,
          },
        ],
      });

      return { transferId, sourceInventory, destinationInventory };
    });

    return NextResponse.json(transfer);
  } catch (error) {
    console.error('Transfer error:', error);
    return new NextResponse(
      error instanceof Error ? error.message : 'Internal Error',
      { status: 500 }
    );
  }
}


