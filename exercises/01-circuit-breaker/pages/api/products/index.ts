import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '../../../lib/api';
import { Product } from '../../../types';

// TODO: Import the circuit breaker utility
// import { breaker } from '../../lib/circuitBreaker';

type ResponseData = {
  products?: Product[];
  error?: string;
  message?: string;
  circuitStatus?: 'closed' | 'open' | 'half-open';
  isUsingFallback?: boolean;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  try {
    // TODO: Wrap the API call with a circuit breaker
    // Currently, this will fail frequently when the mock API is configured with high failure rate
    const data = await fetchProducts();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}