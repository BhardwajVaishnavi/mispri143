import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productionId = params.id;
    const { status } = await request.json();

    // Validate status
    if (!['PLANNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].includes(status)) {
      return NextResponse.json(
        { error: 'Invalid status value' },
        { status: 400 }
      );
    }

    // Get the production
    const production = await prisma.production.findUnique({
      where: { id: productionId },
      include: {
        consumption: {
          include: {
            rawMaterial: true,
          },
        },
      },
    });

    if (!production) {
      return NextResponse.json(
        { error: 'Production not found' },
        { status: 404 }
      );
    }

    // Handle status change in a transaction
    const updatedProduction = await prisma.$transaction(async (tx) => {
      // If changing to IN_PROGRESS, deduct materials from inventory
      if (status === 'IN_PROGRESS' && production.status === 'PLANNED') {
        for (const consumption of production.consumption) {
          // Update raw material stock
          await tx.rawMaterial.update({
            where: { id: consumption.rawMaterialId },
            data: {
              currentStock: {
                decrement: consumption.quantity,
              },
            },
          });
        }
      }

      // If cancelling an IN_PROGRESS production, return materials to inventory
      if (status === 'CANCELLED' && production.status === 'IN_PROGRESS') {
        for (const consumption of production.consumption) {
          // Return raw material stock
          await tx.rawMaterial.update({
            where: { id: consumption.rawMaterialId },
            data: {
              currentStock: {
                increment: consumption.quantity,
              },
            },
          });
        }
      }

      // If completing a production, add to inventory
      if (status === 'COMPLETED' && production.status === 'IN_PROGRESS') {
        // Add finished products to inventory (main warehouse/store)
        const mainStore = await tx.store.findFirst({
          where: { storeRole: 'MAIN' },
        });

        if (mainStore) {
          // Check if inventory entry exists
          const existingInventory = await tx.inventory.findFirst({
            where: {
              storeId: mainStore.id,
              productId: production.productId,
            },
          });

          if (existingInventory) {
            // Update existing inventory
            await tx.inventory.update({
              where: {
                id: existingInventory.id,
              },
              data: {
                quantity: {
                  increment: production.quantity,
                },
              },
            });
          } else {
            // Create new inventory entry
            await tx.inventory.create({
              data: {
                storeId: mainStore.id,
                productId: production.productId,
                quantity: production.quantity,
                minimumStock: 5, // Default values
                reorderPoint: 10,
                reorderQuantity: 20,
              },
            });
          }
        }
      }

      // Update production status
      return tx.production.update({
        where: { id: productionId },
        data: {
          status,
          ...(status === 'COMPLETED' ? { endDate: new Date() } : {}),
        },
      });
    });

    return NextResponse.json(updatedProduction);
  } catch (error) {
    console.error('Error updating production status:', error);
    return NextResponse.json(
      { error: 'Failed to update production status' },
      { status: 500 }
    );
  }
}
