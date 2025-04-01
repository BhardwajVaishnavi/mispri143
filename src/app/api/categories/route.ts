import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import mockDb from '@/lib/mock-db';

// Use mock database if real database connection fails
const useDb = process.env.NODE_ENV === 'production' ? prisma : mockDb;

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';

    try {
      // Try to use Prisma first
      const categories = await prisma.category.findMany({
        where: {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
          ],
        },
        include: {
          products: {
            select: {
              id: true,
            },
          },
        },
      });

      // Transform the data to include product count
      const transformedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        parentId: category.parentId,
        productsCount: category.products.length,
      }));

      return NextResponse.json(transformedCategories);
    } catch (prismaError) {
      console.log('Prisma error, falling back to mock database:', prismaError);

      // Fall back to mock database
      const categories = await mockDb.findCategories(search);

      // Transform the data to include product count
      const transformedCategories = categories.map(category => ({
        id: category.id,
        name: category.name,
        description: category.description,
        slug: category.slug,
        image: category.image,
        parentId: category.parentId,
        productsCount: category.products.length,
      }));

      return NextResponse.json(transformedCategories);
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, slug, image, parentId } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    try {
      // Try to use Prisma first
      const category = await prisma.category.create({
        data: {
          name,
          description,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          image,
          parentId,
        },
      });

      return NextResponse.json(category);
    } catch (prismaError) {
      console.log('Prisma error, falling back to mock database:', prismaError);

      // Fall back to mock database
      const category = await mockDb.createCategory({
        name,
        description,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image,
        parentId,
      });

      return NextResponse.json(category);
    }
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description, slug, image, parentId } = body;

    // Validate required fields
    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Category name is required' },
        { status: 400 }
      );
    }

    try {
      // Try to use Prisma first
      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          description,
          slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
          image,
          parentId,
        },
      });

      return NextResponse.json(category);
    } catch (prismaError) {
      console.log('Prisma error, falling back to mock database:', prismaError);

      // Fall back to mock database
      const category = await mockDb.updateCategory(id, {
        name,
        description,
        slug: slug || name.toLowerCase().replace(/\s+/g, '-'),
        image,
        parentId,
      });

      return NextResponse.json(category);
    }
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Category ID is required' },
        { status: 400 }
      );
    }

    try {
      // Try to use Prisma first
      // Check if the category has products
      const productsCount = await prisma.product.count({
        where: { categoryId: id },
      });

      if (productsCount > 0) {
        return NextResponse.json(
          { error: 'Cannot delete category with associated products' },
          { status: 400 }
        );
      }

      // Check if the category has child categories
      const childrenCount = await prisma.category.count({
        where: { parentId: id },
      });

      if (childrenCount > 0) {
        return NextResponse.json(
          { error: 'Cannot delete category with child categories' },
          { status: 400 }
        );
      }

      // Delete the category
      const category = await prisma.category.delete({
        where: { id },
      });

      return NextResponse.json(category);
    } catch (prismaError) {
      console.log('Prisma error, falling back to mock database:', prismaError);

      try {
        // Fall back to mock database
        const category = await mockDb.deleteCategory(id);
        return NextResponse.json(category);
      } catch (mockError) {
        if (mockError instanceof Error && mockError.message.includes('associated products')) {
          return NextResponse.json(
            { error: 'Cannot delete category with associated products' },
            { status: 400 }
          );
        }
        if (mockError instanceof Error && mockError.message.includes('child categories')) {
          return NextResponse.json(
            { error: 'Cannot delete category with child categories' },
            { status: 400 }
          );
        }
        throw mockError;
      }
    }
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}
