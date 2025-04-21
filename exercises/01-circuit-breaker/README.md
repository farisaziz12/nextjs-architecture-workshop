# Exercise 1: Circuit Breaker Pattern

In this exercise, you'll implement a circuit breaker for the product catalog API to handle intermittent failures.

## Background

The product catalog API occasionally experiences outages during high traffic periods. Without proper protection, these failures cascade and affect the entire application.

## Task

1. Implement a circuit breaker in the `/api/products.ts` API route
2. Add a fallback mechanism to serve cached or empty data when the circuit is open
3. Implement a visual indicator that shows the circuit state to users
4. Configure appropriate thresholds for opening and closing the circuit

## Files to modify

- `pages/api/products.ts` - Add circuit breaker implementation
- `lib/circuitBreaker.ts` - Complete the circuit breaker utility
- `components/ProductList.ts` - Handle fallback responses

## Testing your implementation

1. Start the application with `npm run exercise 01`
2. Open the mock API control panel at http://localhost:3001
3. Increase the failure rate to 80%
4. Refresh the products page several times
5. Observe the circuit breaker opening after successive failures
6. Reduce the failure rate to 0%
7. Wait for the circuit to move to half-open and then closed state

## Success criteria

- The application shows fallback content when the API fails
- The circuit opens after hitting the failure threshold
- The circuit automatically recovers when the API becomes stable
- Users are informed about the fallback mode