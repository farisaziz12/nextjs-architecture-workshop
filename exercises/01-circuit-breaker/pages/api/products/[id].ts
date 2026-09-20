import type { NextApiRequest, NextApiResponse } from 'next';
import { fetchProduct } from '../../../lib/api';
import { Product } from '../../../types';

// 🦆 Task 1: import the `breaker` helper from `lib/circuitBreaker`
// import { breaker } from '../../../lib/circuitBreaker';

// 🦉 Same module-scope rule as `index.ts` — create the breaker outside the handler.
// 🦆 Task 2: create a breaker wrapping `fetchProduct` with a fallback returning a placeholder Product
//   plus `circuitStatus` so the client knows it's a stand-in (e.g. `{ id, name: 'Unavailable', circuitStatus: 'open' }`).

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
    // 🦆 Task 3: replace this direct call with `productBreaker.fire(id)`.
    const data = await fetchProduct(id);
    res.status(200).json(data);
  } catch (error) {
    console.error(`Error fetching product ${id}:`, error);
    res.status(500).json({ error: 'Failed to fetch product' });
  }
}