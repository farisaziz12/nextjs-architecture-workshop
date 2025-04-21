import { useState, useEffect } from 'react';
import { Product, CircuitStatus } from '../types';
import ProductCard from './ProductCard';
import ProductSkeleton from './ProductSkeleton';
import CircuitStatusIndicator from './CircuitStatusIndicator';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [circuitStatus, setCircuitStatus] = useState<CircuitStatus>('closed');
  
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        const data = await response.json();
        
        if (data.circuitStatus) {
          setCircuitStatus(data.circuitStatus);
        }
        
        if (data.message) {
          setMessage(data.message);
        }
        
        setProducts(data.products || []);
        setError(null);
      } catch (err) {
        console.error('Failed to load products:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    loadProducts();
  }, []);
  
  if (loading) return <ProductSkeleton count={6} />;
  
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-6 text-center">
        <p className="text-red-800 mb-4">Error loading products: {error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }
  
  return (
    <div>
      <CircuitStatusIndicator status={circuitStatus} />
      
      {message && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-md">
          <p className="text-yellow-800">{message}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.length > 0 ? (
          products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500 py-10">No products found.</p>
        )}
      </div>
    </div>
  );
}