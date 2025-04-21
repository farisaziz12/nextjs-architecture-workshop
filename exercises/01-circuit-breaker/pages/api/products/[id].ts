import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProduct } from '../../../lib/api';
import { Product } from '../../../types';

// TODO: Import the circuit breaker utility
// import { breaker } from '../../../lib/circuitBreaker';

type ResponseData = Product | {
  error?: string;
  message?: string;
  circuitStatus?: 'closed' | 'open' | 'half-open';
  isUsingFallback?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { id } = req.query;
  
  if (typeof id !== 'string') {
    res.status(400).json({ error: 'Invalid product ID' });
    return;
  }
  
  try {
    // TODO: Wrap the API call with a circuit breaker
    const data = await fetchProduct(id);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}