export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
  image?: string;
  category: string;
  stock: number;
  rating: number;
}

export type CircuitStatus = 'closed' | 'open' | 'half-open';

export interface ApiResponse<T> {
  data?: T;
  message?: string;
  circuitStatus?: CircuitStatus;
  isUsingFallback?: boolean;
}