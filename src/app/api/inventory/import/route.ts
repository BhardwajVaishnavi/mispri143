import { NextResponse } from 'next/server';
import { InventoryService } from '@/lib/services/inventory.service';
import { auth } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session) return new NextResponse('Unauthorized', { status: 401 });

    const formData = await req.formData();
    const file = formData.get('file') as File;
    const storeId = formData.get('storeId') as string;

    if (!file || !storeId) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const fileContent = await file.text();
    const result = await InventoryService.importFromCsv(fileContent, storeId);
    return NextResponse.json(result);
  } catch (error) {
    console.error('Import POST error:', error);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
