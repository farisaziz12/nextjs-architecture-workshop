import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProduct } from '../../../lib/api';
import { Product, CircuitStatus } from '../../../types';

// Import the circuit breaker utility
import { breaker } from '../../../lib/circuitBreaker';

type ResponseData = Product | {
  error?: string;
  message?: string;
  circuitStatus?: CircuitStatus;
  isUsingFallback?: boolean;
};

// Create a circuit breaker for the product details API
const productDetailsBreaker = (id: string) => breaker(() => fetchProduct(id), {
  name: `product-details-${id}`,
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }
  
  // Create fallback data for when circuit is open
  const fallbackData: ResponseData = {
    message: "Product information is temporarily unavailable. Please try again later.",
    circuitStatus: 'open',
    isUsingFallback: true
  };
  
  try {
    // Create a circuit breaker for this specific product ID
    const productBreaker = productDetailsBreaker(id);
    
    // Execute with circuit breaker protection
    const data = await productBreaker.fire();
    
    // Add circuit status to the response
    res.status(200).json({
      ...data,
      circuitStatus: productBreaker.status as unknown as CircuitStatus
    });
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    
    // Return fallback data when circuit is open
    res.status(503).json(fallbackData);
  }
}