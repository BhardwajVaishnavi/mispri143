'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import { ProductCategory } from '@/types/product';

interface RelatedProductsProps {
  productId: string;
  category: ProductCategory;
}

interface RelatedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  salePrice?: number;
  thumbnail: string;
  new: boolean;
  bestseller: boolean;
}

export default function RelatedProducts({ productId, category }: RelatedProductsProps) {
  const [products, setProducts] = useState<RelatedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        // Replace with your actual API endpoint
        const response = await fetch(`/api/products/related?id=${productId}&category=${category}`);
        const data = await response.json();
        setProducts(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching related products:', error);
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [productId, category]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <ArrowPathIcon className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {products.map((product) => (
        <Link href={`/products/${product.slug}`} key={product.id}>
          <Card className="overflow-hidden transition-all hover:shadow-md">
            <div className="relative aspect-square">
              <Image
                src={product.thumbnail}
                alt={product.name}
                fill
                className="object-cover"
              />
              <div className="absolute top-2 left-2 flex flex-col gap-1">
                {product.new && <Badge className="bg-primary">New</Badge>}
                {product.bestseller && <Badge variant="secondary">Bestseller</Badge>}
                {product.salePrice && product.salePrice < product.price && (
                  <Badge variant="destructive">
                    {Math.round(((product.price - product.salePrice) / product.price) * 100)}% OFF
                  </Badge>
                )}
              </div>
            </div>
            <div className="p-4">
              <h3 className="font-medium truncate">{product.name}</h3>
              <div className="flex items-baseline mt-1">
                {product.salePrice ? (
                  <>
                    <span className="text-lg font-bold text-primary">₹{product.salePrice.toFixed(2)}</span>
                    <span className="ml-2 text-sm text-gray-500 line-through">₹{product.price.toFixed(2)}</span>
                  </>
                ) : (
                  <span className="text-lg font-bold text-primary">₹{product.price.toFixed(2)}</span>
                )}
              </div>
            </div>
          </Card>
        </Link>
      ))}
    </div>
  );
}
