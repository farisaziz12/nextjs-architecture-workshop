import { useRouter } from 'next/router';
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { Product } from '../../types';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    if (!id) return;
    
    async function loadProduct() {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${id}`);
        
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        
        const data = await response.json();
        setProduct(data);
        setError(null);
      } catch (err) {
        console.error('Failed to load product:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    loadProduct();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-4 w-24 bg-gray-200 rounded mb-6"></div>
            <div className="flex flex-col md:flex-row gap-8">
              <div className="w-full md:w-1/2 bg-gray-200 rounded-lg aspect-square"></div>
              <div className="w-full md:w-1/2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-6"></div>
                <div className="h-24 bg-gray-200 rounded w-full mb-6"></div>
                <div className="flex gap-4">
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                  <div className="h-10 bg-gray-200 rounded w-32"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">Error loading product</h2>
            <p className="text-red-700 mb-4">{error}</p>
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="w-full max-w-4xl mx-auto">
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-800 mb-2">Product not found</h2>
            <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors">
              Back to Products
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Head>
        <title>{product.name} | ResilioStore</title>
      </Head>
      
      <div className="w-full max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/" className="text-blue-600 hover:text-blue-800 transition-colors flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Products
          </Link>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/2">
            <div className="bg-gray-100 rounded-lg aspect-square flex items-center justify-center">
              <div className="w-40 h-40 bg-gray-200 rounded-md"></div>
            </div>
          </div>
          
          <div className="w-full md:w-1/2">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <p className="text-2xl font-bold text-blue-600 mb-4">${product.price.toFixed(2)}</p>
            
            {product.stock > 0 ? (
              <p className="text-sm text-green-600 mb-2">In Stock</p>
            ) : (
              <p className="text-sm text-red-600 mb-2">Out of Stock</p>
            )}
            
            <div className="text-sm text-gray-600 mb-6">
              Rating: {product.rating} / 5
            </div>
            
            <p className="text-gray-700 mb-8">{product.description}</p>
            
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Add to Cart
              </button>
              <button className="bg-gray-100 text-gray-800 px-6 py-2 rounded-lg hover:bg-gray-200 transition-colors">
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}