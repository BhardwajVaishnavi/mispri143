import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const history = await prisma.inventoryHistory.findMany({
      where: {
        inventoryId: params.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        inventory: {
          include: {
            product: true
          }
        }
      }
    });

    if (!history) {
      return NextResponse.json(
        { error: 'History not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ history });
  } catch (error) {
    console.error('Error fetching inventory history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch inventory history' },
      { status: 500 }
    );
  }
}