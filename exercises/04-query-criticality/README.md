# Query Criticality Exercise

In this exercise, you'll implement a system to handle queries based on their criticality level.

## Problem Statement

Not all data fetching is created equal. Some queries are critical for rendering a page correctly, while others are optional enhancements. This exercise teaches you how to implement a pattern for differentiating between these query types.

## Your Task

1. Complete the implementation of a prefetching utility that categorizes queries as either:
   - Critical: Required for proper page rendering (failures should throw errors)
   - Optional: Enhance the page but aren't strictly required (failures should return null)

2. Implement proper error handling for both query types.

## Implementation Steps

### 1. Fix the Basic Prefetch Implementation

In `src/utils/prefetcher.ts`, you'll need to fix the basic `prefetch` function by:
- Adding proper error handling with try-catch
- Capturing exceptions with Sentry
- Returning appropriate error objects

### 2. Implement Critical Queries

Create a `criticalQuery` function that:
- Uses the prefetch function to fetch data
- Returns the data if successful
- Throws errors if the fetch fails (to be caught by error boundaries)

### 3. Implement Optional Queries

Create an `optionalQuery` function that:
- Uses the prefetch function to fetch data
- Returns the data if successful
- Returns null instead of throwing if the fetch fails

## Testing Your Implementation

When completed, your implementation will allow developers to use your API like this:

```typescript
const queryClient = new QueryClient()
const prefetch = createPrefetch(queryClient)

// Critical query will throw if it fails
await prefetch.criticalQuery('MyCriticalQuery', () => fetch(...))

// Optional query will return null if it fails
const result = await prefetch.optionalQuery('MyOptionalQuery', () => fetch(...))
// result can be null, handle accordingly
```

This pattern ensures that pages can load even when non-critical data fetching fails, improving user experience while still maintaining proper error handling for essential data.
