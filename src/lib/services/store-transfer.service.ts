import prisma from '@/lib/prisma';

export class StoreTransferService {
  static async getTransferHistory() {
    return await prisma.storeTransfer.findMany({
      include: {
        sourceStore: { select: { name: true } },
        destStore: { select: { name: true } },
        product: { select: { name: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  static async createTransfer(data: {
    sourceStoreId: string;
    destStoreId: string;
    productId: string;
    quantity: number;
    userId: string;
    notes?: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Check source inventory
      const sourceInventory = await tx.inventory.findFirst({
        where: {
          storeId: data.sourceStoreId,
          productId: data.productId,
        },
      });

      if (!sourceInventory || sourceInventory.quantity < data.quantity) {
        throw new Error('Insufficient inventory');
      }

      // Create transfer
      const transfer = await tx.storeTransfer.create({
        data: {
          sourceStoreId: data.sourceStoreId,
          destStoreId: data.destStoreId,
          productId: data.productId,
          quantity: data.quantity,
          createdById: data.userId,
          notes: data.notes,
        },
      });

      // Update source inventory
      await tx.inventory.update({
        where: {
          id: sourceInventory.id
        },
        data: { quantity: { decrement: data.quantity } },
      });

      return transfer;
    });
  }

  static async approveTransfer(transferId: string, userId: string) {
    return await prisma.$transaction(async (tx) => {
      const transfer = await tx.storeTransfer.findUnique({
        where: { id: transferId },
      });

      if (!transfer || transfer.status !== 'PENDING') {
        throw new Error('Invalid transfer or already processed');
      }

      // Update destination inventory
      await tx.inventory.upsert({
        where: {
          id: `${transfer.destStoreId}_${transfer.productId}`
        },
        create: {
          storeId: transfer.destStoreId,
          productId: transfer.productId,
          quantity: transfer.quantity,
        },
        update: {
          quantity: { increment: transfer.quantity },
        },
      });
      
      return transfer;
    });
  }
}




