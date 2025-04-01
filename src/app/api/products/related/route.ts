import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');
    const category = searchParams.get('category');
    const limit = parseInt(searchParams.get('limit') || '4');

    if (!productId || !category) {
      return NextResponse.json(
        { error: 'Product ID and category are required' },
        { status: 400 }
      );
    }

    // Find related products in the same category, excluding the current product
    const relatedProducts = await prisma.product.findMany({
      where: {
        AND: [
          { id: { not: productId } },
          { 
            OR: [
              { categoryId: category },
              { subcategory: category }
            ]
          },
          { status: 'ACTIVE' }
        ],
      },
      take: limit,
      orderBy: [
        { bestseller: 'desc' },
        { createdAt: 'desc' },
      ],
      select: {
        id: true,
        name: true,
        slug: true,
        price: true,
        salePrice: true,
        thumbnail: true,
        new: true,
        bestseller: true,
      },
    });

    return NextResponse.json(relatedProducts);
  } catch (error) {
    console.error('Error fetching related products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch related products' },
      { status: 500 }
    );
  }
}
