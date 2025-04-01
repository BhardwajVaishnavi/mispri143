import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { Prisma } from '@prisma/client';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get('search') || '';
  const category = searchParams.get('category');
  const subcategory = searchParams.get('subcategory');
  const featured = searchParams.get('featured') === 'true';
  const bestseller = searchParams.get('bestseller') === 'true';
  const newProducts = searchParams.get('new') === 'true';
  const occasion = searchParams.get('occasion');
  const minPrice = searchParams.get('minPrice') ? parseFloat(searchParams.get('minPrice')!) : undefined;
  const maxPrice = searchParams.get('maxPrice') ? parseFloat(searchParams.get('maxPrice')!) : undefined;
  const status = searchParams.get('status') || 'ACTIVE';
  const page = parseInt(searchParams.get('page') || '1');
  const limit = parseInt(searchParams.get('limit') || '10');

  try {
    // Build the where clause based on the search parameters
    let where: Prisma.ProductWhereInput = {
      AND: [
        {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { description: { contains: search, mode: 'insensitive' } },
            { shortDescription: { contains: search, mode: 'insensitive' } },
            { tags: { has: search } },
          ],
        },
      ],
    };

    // Add category filter if provided
    if (category) {
      where.AND!.push({
        categoryId: category,
      });
    }

    // Add subcategory filter if provided
    if (subcategory) {
      where.AND!.push({
        subcategory,
      });
    }

    // Add featured filter if provided
    if (featured) {
      where.AND!.push({
        featured: true,
      });
    }

    // Add bestseller filter if provided
    if (bestseller) {
      where.AND!.push({
        bestseller: true,
      });
    }

    // Add new filter if provided
    if (newProducts) {
      where.AND!.push({
        new: true,
      });
    }

    // Add occasion filter if provided
    if (occasion) {
      where.AND!.push({
        occasions: { has: occasion },
      });
    }

    // Add price range filter if provided
    if (minPrice !== undefined || maxPrice !== undefined) {
      const priceFilter: Prisma.ProductWhereInput = {};

      if (minPrice !== undefined) {
        priceFilter.price = { gte: minPrice };
      }

      if (maxPrice !== undefined) {
        priceFilter.price = { ...priceFilter.price, lte: maxPrice };
      }

      where.AND!.push(priceFilter);
    }

    // Add status filter
    if (status !== 'all') {
      where.AND!.push({
        status,
      });
    }

    const [products, total] = await Promise.all([
      prisma.product.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: true,
          variants: true,
          customizationOptions: true,
          ingredients: true,
          nutritionalInfo: true,
          careInstructions: true,
        },
      }),
      prisma.product.count({ where }),
    ]);

    return NextResponse.json({
      products,
      pagination: {
        total,
        pages: Math.ceil(total / limit),
        page,
        limit,
      },
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Extract nested data for creating related records
    const {
      variants,
      customizationOptions,
      ingredients,
      nutritionalInfo,
      careInstructions,
      ...productData
    } = body;

    // Create the product with all related data in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Create the main product
      const newProduct = await tx.product.create({
        data: {
          ...productData,
          // Create variants if provided
          variants: variants?.length > 0 ? {
            create: variants.map((variant: any) => ({
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              salePrice: variant.salePrice,
              size: variant.size,
              color: variant.color,
              flavor: variant.flavor,
              weight: variant.weight,
              dimensions: variant.dimensions,
              images: variant.images || [],
              stockQuantity: variant.stockQuantity || 0
            }))
          } : undefined,

          // Create customization options if provided
          customizationOptions: customizationOptions?.length > 0 ? {
            create: customizationOptions.map((option: any) => ({
              name: option.name,
              type: option.type,
              required: option.required || false,
              options: option.options,
              maxLength: option.maxLength,
              additionalPrice: option.additionalPrice || 0
            }))
          } : undefined,

          // Create ingredients if provided
          ingredients: ingredients?.length > 0 ? {
            create: ingredients.map((ingredient: any) => ({
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              allergen: ingredient.allergen || false
            }))
          } : undefined,

          // Create nutritional info if provided
          nutritionalInfo: nutritionalInfo ? {
            create: {
              calories: nutritionalInfo.calories,
              fat: nutritionalInfo.fat,
              carbs: nutritionalInfo.carbs,
              protein: nutritionalInfo.protein,
              sugar: nutritionalInfo.sugar,
              allergens: nutritionalInfo.allergens || []
            }
          } : undefined,

          // Create care instructions if provided
          careInstructions: careInstructions ? {
            create: {
              wateringFrequency: careInstructions.wateringFrequency,
              sunlightNeeds: careInstructions.sunlightNeeds,
              temperature: careInstructions.temperature,
              shelfLife: careInstructions.shelfLife,
              storageInfo: careInstructions.storageInfo,
              additionalNotes: careInstructions.additionalNotes
            }
          } : undefined
        },
        include: {
          category: true,
          variants: true,
          customizationOptions: true,
          ingredients: true,
          nutritionalInfo: true,
          careInstructions: true
        }
      });

      return newProduct;
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error creating product:', error);
    return NextResponse.json(
      { error: 'Failed to create product' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = await request.json();
    const {
      id,
      variants,
      customizationOptions,
      ingredients,
      nutritionalInfo,
      careInstructions,
      ...updateData
    } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Update the product with all related data in a transaction
    const product = await prisma.$transaction(async (tx) => {
      // Update the main product
      const updatedProduct = await tx.product.update({
        where: { id },
        data: {
          ...updateData,
        },
      });

      // Update variants if provided
      if (variants) {
        // Delete existing variants
        await tx.productVariant.deleteMany({
          where: { productId: id },
        });

        // Create new variants
        if (variants.length > 0) {
          await tx.productVariant.createMany({
            data: variants.map((variant: any) => ({
              productId: id,
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              salePrice: variant.salePrice,
              size: variant.size,
              color: variant.color,
              flavor: variant.flavor,
              weight: variant.weight,
              dimensions: variant.dimensions,
              images: variant.images || [],
              stockQuantity: variant.stockQuantity || 0
            })),
          });
        }
      }

      // Update customization options if provided
      if (customizationOptions) {
        // Delete existing customization options
        await tx.productCustomizationOption.deleteMany({
          where: { productId: id },
        });

        // Create new customization options
        if (customizationOptions.length > 0) {
          await tx.productCustomizationOption.createMany({
            data: customizationOptions.map((option: any) => ({
              productId: id,
              name: option.name,
              type: option.type,
              required: option.required || false,
              options: option.options,
              maxLength: option.maxLength,
              additionalPrice: option.additionalPrice || 0
            })),
          });
        }
      }

      // Update ingredients if provided
      if (ingredients) {
        // Delete existing ingredients
        await tx.productIngredient.deleteMany({
          where: { productId: id },
        });

        // Create new ingredients
        if (ingredients.length > 0) {
          await tx.productIngredient.createMany({
            data: ingredients.map((ingredient: any) => ({
              productId: id,
              name: ingredient.name,
              quantity: ingredient.quantity,
              unit: ingredient.unit,
              allergen: ingredient.allergen || false
            })),
          });
        }
      }

      // Update nutritional info if provided
      if (nutritionalInfo) {
        // Delete existing nutritional info
        await tx.nutritionalInfo.deleteMany({
          where: { productId: id },
        });

        // Create new nutritional info
        await tx.nutritionalInfo.create({
          data: {
            productId: id,
            calories: nutritionalInfo.calories,
            fat: nutritionalInfo.fat,
            carbs: nutritionalInfo.carbs,
            protein: nutritionalInfo.protein,
            sugar: nutritionalInfo.sugar,
            allergens: nutritionalInfo.allergens || []
          },
        });
      }

      // Update care instructions if provided
      if (careInstructions) {
        // Delete existing care instructions
        await tx.careInstructions.deleteMany({
          where: { productId: id },
        });

        // Create new care instructions
        await tx.careInstructions.create({
          data: {
            productId: id,
            wateringFrequency: careInstructions.wateringFrequency,
            sunlightNeeds: careInstructions.sunlightNeeds,
            temperature: careInstructions.temperature,
            shelfLife: careInstructions.shelfLife,
            storageInfo: careInstructions.storageInfo,
            additionalNotes: careInstructions.additionalNotes
          },
        });
      }

      // Return the updated product with all related data
      return tx.product.findUnique({
        where: { id },
        include: {
          category: true,
          variants: true,
          customizationOptions: true,
          ingredients: true,
          nutritionalInfo: true,
          careInstructions: true
        },
      });
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error updating product:', error);
    return NextResponse.json(
      { error: 'Failed to update product' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('id');

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    const product = await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json(
      { error: 'Failed to delete product' },
      { status: 500 }
    );
  }
}
