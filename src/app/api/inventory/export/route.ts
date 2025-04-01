import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

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
      // Simple CSV generation without csv-stringify
      const headers = ['Product ID', 'Product Name', 'Store', 'Quantity', 'Minimum Stock', 'Last Updated'];

      let csv = headers.join(',') + '\n';

      inventory.forEach(item => {
        const row = [
          item.productId,
          `"${item.product.name.replace(/"/g, '""')}"`,
          `"${item.store.name.replace(/"/g, '""')}"`,
          item.quantity,
          item.minimumStock,
          item.updatedAt.toISOString()
        ];
        csv += row.join(',') + '\n';
      });

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