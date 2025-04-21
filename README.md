# Next.js Architecture Workshop

## 🚀 Overview

This repository contains a series of exercises and solutions for implementing resilience patterns in Next.js applications. You'll work with a fully functional e-commerce application, "ResilioStore," improving its resilience against various failure scenarios.

Each exercise focuses on a specific resilience pattern, with both starter code and complete solutions provided.

## 🗂 Repository Structure

```
nextjs-architecture-workshop/
├── README.md
├── package.json
├── core-app/                  # Shared code across exercises
│   ├── components/            # Reusable UI components
│   ├── lib/                   # Helper functions & utilities
│   ├── types/                 # TypeScript type definitions
│   └── mocks/                 # Mock data and API simulators
├── exercises/                 # Start here for hands-on practice
│   ├── 01-circuit-breaker/
│   ├── 02-retry-pattern/
│   ├── 03-timeout-pattern/
│   ├── 04-error-boundaries/
│   ├── 05-dynamic-imports/
│   ├── 06-fallback-ui/
│   ├── 07-data-caching/
│   ├── 08-isr-pattern/
│   └── 09-chaos-testing/
└── solutions/                 # Reference implementations
    ├── 01-circuit-breaker/
    ├── 02-retry-pattern/
    └── ...
```

## 🛠 Setup Instructions

1. Clone the repository:
   ```
   git clone git@github.com:farisaziz12/nextjs-architecture-workshop.git
   cd nextjs-architecture-workshop
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the example environment file:
   ```
   cp .env.example .env.local
   ```

4. Start a specific exercise:
   ```
   npm run exercise 01
   ```

5. Run a solution:
   ```
   npm run solution 01
   ```

6. Run the mock API server (required for most exercises):
   ```
   npm run mock-api
   ```

## 📋 Exercise Overview

### 1. Circuit Breaker Pattern
Implement circuit breakers for the product catalog API that experiences intermittent failures during high traffic.

### 2. Retry Pattern
Add intelligent retry logic to payment processing to handle transient network failures.

### 3. Timeout Pattern
Implement timeout handling for third-party shipping calculator that occasionally hangs.

### 4. Error Boundaries
Add error boundaries to prevent the entire UI from crashing when product recommendations fail.

### 5. Dynamic Imports
Optimize loading and improve isolation using dynamic imports for heavy components.

### 6. Fallback UI with Suspense
Create elegant loading and error states for a complex product filtering system.

### 7. Data Caching with TanStack Query
Implement advanced caching strategies for the product catalog and user shopping cart.

### 8. Incremental Static Regeneration
Apply ISR to product detail pages to ensure availability during API outages.

### 9. Chaos Testing
Create a chaos engineering system to test your resilience implementations.

## 📁 Detailed Exercise Structure

Each exercise directory contains:

- `README.md` - Instructions and requirements
- `pages/` - Next.js pages with TODO comments
- `components/` - React components specific to the exercise
- `lib/` - Utility functions and hooks needed for the exercise

## 🧪 Mock API

The workshop includes a simulated backend that can be configured to fail in various ways:

- Randomized failures
- Slow responses
- Malformed data
- Service unavailability

Control failure modes through the API dashboard at `http://localhost:3001` when running the mock server.

## 📂 Example File Structure for Exercise 01

```
exercises/01-circuit-breaker/
├── README.md
├── pages/
│   ├── _app.js
│   ├── api/
│   │   └── products.js        # TODO: Implement circuit breaker here
│   ├── index.js
│   └── products/
│       └── [id].js
├── components/
│   ├── ProductList.js         # Using the API endpoint
│   └── CircuitStatus.js       # Display circuit state to users
└── lib/
    └── circuitBreaker.js      # Circuit breaker utility (incomplete)
```

## 🔧 Technical Stack

- Next.js (Pages Router)
- TanStack Query for data fetching
- `opossum` for circuit breaking
- `react-error-boundary` for error handling
- Tailwind CSS for styling
- MSW for API mocking

## 📚 Workshop Code Examples

Here's a preview of one of the exercise implementations:

### Circuit Breaker Implementation (Solution)

```jsx
// solutions/01-circuit-breaker/pages/api/products.js
import CircuitBreaker from 'opossum';
import { getProductsFromDatabase } from '../../lib/database';

// Circuit breaker instance with configuration
const breaker = new CircuitBreaker(getProductsFromDatabase, {
  timeout: 3000,
  errorThresholdPercentage: 50,
  resetTimeout: 10000,
  name: 'products-api'
});

// Log circuit events
breaker.on('open', () => console.log('Circuit breaker opened'));
breaker.on('close', () => console.log('Circuit breaker closed'));
breaker.on('halfOpen', () => console.log('Circuit breaker half-open'));

// Fallback function when circuit is open
const fallbackFunction = () => {
  return {
    products: [],
    message: "Service temporarily unavailable. Please try again later.",
    isUsingFallback: true
  };
};

export default async function handler(req, res) {
  try {
    // Execute through circuit breaker
    const data = await breaker.fire();
    res.status(200).json(data);
  } catch (error) {
    console.error('Products API error:', error);
    
    // Return fallback data when circuit is open
    res.status(503).json(fallbackFunction());
  }
}
```

### Client-side Implementation (Solution)

```jsx
// solutions/01-circuit-breaker/components/ProductList.js
import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import CircuitStatus from './CircuitStatus';

export default function ProductList() {
  const [circuitStatus, setCircuitStatus] = useState('closed');
  
  const { data, error, isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const res = await fetch('/api/products');
      const data = await res.json();
      
      // Update circuit status based on response
      if (data.isUsingFallback) {
        setCircuitStatus('open');
      } else {
        setCircuitStatus('closed');
      }
      
      return data;
    },
    retry: 1, // Limited retries since we're using circuit breaker
  });

  if (isLoading) return <ProductSkeleton count={6} />;
  
  return (
    <div className="product-container">
      <CircuitStatus status={circuitStatus} />
      
      {data?.message && (
        <div className="bg-yellow-100 p-4 mb-4 rounded">
          <p>{data.message}</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data?.products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
        
        {data?.products.length === 0 && !data?.message && (
          <div className="col-span-3 text-center py-10">
            <p>No products found.</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

## Ready to get started?

Begin with Exercise 1 to start building resilient Next.js applications!

```
npm run exercise 01
```