# Exercise 02 — Bound the wait

Part of the 45-minute slow-dependency session: 10 minutes of demonstration across Exercises 02/04, 20 minutes implementing their helpers, then 15 minutes testing failure, loading, empty data, and recovery.

## Run and observe

Run `pnpm exercise 02` from the root. No mock API is needed for this exercise. The local `/api/proxy/transactions` endpoint always takes about two seconds and returns fixed financial data; no external data service is involved. Stop it before running `pnpm solution 02` because both use port 3000.

`src/pages/index.tsx` awaits a transaction prefetch in `getServerSideProps`. A slow request delays the SSR response; it does not block Node’s event loop or freeze the browser thread.

## Implement

1. In `src/utils/prefetcher.ts`, create a rejecting deadline with an Error named `TimeoutError`.
2. Race `queryClient.fetchQuery(...)` against that deadline. `fetchQuery` propagates errors; `prefetchQuery` would swallow them.
3. Clear the deadline timer in `finally` on success and failure. Preserve the existing catch that reports and returns `{ type: "error", error }`.
4. Change the budget in `getServerSideProps` between 1000ms and 3000ms. The page already serializes the initial error message and renders a notice while the browser fetches again.

## Verify

- At 3000ms, SSR normally includes the two-second response.
- At 1000ms, SSR returns sooner with a timeout notice and a loading state. The browser starts a separate request and can recover when that request succeeds; the notice then disappears.
- A timeout must be an error result, never `{ type: "data", data: null }`.
- No unhandled rejection, including if the original request rejects after the deadline.
- The timer is cleared when the request succeeds or fails before the deadline.

`Promise.race` bounds how long we wait. It does not cancel the losing request; that request can still finish and update the query cache. As an extension, propagate an AbortSignal through the fetch path and compare cancellation with simply stopping the wait. Remote Sentry delivery is optional; the prefetch layer reports failures, and the fetcher can also report upstream errors.

Continue with Exercise 04 to decide what a timeout means for critical versus optional data.
