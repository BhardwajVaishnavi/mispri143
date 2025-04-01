import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const alerts = await prisma.inventory.findMany({
      where: {
        quantity: {
          lte: prisma.raw('reorderPoint')
        }
      },
      include: {
        product: {
          select: {
            name: true
          }
        },
        store: {
          select: {
            name: true
          }
        }
      }
    });

    return NextResponse.json(alerts);
  } catch (error) {
    console.error('Failed to fetch alerts:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}





