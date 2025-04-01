import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// Define the enum locally to match your schema
enum StoreRole {
  MAIN = 'MAIN',
  BRANCH = 'BRANCH'
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    
    // Check if user is authenticated and is super admin
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const data = await req.json();

    // Check if creating main store
    if (data.storeRole === 'MAIN') {
      // Verify no main store exists
      const existingMainStore = await prisma.store.findFirst({
        where: {
          storeRole: 'MAIN'
        } as Prisma.StoreWhereInput
      });

      if (existingMainStore) {
        return new NextResponse('Main store already exists', { status: 400 });
      }
    } else {
      // If creating branch store, verify main store exists
      const mainStore = await prisma.store.findFirst({
        where: {
          storeRole: 'MAIN'
        } as Prisma.StoreWhereInput
      });

      if (!mainStore) {
        return new NextResponse('Main store must be created first', { status: 400 });
      }
    }

    const store = await prisma.store.create({
      data: {
        ...data,
        storeRole: data.storeRole || 'BRANCH',
        createdBy: session.user.id
      }
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('Store creation error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const storeId = searchParams.get('storeId');

    // Super admin can see all stores, others can only see their assigned store
    const stores = await prisma.store.findMany({
      where: session.user.role === 'SUPER_ADMIN' 
        ? {} 
        : {
            UserStore: {
              some: {
                userId: session.user.id
              }
            }
          },
      include: {
        inventory: {
          include: {
            product: true
          }
        },
        UserStore: {
          include: {
            user: true
          }
        }
      }
    });

    return NextResponse.json(stores);
  } catch (error) {
    console.error('Stores fetch error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await req.json();
    const { id, ...data } = body;

    const store = await prisma.store.update({
      where: { id },
      data: {
        ...data,
        operatingHours: data.operatingHours ? JSON.stringify(data.operatingHours) : null,
        features: data.features || [],
      },
    });

    return NextResponse.json(store);
  } catch (error) {
    console.error('Store PATCH error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await auth();
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return new NextResponse('Store ID is required', { status: 400 });
    }

    await prisma.store.delete({
      where: { id },
    });

    return new NextResponse('Store deleted successfully', { status: 200 });
  } catch (error) {
    console.error('Store DELETE error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}







