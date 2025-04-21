import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '../../../lib/api';
import { breaker } from '../../../lib/circuitBreaker';
import { Product, CircuitStatus } from '../../../types';

type ResponseData = {
  products?: Product[];
  error?: string;
  message?: string;
  circuitStatus?: CircuitStatus;
  isUsingFallback?: boolean;
};

// Create a circuit breaker for the products API
const productsBreaker = breaker(fetchProducts, {
  name: 'products-api',
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});

// Fallback data when circuit is open
const fallbackData: ResponseData = {
  products: [],
  message: "Product information is temporarily unavailable. Please try again later.",
  circuitStatus: 'open',
  isUsingFallback: true
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // Execute with circuit breaker protection
    const data = await productsBreaker.fire();
    
    // Add circuit status to the response
    res.status(200).json({
      ...data,
      circuitStatus: productsBreaker.status as unknown as CircuitStatus
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    
    // Return fallback data when circuit is open
    res.status(503).json(fallbackData);
  }
}