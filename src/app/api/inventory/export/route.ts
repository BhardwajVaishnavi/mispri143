import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { stringify } from 'csv-stringify/sync';

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get('format') || 'csv';
    const storeId = searchParams.get('storeId');

    const inventory = await prisma.inventory.findMany({
      where: storeId ? { storeId } : undefined,
      include: {
        product: true,
        store: true,
      },
    });

    if (format === 'csv') {
      const csvData = inventory.map(item => ({
        'Product ID': item.productId,
        'Product Name': item.product.name,
        'Store': item.store.name,
        'Quantity': item.quantity,
        'Minimum Stock': item.minimumStock,
        'Last Updated': item.updatedAt.toISOString(),
      }));

      const csv = stringify(csvData, { header: true });
      
      return new NextResponse(csv, {
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': 'attachment; filename=inventory-export.csv',
        },
      });
    }

    return NextResponse.json(inventory);
  } catch (error) {
    console.error('Error exporting inventory:', error);
    return NextResponse.json(
      { error: 'Failed to export inventory' },
      { status: 500 }
    );
  }
}