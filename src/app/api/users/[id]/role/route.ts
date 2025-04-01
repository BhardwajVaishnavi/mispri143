import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();
    
    if (!session || session.user.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = params.id;
    const { role } = await request.json();

    // Validate role
    const validRoles = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CASHIER'];
    if (!validRoles.includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      );
    }

    // Get the user
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Set default permissions based on new role
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

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        role,
        permissions,
      },
    });

    return NextResponse.json({
      id: updatedUser.id,
      role: updatedUser.role,
      permissions: updatedUser.permissions,
    });
  } catch (error) {
    console.error('Error updating user role:', error);
    return NextResponse.json(
      { error: 'Failed to update user role' },
      { status: 500 }
    );
  }
}
