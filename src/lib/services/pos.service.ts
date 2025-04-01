import prisma from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

export class POSService {
  static async createSale({
    storeId,
    items,
    paymentMethod,
    customerId,
    discountCode,
    staffId,
  }: {
    storeId: string;
    items: Array<{ productId: string; quantity: number }>;
    paymentMethod: 'CASH' | 'ONLINE';
    customerId?: string;
    discountCode?: string;
    staffId: string;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create sale
      const saleId = createId();
      
      // Apply discount if code exists
      let discount = 0;
      if (discountCode) {
        const coupon = await tx.discount.findUnique({
          where: { code: discountCode }
        });
        if (coupon) discount = coupon.amount;
      }

      // Process items and update inventory
      for (const item of items) {
        await tx.inventory.update({
          where: {
            productId_storeId: {
              productId: item.productId,
              storeId: storeId
            }
          },
          data: {
            quantity: { decrement: item.quantity }
          }
        });
      }

      // Generate receipt number and create sale record
      // Return sale details for receipt printing
    });
  }
}