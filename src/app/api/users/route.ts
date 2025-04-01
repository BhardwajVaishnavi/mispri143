import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { hash } from 'bcrypt';

export async function GET(_request: Request) {
  try {
    const session = await auth();

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        createdAt: true,
        permissions: true,
        UserStore: {
          select: {
            // @ts-ignore - role exists in UserStore model
            role: true,
            store: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Transform the data to match the expected format
    const formattedUsers = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: (user as any).status,
      createdAt: user.createdAt.toISOString(),
      permissions: (user as any).permissions,
      stores: (user as any).UserStore.map((us: any) => ({
        role: us.role,
        store: us.store,
      })),
    }));

    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session || !['SUPER_ADMIN', 'ADMIN'].includes(session.user.role)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, password, role } = body;

    // Validate input
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if email is already in use
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already in use' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 10);

    // Set default permissions based on role
    let permissions: string[] = [];

    switch (role) {
      case 'SUPER_ADMIN':
        permissions = ['ALL'];
        break;
      case 'ADMIN':
        permissions = [
          'VIEW_STORES', 'MANAGE_STORES', 'CREATE_STORE',
          'VIEW_PRODUCTS', 'MANAGE_PRODUCTS', 'CREATE_PRODUCT',
          'VIEW_INVENTORY', 'MANAGE_INVENTORY', 'TRANSFER_INVENTORY',
          'VIEW_ORDERS', 'MANAGE_ORDERS', 'PROCESS_ORDERS',
          'VIEW_CUSTOMERS', 'MANAGE_CUSTOMERS',
          'VIEW_STAFF', 'MANAGE_STAFF',
          'VIEW_WAREHOUSE', 'VIEW_PRODUCTION',
          'VIEW_REPORTS', 'VIEW_ANALYTICS',
          'VIEW_SETTINGS'
        ];
        break;
      case 'MANAGER':
        permissions = [
          'VIEW_STORES',
          'VIEW_PRODUCTS', 'MANAGE_PRODUCTS',
          'VIEW_INVENTORY', 'MANAGE_INVENTORY', 'TRANSFER_INVENTORY',
          'VIEW_ORDERS', 'MANAGE_ORDERS', 'PROCESS_ORDERS',
          'VIEW_CUSTOMERS',
          'VIEW_STAFF',
          'VIEW_REPORTS'
        ];
        break;
      case 'STAFF':
        permissions = [
          'VIEW_PRODUCTS',
          'VIEW_INVENTORY',
          'VIEW_ORDERS', 'PROCESS_ORDERS',
          'VIEW_CUSTOMERS'
        ];
        break;
      case 'CASHIER':
        permissions = [
          'VIEW_PRODUCTS',
          'VIEW_ORDERS', 'PROCESS_ORDERS'
        ];
        break;
      default:
        permissions = [];
    }

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        // @ts-ignore - status exists in the User model
        status: 'ACTIVE',
        // @ts-ignore - permissions exists in the User model
        permissions,
      },
    });

    return NextResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      status: (user as any).status,
      createdAt: user.createdAt.toISOString(),
      permissions: (user as any).permissions,
      stores: [],
    });
  } catch (error) {
    console.error('Error creating user:', error);
    return NextResponse.json(
      { error: 'Failed to create user' },
      { status: 500 }
    );
  }
}
