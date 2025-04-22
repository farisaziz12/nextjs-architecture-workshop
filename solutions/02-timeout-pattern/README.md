# Timeout Pattern Exercise

In this exercise, you'll implement the timeout pattern for handling API requests that take too long to resolve.

## Problem Statement

The application has a transaction dashboard that fetches data from an API. The API sometimes takes a long time to respond (simulated with a 2-second delay). We need to implement a timeout mechanism to ensure that requests don't hang indefinitely.

## Your Task

1. Implement a timeout function that resolves after a given time period.
2. Use Promise.race to race between the fetch promise and a timeout promise.
3. Add proper error handling for timeout scenarios.
4. Test the application with different timeout values.

## Implementation Steps

### 1. Implementing the Timeout Function

In `src/utils/prefetcher.ts`, you'll find TODO comments where you need to implement a timeout function:

```typescript
// TODO: Implement a timeout function that resolves after a given time
// The timeout function will be used for race conditions with Promise.race
```

### 2. Add Timeout Logic to the API Fetcher

In `src/pages/index.tsx`, you'll find a TODO comment for implementing timeout handling for queries:

```typescript
// TODO: Implement timeout handling for the query
// If a request takes longer than a specified time limit, it should be cancelled
```

## Testing Your Implementation

The API has an artificial delay of 2 seconds to help you test your timeout implementation. Try setting the timeout to:
- 3 seconds (the request should succeed)
- 1 second (the request should timeout)
