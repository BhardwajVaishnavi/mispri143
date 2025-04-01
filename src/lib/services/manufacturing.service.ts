export class ManufacturingService {
  static async startProduction({
    productId,
    quantity,
    rawMaterials,
  }: {
    productId: string;
    quantity: number;
    rawMaterials: Array<{ materialId: string; quantity: number }>;
  }) {
    return await prisma.$transaction(async (tx) => {
      // Create production record
      const production = await tx.production.create({
        data: {
          id: createId(),
          productId,
          quantity,
          startDate: new Date(),
          status: 'IN_PROGRESS',
          wastage: 0,
        }
      });

      // Record raw material consumption
      for (const material of rawMaterials) {
        await tx.materialConsumption.create({
          data: {
            id: createId(),
            rawMaterialId: material.materialId,
            productionId: production.id,
            quantity: material.quantity,
          }
        });

        // Update raw material stock
        await tx.rawMaterial.update({
          where: { id: material.materialId },
          data: {
            currentStock: { decrement: material.quantity }
          }
        });
      }

      return production;
    });
  }
}