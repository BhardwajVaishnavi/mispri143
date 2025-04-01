// Mock database for development
class MockDatabase {
  private categories: any[] = [
    { 
      id: '1', 
      name: 'Flowers', 
      description: 'Beautiful flower arrangements', 
      slug: 'flowers',
      image: null,
      parentId: null,
      products: []
    },
    { 
      id: '2', 
      name: 'Cakes', 
      description: 'Delicious cakes for all occasions', 
      slug: 'cakes',
      image: null,
      parentId: null,
      products: []
    },
    { 
      id: '3', 
      name: 'Gift Baskets', 
      description: 'Curated gift baskets', 
      slug: 'gift-baskets',
      image: null,
      parentId: null,
      products: []
    },
    { 
      id: '4', 
      name: 'Chocolates', 
      description: 'Premium chocolates', 
      slug: 'chocolates',
      image: null,
      parentId: null,
      products: []
    },
    { 
      id: '5', 
      name: 'Plants', 
      description: 'Indoor and outdoor plants', 
      slug: 'plants',
      image: null,
      parentId: null,
      products: []
    }
  ];

  private products: any[] = [
    {
      id: '1',
      name: 'Red Roses Bouquet',
      description: 'Beautiful bouquet of red roses',
      shortDescription: 'Beautiful red roses',
      price: 1299.99,
      categoryId: '1',
      status: 'ACTIVE',
      images: ['https://example.com/images/red-roses.jpg'],
      thumbnail: 'https://example.com/images/red-roses.jpg',
      featured: true,
      bestseller: true,
      new: false,
      occasions: ['Valentine', 'Anniversary'],
      tags: ['roses', 'red', 'bouquet'],
      variants: [],
      customizationOptions: [],
      ingredients: [],
      nutritionalInfo: null,
      careInstructions: null
    },
    {
      id: '2',
      name: 'Chocolate Cake',
      description: 'Delicious chocolate cake',
      shortDescription: 'Rich chocolate cake',
      price: 899.99,
      categoryId: '2',
      status: 'ACTIVE',
      images: ['https://example.com/images/chocolate-cake.jpg'],
      thumbnail: 'https://example.com/images/chocolate-cake.jpg',
      featured: false,
      bestseller: true,
      new: false,
      occasions: ['Birthday', 'Celebration'],
      tags: ['cake', 'chocolate', 'dessert'],
      variants: [],
      customizationOptions: [],
      ingredients: [],
      nutritionalInfo: null,
      careInstructions: null
    },
    {
      id: '3',
      name: 'Premium Gift Basket',
      description: 'Premium gift basket with assorted items',
      shortDescription: 'Luxury gift basket',
      price: 1499.99,
      categoryId: '3',
      status: 'ACTIVE',
      images: ['https://example.com/images/gift-basket.jpg'],
      thumbnail: 'https://example.com/images/gift-basket.jpg',
      featured: true,
      bestseller: false,
      new: true,
      occasions: ['Corporate', 'Thank You'],
      tags: ['gift', 'basket', 'premium'],
      variants: [],
      customizationOptions: [],
      ingredients: [],
      nutritionalInfo: null,
      careInstructions: null
    }
  ];

  // Category methods
  async findCategories(search = '') {
    return this.categories.filter(category => 
      category.name.toLowerCase().includes(search.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(search.toLowerCase()))
    ).map(category => ({
      ...category,
      products: this.products.filter(product => product.categoryId === category.id)
    }));
  }

  async findCategoryById(id: string) {
    const category = this.categories.find(c => c.id === id);
    if (!category) return null;
    
    return {
      ...category,
      products: this.products.filter(product => product.categoryId === category.id),
      children: this.categories.filter(c => c.parentId === category.id),
      parent: this.categories.find(c => c.id === category.parentId)
    };
  }

  async createCategory(data: any) {
    const newCategory = {
      id: Date.now().toString(),
      name: data.name,
      description: data.description || '',
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      image: data.image || null,
      parentId: data.parentId || null,
      products: []
    };
    
    this.categories.push(newCategory);
    return newCategory;
  }

  async updateCategory(id: string, data: any) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    const updatedCategory = {
      ...this.categories[index],
      name: data.name,
      description: data.description,
      slug: data.slug || data.name.toLowerCase().replace(/\s+/g, '-'),
      image: data.image,
      parentId: data.parentId
    };
    
    this.categories[index] = updatedCategory;
    return updatedCategory;
  }

  async deleteCategory(id: string) {
    const index = this.categories.findIndex(c => c.id === id);
    if (index === -1) throw new Error('Category not found');
    
    // Check if category has products
    const hasProducts = this.products.some(p => p.categoryId === id);
    if (hasProducts) throw new Error('Cannot delete category with associated products');
    
    // Check if category has children
    const hasChildren = this.categories.some(c => c.parentId === id);
    if (hasChildren) throw new Error('Cannot delete category with child categories');
    
    const deletedCategory = this.categories[index];
    this.categories.splice(index, 1);
    return deletedCategory;
  }

  // Product methods
  async findProducts(filters: any = {}) {
    let filteredProducts = [...this.products];
    
    // Apply search filter
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filteredProducts = filteredProducts.filter(product => 
        product.name.toLowerCase().includes(search) ||
        product.description.toLowerCase().includes(search) ||
        (product.shortDescription && product.shortDescription.toLowerCase().includes(search)) ||
        product.tags.some((tag: string) => tag.toLowerCase().includes(search))
      );
    }
    
    // Apply category filter
    if (filters.category) {
      filteredProducts = filteredProducts.filter(product => product.categoryId === filters.category);
    }
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredProducts = filteredProducts.filter(product => product.status === filters.status);
    }
    
    // Apply featured filter
    if (filters.featured) {
      filteredProducts = filteredProducts.filter(product => product.featured);
    }
    
    // Apply bestseller filter
    if (filters.bestseller) {
      filteredProducts = filteredProducts.filter(product => product.bestseller);
    }
    
    // Apply new filter
    if (filters.new) {
      filteredProducts = filteredProducts.filter(product => product.new);
    }
    
    // Apply occasion filter
    if (filters.occasion) {
      filteredProducts = filteredProducts.filter(product => 
        product.occasions.includes(filters.occasion)
      );
    }
    
    // Apply price range filter
    if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(product => {
        if (filters.minPrice !== undefined && product.price < filters.minPrice) {
          return false;
        }
        if (filters.maxPrice !== undefined && product.price > filters.maxPrice) {
          return false;
        }
        return true;
      });
    }
    
    // Add category information
    const productsWithCategory = filteredProducts.map(product => ({
      ...product,
      category: this.categories.find(c => c.id === product.categoryId)
    }));
    
    return {
      products: productsWithCategory,
      total: productsWithCategory.length
    };
  }

  async findProductById(id: string) {
    const product = this.products.find(p => p.id === id);
    if (!product) return null;
    
    return {
      ...product,
      category: this.categories.find(c => c.id === product.categoryId)
    };
  }

  async createProduct(data: any) {
    const newProduct = {
      id: Date.now().toString(),
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    this.products.push(newProduct);
    
    return {
      ...newProduct,
      category: this.categories.find(c => c.id === newProduct.categoryId)
    };
  }

  async updateProduct(id: string, data: any) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const updatedProduct = {
      ...this.products[index],
      ...data,
      updatedAt: new Date().toISOString()
    };
    
    this.products[index] = updatedProduct;
    
    return {
      ...updatedProduct,
      category: this.categories.find(c => c.id === updatedProduct.categoryId)
    };
  }

  async deleteProduct(id: string) {
    const index = this.products.findIndex(p => p.id === id);
    if (index === -1) throw new Error('Product not found');
    
    const deletedProduct = this.products[index];
    this.products.splice(index, 1);
    
    return deletedProduct;
  }
}

// Create a singleton instance
const mockDbInstance = new MockDatabase();

export default mockDbInstance;
