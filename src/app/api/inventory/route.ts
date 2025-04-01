import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { InventoryService } from '@/lib/services/inventory.service';
import { InventoryStatus } from '@/types/inventory';

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status') as InventoryStatus | undefined;
    
    // Validate status if present
    if (status && !['ACTIVE', 'INACTIVE', 'ON_HOLD', 'DISCONTINUED'].includes(status)) {
      return new NextResponse('Invalid status value', { status: 400 });
    }

    const params = {
      search: searchParams.get('search') || undefined,
      storeId: searchParams.get('storeId') || undefined,
      status,
      lowStock: searchParams.get('lowStock') === 'true',
      expiringWithinDays: parseInt(searchParams.get('expiringWithinDays') || '0') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      sortBy: searchParams.get('sortBy') || undefined,
      sortOrder: (searchParams.get('sortOrder') || 'desc') as 'asc' | 'desc'
    };

    const result = await InventoryService.getInventory(params);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Inventory GET error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const result = await InventoryService.batchUpsert(body.items);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Inventory POST error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}






