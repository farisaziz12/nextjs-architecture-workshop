import { Product } from '../types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

// Color codes
const colors = {
  cyan: '\x1b[1;36m',  // Bold Cyan
  reset: '\x1b[0m'
};

export async function fetchProducts(): Promise<{ products: Product[] }> {
  console.log(`${colors.cyan}Fetching products from:${colors.reset}`, `${API_URL}/products`);
  const response = await fetch(`${API_URL}/products`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}

export async function fetchProduct(id: string | number): Promise<Product> {
  console.log(`${colors.cyan}Fetching product:${colors.reset}`, `${API_URL}/products/${id}`);
  const response = await fetch(`${API_URL}/products/${id}`);
  
  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }
  
  return response.json();
}