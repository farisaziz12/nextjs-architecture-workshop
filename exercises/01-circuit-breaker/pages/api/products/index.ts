import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProducts } from '../../../lib/api';
import { Product } from '../../../types';

// 🦆 Task 1: import the `breaker` helper from `lib/circuitBreaker`
// import { breaker } from '../../../lib/circuitBreaker';

// 🦉 Note: the breaker instance MUST live at module scope (outside the handler).
// Circuit state has to persist across requests — a per-request instance would never trip.
// 🦆 Task 2: create a breaker that wraps `fetchProducts`, e.g.
//   const productsBreaker = breaker(fetchProducts, { name: 'products', errorThresholdPercentage: 50, resetTimeout: 10000 });
// Then register a `.fallback(...)` returning `{ products: [], circuitStatus: 'open' as const, isUsingFallback: true }`.

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
    // 🦆 Task 3: replace this direct call with `productsBreaker.fire()`.
    // When you're done, set `circuitStatus` on the response from `productsBreaker.status.state`
    // so the client can render the indicator.
    const data = await fetchProducts();
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ error: 'Failed to fetch products' });
  }
}