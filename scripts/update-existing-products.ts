import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateExistingProducts() {
  try {
    console.log('Starting to update existing products...');
    
    // Get all existing products
    const products = await prisma.product.findMany();
    console.log(`Found ${products.length} products to update.`);
    
    // Update each product with new fields
    for (const product of products) {
      console.log(`Updating product: ${product.name} (${product.id})`);
      
      // Determine product category to set appropriate fields
      const category = await prisma.category.findUnique({
        where: { id: product.categoryId }
      });
      
      const categoryName = category?.name?.toUpperCase() || '';
      const isFlower = categoryName.includes('FLOWER');
      const isCake = categoryName.includes('CAKE');
      
      // Update the product with new fields
      await prisma.product.update({
        where: { id: product.id },
        data: {
          shortDescription: product.description.substring(0, 100) + '...',
          slug: product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
          status: 'ACTIVE',
          featured: Math.random() > 0.7, // Randomly set featured
          bestseller: Math.random() > 0.8, // Randomly set bestseller
          new: Math.random() > 0.9, // Randomly set new
          occasions: getRandomOccasions(),
          tags: getRandomTags(categoryName),
          thumbnail: product.images[0] || null,
          minimumOrderQuantity: 1,
          maximumOrderQuantity: 10,
          leadTime: Math.floor(Math.random() * 24) + 1, // Random lead time between 1-24 hours
          availableForDelivery: true,
          availableForPickup: true,
          freeDelivery: Math.random() > 0.7, // Randomly set free delivery
          deliveryFee: Math.random() > 0.7 ? 0 : Math.floor(Math.random() * 200) + 50, // Random delivery fee
        }
      });
      
      // Create variants based on product category
      if (isFlower) {
        await createFlowerVariants(product.id, product.price);
        await createFlowerCustomizationOptions(product.id);
        await createFlowerCareInstructions(product.id);
      } else if (isCake) {
        await createCakeVariants(product.id, product.price);
        await createCakeCustomizationOptions(product.id);
        await createCakeIngredients(product.id);
        await createCakeNutritionalInfo(product.id);
      } else {
        // Generic variants for other products
        await createGenericVariants(product.id, product.price);
      }
    }
    
    console.log('Successfully updated all existing products!');
  } catch (error) {
    console.error('Error updating existing products:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Helper functions
function getRandomOccasions() {
  const occasions = ['BIRTHDAY', 'ANNIVERSARY', 'WEDDING', 'GRADUATION', 'VALENTINE', 'CHRISTMAS', 'DIWALI'];
  return occasions.filter(() => Math.random() > 0.5);
}

function getRandomTags(category: string) {
  const commonTags = ['gift', 'premium', 'bestseller'];
  
  if (category.includes('FLOWER')) {
    return [...commonTags, 'flowers', 'bouquet', 'fresh', 'arrangement'].filter(() => Math.random() > 0.3);
  } else if (category.includes('CAKE')) {
    return [...commonTags, 'cake', 'dessert', 'sweet', 'bakery'].filter(() => Math.random() > 0.3);
  }
  
  return commonTags.filter(() => Math.random() > 0.3);
}

async function createFlowerVariants(productId: string, basePrice: number) {
  const sizes = ['Small', 'Medium', 'Large'];
  const colors = ['Red', 'Pink', 'White', 'Yellow', 'Mixed'];
  
  // Delete existing variants
  await prisma.productVariant.deleteMany({
    where: { productId }
  });
  
  // Create new variants
  for (const size of sizes) {
    const sizeMultiplier = size === 'Small' ? 0.8 : size === 'Medium' ? 1 : 1.3;
    
    await prisma.productVariant.create({
      data: {
        productId,
        name: `${size} Bouquet`,
        sku: `${productId}-${size.substring(0, 1)}`,
        price: Math.round(basePrice * sizeMultiplier),
        salePrice: Math.random() > 0.7 ? Math.round(basePrice * sizeMultiplier * 0.8) : null,
        size,
        color: colors[Math.floor(Math.random() * colors.length)],
        stockQuantity: Math.floor(Math.random() * 20) + 5
      }
    });
  }
}

async function createCakeVariants(productId: string, basePrice: number) {
  const sizes = ['0.5 kg', '1 kg', '2 kg'];
  const flavors = ['Chocolate', 'Vanilla', 'Strawberry', 'Butterscotch', 'Red Velvet'];
  
  // Delete existing variants
  await prisma.productVariant.deleteMany({
    where: { productId }
  });
  
  // Create new variants
  for (const size of sizes) {
    const sizeValue = parseFloat(size.split(' ')[0]);
    const sizeMultiplier = sizeValue;
    
    for (const flavor of flavors) {
      if (Math.random() > 0.5) { // Randomly create variants to avoid too many
        await prisma.productVariant.create({
          data: {
            productId,
            name: `${flavor} Cake - ${size}`,
            sku: `${productId}-${flavor.substring(0, 3)}-${sizeValue}`,
            price: Math.round(basePrice * sizeMultiplier),
            salePrice: Math.random() > 0.7 ? Math.round(basePrice * sizeMultiplier * 0.9) : null,
            size,
            flavor,
            weight: sizeValue,
            stockQuantity: Math.floor(Math.random() * 10) + 2
          }
        });
      }
    }
  }
}

async function createGenericVariants(productId: string, basePrice: number) {
  const sizes = ['Small', 'Medium', 'Large'];
  
  // Delete existing variants
  await prisma.productVariant.deleteMany({
    where: { productId }
  });
  
  // Create new variants
  for (const size of sizes) {
    if (Math.random() > 0.3) { // Randomly create variants
      const sizeMultiplier = size === 'Small' ? 0.8 : size === 'Medium' ? 1 : 1.2;
      
      await prisma.productVariant.create({
        data: {
          productId,
          name: `${size} Size`,
          sku: `${productId}-${size.substring(0, 1)}`,
          price: Math.round(basePrice * sizeMultiplier),
          salePrice: Math.random() > 0.7 ? Math.round(basePrice * sizeMultiplier * 0.85) : null,
          size,
          stockQuantity: Math.floor(Math.random() * 15) + 5
        }
      });
    }
  }
}

async function createFlowerCustomizationOptions(productId: string) {
  // Delete existing customization options
  await prisma.productCustomizationOption.deleteMany({
    where: { productId }
  });
  
  // Create new customization options
  await prisma.productCustomizationOption.create({
    data: {
      productId,
      name: 'Card Message',
      type: 'MESSAGE',
      required: false,
      maxLength: 200,
      additionalPrice: 0
    }
  });
  
  await prisma.productCustomizationOption.create({
    data: {
      productId,
      name: 'Ribbon Color',
      type: 'COLOR',
      required: false,
      options: [
        { id: 'ribbon-red', name: 'Red', price: 0 },
        { id: 'ribbon-blue', name: 'Blue', price: 0 },
        { id: 'ribbon-gold', name: 'Gold', price: 50 }
      ],
      additionalPrice: 0
    }
  });
  
  await prisma.productCustomizationOption.create({
    data: {
      productId,
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
  });
}

async function createCakeCustomizationOptions(productId: string) {
  // Delete existing customization options
  await prisma.productCustomizationOption.deleteMany({
    where: { productId }
  });
  
  // Create new customization options
  await prisma.productCustomizationOption.create({
    data: {
      productId,
      name: 'Cake Message',
      type: 'TEXT',
      required: false,
      maxLength: 50,
      additionalPrice: 0
    }
  });
  
  await prisma.productCustomizationOption.create({
    data: {
      productId,
      name: 'Toppings',
      type: 'TOPPING',
      required: false,
      options: [
        { id: 'topping-choco', name: 'Chocolate Chips', price: 49.99 },
        { id: 'topping-fruit', name: 'Fresh Fruits', price: 99.99 },
        { id: 'topping-nuts', name: 'Mixed Nuts', price: 79.99 }
      ],
      additionalPrice: 0
    }
  });
}

async function createFlowerCareInstructions(productId: string) {
  // Delete existing care instructions
  await prisma.careInstructions.deleteMany({
    where: { productId }
  });
  
  // Create new care instructions
  await prisma.careInstructions.create({
    data: {
      productId,
      wateringFrequency: 'Daily',
      sunlightNeeds: 'Indirect sunlight',
      temperature: '18-24°C',
      shelfLife: '7-10 days',
      storageInfo: 'Keep in a cool place away from direct sunlight',
      additionalNotes: 'Trim stems at an angle every 2-3 days to extend vase life'
    }
  });
}

async function createCakeIngredients(productId: string) {
  // Delete existing ingredients
  await prisma.productIngredient.deleteMany({
    where: { productId }
  });
  
  // Create new ingredients
  const ingredients = [
    { name: 'Flour', quantity: 250, unit: 'g', allergen: false },
    { name: 'Sugar', quantity: 200, unit: 'g', allergen: false },
    { name: 'Butter', quantity: 150, unit: 'g', allergen: true },
    { name: 'Eggs', quantity: 4, unit: 'pcs', allergen: true },
    { name: 'Milk', quantity: 100, unit: 'ml', allergen: true },
    { name: 'Baking Powder', quantity: 10, unit: 'g', allergen: false },
    { name: 'Vanilla Extract', quantity: 5, unit: 'ml', allergen: false }
  ];
  
  for (const ingredient of ingredients) {
    await prisma.productIngredient.create({
      data: {
        productId,
        ...ingredient
      }
    });
  }
}

async function createCakeNutritionalInfo(productId: string) {
  // Delete existing nutritional info
  await prisma.nutritionalInfo.deleteMany({
    where: { productId }
  });
  
  // Create new nutritional info
  await prisma.nutritionalInfo.create({
    data: {
      productId,
      calories: 350,
      fat: 18,
      carbs: 45,
      protein: 5,
      sugar: 30,
      allergens: ['Milk', 'Eggs', 'Wheat', 'Soy']
    }
  });
}

// Run the update function
updateExistingProducts()
  .then(() => console.log('Script completed successfully'))
  .catch(e => console.error('Script failed:', e));
