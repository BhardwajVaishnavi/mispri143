import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const transferSchema = z.object({
  sourceStoreId: z.string(),
  destStoreId: z.string(),
  productId: z.string(),
  quantity: z.number().positive(),
  notes: z.string().optional(),
});

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');

    const whereClause = storeId
      ? { OR: [{ sourceStoreId: storeId }, { destStoreId: storeId }] }
      : {};

    const transfers = await prisma.storeTransfer.findMany({
      where: whereClause,
      include: {
        sourceStore: {
          select: {
            id: true,
            name: true,
            storeRole: true
          }
        },
        destStore: {
          select: {
            id: true,
            name: true,
            storeRole: true
          }
        },
        product: { select: { id: true, name: true } },
        createdBy: { select: { id: true, name: true } },
        approvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(transfers);
  } catch (error) {
    console.error('Failed to fetch transfers:', error);
    return NextResponse.json({ error: 'Failed to fetch transfers' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const validatedData = transferSchema.parse(body);

    // Check if source and destination stores exist
    const [sourceStore, destStore] = await Promise.all([
      prisma.store.findUnique({ where: { id: validatedData.sourceStoreId } }),
      prisma.store.findUnique({ where: { id: validatedData.destStoreId } }),
    ]);

    if (!sourceStore) {
      return NextResponse.json({ error: 'Source store not found' }, { status: 404 });
    }

    if (!destStore) {
      return NextResponse.json({ error: 'Destination store not found' }, { status: 404 });
    }

    // Check if source store has enough inventory
    const sourceInventory = await prisma.inventory.findFirst({
      where: {
        storeId: validatedData.sourceStoreId,
        productId: validatedData.productId,
      },
    });

    if (!sourceInventory || sourceInventory.quantity < validatedData.quantity) {
      return NextResponse.json({ error: 'Insufficient inventory' }, { status: 400 });
    }

    // Create transfer in a transaction
    const transfer = await prisma.$transaction(async (tx) => {
      // Create transfer record
      const transfer = await tx.storeTransfer.create({
        data: {
          ...validatedData,
          status: sourceStore.storeRole === 'MAIN' ? 'APPROVED' : 'PENDING',
          createdById: session.user.id,
          ...(sourceStore.storeRole === 'MAIN' ? { approvedById: session.user.id } : {}),
        },
      });

      // If transfer is from MAIN store, update inventory immediately
      if (sourceStore.storeRole === 'MAIN') {
        // Deduct from source inventory
        await tx.inventory.update({
          where: {
            id: sourceInventory.id,
          },
          data: {
            quantity: {
              decrement: validatedData.quantity,
            },
          },
        });

        // Add to destination inventory or create if it doesn't exist
        const destInventory = await tx.inventory.findFirst({
          where: {
            storeId: validatedData.destStoreId,
            productId: validatedData.productId,
          },
        });

        if (destInventory) {
          await tx.inventory.update({
            where: {
              id: destInventory.id,
            },
            data: {
              quantity: {
                increment: validatedData.quantity,
              },
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              storeId: validatedData.destStoreId,
              productId: validatedData.productId,
              quantity: validatedData.quantity,
              minimumStock: 5, // Default values
              reorderPoint: 10,
              reorderQuantity: 20,
            },
          });
        }

        // Update transfer status
        await tx.storeTransfer.update({
          where: {
            id: transfer.id,
          },
          data: {
            status: 'COMPLETED',
            completedAt: new Date(),
          },
        });
      }

      return transfer;
    });

    return NextResponse.json(transfer);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.errors }, { status: 400 });
    }
    console.error('Failed to create transfer:', error);
    return NextResponse.json({ error: 'Failed to create transfer' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate status
    if (!['APPROVED', 'REJECTED', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status' },
        { status: 400 }
      );
    }

    // Get the transfer
    const transfer = await prisma.storeTransfer.findUnique({
      where: { id },
      include: {
        sourceStore: true,
        destStore: true,
      },
    });

    if (!transfer) {
      return NextResponse.json(
        { error: 'Transfer not found' },
        { status: 404 }
      );
    }

    // Check if user has permission to update the transfer
    const isMainStoreManager = await prisma.userStore.findFirst({
      where: {
        userId: session.user.id,
        store: {
          storeRole: 'MAIN',
        },
        role: 'MANAGER',
      },
    });

    const isSourceStoreManager = await prisma.userStore.findFirst({
      where: {
        userId: session.user.id,
        storeId: transfer.sourceStoreId,
        role: 'MANAGER',
      },
    });

    if (!isMainStoreManager && !isSourceStoreManager && session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json(
        { error: 'You do not have permission to update this transfer' },
        { status: 403 }
      );
    }

    // Update transfer in a transaction
    const updatedTransfer = await prisma.$transaction(async (tx) => {
      // If approving or completing the transfer, update inventory
      if ((status === 'APPROVED' || status === 'COMPLETED') && transfer.status === 'PENDING') {
        // Check if source store has enough inventory
        const sourceInventory = await tx.inventory.findFirst({
          where: {
            storeId: transfer.sourceStoreId,
            productId: transfer.productId,
          },
        });

        if (!sourceInventory || sourceInventory.quantity < transfer.quantity) {
          throw new Error('Insufficient inventory in source store');
        }

        // Deduct from source inventory
        await tx.inventory.update({
          where: {
            id: sourceInventory.id,
          },
          data: {
            quantity: {
              decrement: transfer.quantity,
            },
          },
        });

        // Add to destination inventory or create if it doesn't exist
        const destInventory = await tx.inventory.findFirst({
          where: {
            storeId: transfer.destStoreId,
            productId: transfer.productId,
          },
        });

        if (destInventory) {
          await tx.inventory.update({
            where: {
              id: destInventory.id,
            },
            data: {
              quantity: {
                increment: transfer.quantity,
              },
            },
          });
        } else {
          await tx.inventory.create({
            data: {
              storeId: transfer.destStoreId,
              productId: transfer.productId,
              quantity: transfer.quantity,
              minimumStock: 5, // Default values
              reorderPoint: 10,
              reorderQuantity: 20,
            },
          });
        }
      }

      // Update transfer status
      return tx.storeTransfer.update({
        where: {
          id,
        },
        data: {
          status,
          ...(status === 'APPROVED' ? { approvedById: session.user.id } : {}),
          ...(status === 'COMPLETED' ? { completedAt: new Date() } : {}),
        },
      });
    });

    return NextResponse.json(updatedTransfer);
  } catch (error) {
    console.error('Error updating inventory transfer:', error);
    return NextResponse.json(
      { error: 'Failed to update inventory transfer' },
      { status: 500 }
    );
  }
}
