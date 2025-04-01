import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { z } from 'zod';

const batchDeleteSchema = z.object({
  ids: z.array(z.string())
});

export async function DELETE(request: Request) {
  try {
    const body = await request.json();
    const validated = batchDeleteSchema.parse(body);

    // Delete related history records first
    await prisma.inventoryHistory.deleteMany({
      where: {
        inventoryId: {
          in: validated.ids
        }
      }
    });

    // Then delete the inventory records
    await prisma.inventory.deleteMany({
      where: {
        id: {
          in: validated.ids
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    console.error('Error deleting inventory items:', error);
    return NextResponse.json(
      { error: 'Failed to delete inventory items' },
      { status: 500 }
    );
  }
}