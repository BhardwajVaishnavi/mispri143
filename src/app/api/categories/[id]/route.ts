import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import mockDb from '@/lib/mock-db';

// Use mock database if real database connection fails
const useDb = process.env.NODE_ENV === 'production' ? prisma : mockDb;

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;

    try {
      // Try to use Prisma first
      const category = await prisma.category.findUnique({
        where: { id },
        include: {
          products: true,
          children: true,
          parent: true,
        },
      });

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    } catch (prismaError) {
      console.log('Prisma error, falling back to mock database:', prismaError);

      // Fall back to mock database
      const category = await mockDb.findCategoryById(id);

      if (!category) {
        return NextResponse.json(
          { error: 'Category not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(category);
    }
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}
