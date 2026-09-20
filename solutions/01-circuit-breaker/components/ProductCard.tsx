import Link from 'next/link';
import Image from 'next/image';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  // Generate a mock image based on category
  const getMockImage = (category: string) => {
    // Map categories to better placeholder images
    const categoryImages: Record<string, string> = {
      electronics: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?w=600&h=600&fit=crop&q=80',
      clothing: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=600&h=600&fit=crop&q=80',
      books: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=600&h=600&fit=crop&q=80',
      furniture: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=600&fit=crop&q=80',
      groceries: 'https://images.unsplash.com/photo-1583258292688-d0213dc5a3a8?w=600&h=600&fit=crop&q=80',
    };
    
    // Fallback images for other categories
    const fallbackImages = [
      'https://images.unsplash.com/photo-1553456558-aff63285bdd1?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=600&h=600&fit=crop&q=80',
      'https://images.unsplash.com/photo-1491637639811-60e2756cc1c7?w=600&h=600&fit=crop&q=80',
    ];
    
    return categoryImages[category.toLowerCase()] || 
           fallbackImages[Math.floor(Math.random() * fallbackImages.length)];
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-center items-center bg-gray-50 rounded-md mb-4 aspect-square overflow-hidden">
          <Image
            src={getMockImage(product.category)}
            alt={product.name}
            width={300}
            height={300}
            className="object-cover h-full w-full"
          />
        </div>
        
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          <Link href={`/products/${product.id}`} className="hover:text-blue-600 transition-colors">
            {product.name}
          </Link>
        </h3>
        
        <p className="text-2xl font-bold text-blue-600 mb-2">
          ${product.price.toFixed(2)}
        </p>
        
        <div className="flex justify-between items-center mb-2">
          {product.stock > 0 ? (
            <p className="text-sm text-green-600">In Stock</p>
          ) : (
            <p className="text-sm text-red-600">Out of Stock</p>
          )}
          
          <span className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
            {product.category}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-4 flex items-center">
          <span className="mr-1">Rating:</span>
          {[...Array(5)].map((_, i) => (
            <svg
              key={i}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={i < Math.round(product.rating) ? "#FFC857" : "#D1D5DB"}
              className="w-4 h-4"
            >
              <path
                fillRule="evenodd"
                d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
                clipRule="evenodd"
              />
            </svg>
          ))}
        </div>
        
        <button className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition-colors">
          Add to Cart
        </button>
      </div>
    </div>
  );
}