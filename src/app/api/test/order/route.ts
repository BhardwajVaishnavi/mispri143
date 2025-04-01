import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    // Get a product to use in the order
    const product = await prisma.product.findFirst({
      where: {
        status: 'ACTIVE'
      }
    });

    if (!product) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'No active products found to create test order'
        },
        { status: 404 }
      );
    }

    // Get or create a test user
    let user = await prisma.user.findFirst({
      where: {
        email: 'test@example.com'
      }
    });

    if (!user) {
      user = await prisma.user.create({
        data: {
          name: 'Test User',
          email: 'test@example.com',
          phone: '+1234567890',
          role: 'CUSTOMER'
        }
      });
    }

    // Get or create a test address
    let address = await prisma.address.findFirst({
      where: {
        userId: user.id
      }
    });

    if (!address) {
      address = await prisma.address.create({
        data: {
          userId: user.id,
          street: '123 Test Street',
          city: 'Test City',
          state: 'Test State',
          postalCode: '12345',
          country: 'Test Country'
        }
      });
    }

    // Create a test order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        status: 'PENDING',
        deliveryDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
        deliveryTime: '14:00-16:00',
        deliveryType: 'HOME_DELIVERY',
        addressId: address.id,
        totalAmount: product.price * 2, // 2 items
        paymentStatus: 'PENDING',
        paymentMethod: 'ONLINE',
        items: {
          create: [
            {
              productId: product.id,
              quantity: 2,
              price: product.price,
              customText: 'Happy Birthday!'
            }
          ]
        }
      },
      include: {
        items: true,
        address: true,
        user: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Test order created successfully',
      order 
    });
  } catch (error) {
    console.error('Error creating test order:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to create test order',
        details: error
      },
      { status: 500 }
    );
  }
}
