import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const productions = await prisma.production.findMany({
      include: {
        consumption: {
          include: {
            rawMaterial: true,
          },
        },
        product: true,
      },
      orderBy: {
        startDate: 'desc',
      },
    });

    return NextResponse.json(productions);
  } catch (error) {
    console.error('Error fetching productions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch productions' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { productId, quantity, startDate, materials } = body;

    // Validate product exists
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if there's enough raw materials
    for (const material of materials) {
      const rawMaterial = await prisma.rawMaterial.findUnique({
        where: { id: material.materialId },
      });

      if (!rawMaterial) {
        return NextResponse.json(
          { error: `Raw material with ID ${material.materialId} not found` },
          { status: 404 }
        );
      }

      if (rawMaterial.currentStock < material.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${rawMaterial.name}. Available: ${rawMaterial.currentStock} ${rawMaterial.unit}` },
          { status: 400 }
        );
      }
    }

    // Create production and consume materials in a transaction
    const production = await prisma.$transaction(async (tx) => {
      // Create production record
      const production = await tx.production.create({
        data: {
          productId,
          quantity,
          startDate: new Date(startDate),
          wastage: 0,
          status: 'PLANNED',
        },
      });

      // Create material consumption records
      for (const material of materials) {
        await tx.materialConsumption.create({
          data: {
            rawMaterialId: material.materialId,
            productionId: production.id,
            quantity: material.quantity,
          },
        });
      }

      return production;
    });

    return NextResponse.json(production);
  } catch (error) {
    console.error('Error creating production:', error);
    return NextResponse.json(
      { error: 'Failed to create production' },
      { status: 500 }
    );
  }
}
