import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const slug = params.slug;

    const product = await prisma.product.findFirst({
      where: {
        slug,
      },
      include: {
        category: true,
        variants: true,
        customizationOptions: true,
        ingredients: true,
        nutritionalInfo: true,
        careInstructions: true,
        reviews: {
          take: 5,
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Calculate average rating
    const ratings = {
      average: product.reviews.length > 0
        ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
        : 0,
      count: product.reviews.length,
    };

    // Transform the product to match the expected format in the frontend
    const transformedProduct = {
      ...product,
      ratings,
    };

    return NextResponse.json(transformedProduct);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
