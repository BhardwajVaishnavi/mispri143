import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createId } from '@paralleldrive/cuid2';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Check if main store already exists
    const existingMainStore = await prisma.store.findFirst({
      where: { storeRole: 'MAIN' }
    });

    if (existingMainStore) {
      return new NextResponse('Main store already exists', { status: 400 });
    }

    const body = await req.json();
    
    // Create main store
    const mainStore = await prisma.store.create({
      data: {
        id: createId(),
        ...body,
        storeRole: 'MAIN',
        status: 'ACTIVE',
        createdBy: session.user.id,
        UserStore: {
          create: {
            userId: session.user.id,
            role: 'STORE_MANAGER'
          }
        }
      }
    });

    return NextResponse.json(mainStore);
  } catch (error) {
    console.error('Main store creation error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}