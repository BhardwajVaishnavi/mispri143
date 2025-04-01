import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/services/inventory.service';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const body = await req.json();
    const result = await InventoryService.recordMovement({
      ...body,
      performedBy: session.user.id
    });
    return NextResponse.json(result);
  } catch (error) {
    console.error('Movement POST error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}