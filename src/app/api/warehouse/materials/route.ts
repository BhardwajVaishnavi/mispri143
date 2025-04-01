import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const warehouseId = searchParams.get('warehouseId');

    const whereClause = warehouseId ? { warehouseId } : {};

    const materials = await prisma.rawMaterial.findMany({
      where: whereClause,
      include: {
        warehouse: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(materials);
  } catch (error) {
    console.error('Error fetching raw materials:', error);
    return NextResponse.json(
      { error: 'Failed to fetch raw materials' },
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
    const { name, quantity, unit, minimumStock, currentStock, warehouseId } = body;

    // Validate warehouse exists
    const warehouse = await prisma.warehouse.findUnique({
      where: { id: warehouseId },
    });

    if (!warehouse) {
      return NextResponse.json(
        { error: 'Warehouse not found' },
        { status: 404 }
      );
    }

    const material = await prisma.rawMaterial.create({
      data: {
        name,
        quantity,
        unit,
        minimumStock,
        currentStock,
        warehouseId,
      },
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('Error creating raw material:', error);
    return NextResponse.json(
      { error: 'Failed to create raw material' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { id, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      );
    }

    const material = await prisma.rawMaterial.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('Error updating raw material:', error);
    return NextResponse.json(
      { error: 'Failed to update raw material' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const materialId = searchParams.get('id');

    if (!materialId) {
      return NextResponse.json(
        { error: 'Material ID is required' },
        { status: 400 }
      );
    }

    // Check if this material is used in any production
    const consumptionCount = await prisma.materialConsumption.count({
      where: { rawMaterialId: materialId },
    });

    if (consumptionCount > 0) {
      return NextResponse.json(
        { error: 'Cannot delete material that has been used in production. Consider marking it as inactive instead.' },
        { status: 400 }
      );
    }

    const material = await prisma.rawMaterial.delete({
      where: { id: materialId },
    });

    return NextResponse.json(material);
  } catch (error) {
    console.error('Error deleting raw material:', error);
    return NextResponse.json(
      { error: 'Failed to delete raw material' },
      { status: 500 }
    );
  }
}
