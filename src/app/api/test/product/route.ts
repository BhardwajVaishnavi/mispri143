import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Create a test product with variants and customization options
    const product = await prisma.product.create({
      data: {
        name: 'Test Red Roses Bouquet',
        description: 'A beautiful bouquet of red roses',
        shortDescription: 'Beautiful red roses',
        sku: 'ROSE-RED-001',
        price: 1299.99,
        salePrice: 999.99,
        categoryId: '1', // Replace with an actual category ID from your database
        status: 'ACTIVE',
        featured: true,
        bestseller: true,
        new: true,
        occasions: ['BIRTHDAY', 'ANNIVERSARY', 'VALENTINE'],
        tags: ['roses', 'red', 'bouquet', 'romantic'],
        images: [
          'https://example.com/images/red-roses-1.jpg',
          'https://example.com/images/red-roses-2.jpg',
        ],
        thumbnail: 'https://example.com/images/red-roses-thumb.jpg',
        customizable: true,
        minimumOrderQuantity: 1,
        maximumOrderQuantity: 10,
        leadTime: 2,
        availableForDelivery: true,
        availableForPickup: true,
        freeDelivery: false,
        deliveryFee: 100,
        
        // Create variants
        variants: {
          create: [
            {
              name: 'Small Red Roses Bouquet',
              sku: 'ROSE-RED-S',
              price: 999.99,
              salePrice: 799.99,
              size: 'Small',
              color: 'Red',
              stockQuantity: 10
            },
            {
              name: 'Medium Red Roses Bouquet',
              sku: 'ROSE-RED-M',
              price: 1299.99,
              salePrice: 999.99,
              size: 'Medium',
              color: 'Red',
              stockQuantity: 8
            },
            {
              name: 'Large Red Roses Bouquet',
              sku: 'ROSE-RED-L',
              price: 1599.99,
              salePrice: 1299.99,
              size: 'Large',
              color: 'Red',
              stockQuantity: 5
            }
          ]
        },
        
        // Create customization options
        customizationOptions: {
          create: [
            {
              name: 'Card Message',
              type: 'MESSAGE',
              required: false,
              maxLength: 200,
              additionalPrice: 0
            },
            {
              name: 'Ribbon Color',
              type: 'COLOR',
              required: false,
              options: [
                { id: 'ribbon-red', name: 'Red', price: 0 },
                { id: 'ribbon-blue', name: 'Blue', price: 0 },
                { id: 'ribbon-gold', name: 'Gold', price: 50 }
              ],
              additionalPrice: 0
            },
            {
              name: 'Add-ons',
              type: 'ADDON',
              required: false,
              options: [
                { id: 'addon-chocolate', name: 'Chocolate Box', price: 299.99 },
                { id: 'addon-teddy', name: 'Teddy Bear', price: 399.99 },
                { id: 'addon-wine', name: 'Wine Bottle', price: 599.99 }
              ],
              additionalPrice: 0
            }
          ]
        },
        
        // Create care instructions
        careInstructions: {
          create: {
            wateringFrequency: 'Daily',
            sunlightNeeds: 'Indirect sunlight',
            temperature: '18-24°C',
            shelfLife: '7-10 days',
            storageInfo: 'Keep in a cool place away from direct sunlight',
            additionalNotes: 'Trim stems at an angle every 2-3 days to extend vase life'
          }
        }
      },
      include: {
        variants: true,
        customizationOptions: true,
        careInstructions: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test product created successfully',
      product 
    });
  } catch (error) {
    console.error('Error creating test product:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test product',
        details: error
      },
      { status: 500 }
    );
  }
}
