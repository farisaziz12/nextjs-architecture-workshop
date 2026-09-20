# Solution 02 — Slow and failing dependencies

Follow [Exercise 02](../../exercises/02-timeout-pattern/README.md) for setup and the verification matrix.

Run `pnpm solution 02` from the repository root after stopping the exercise. No mock API is needed.

The `withTimeout` helper rejects with `TimeoutError` and clears its timer in `finally`. It bounds the wait without cancelling the underlying operation. The prefetch result is `{ type: "data", data } | { type: "error", error }`. An SSR timeout message is serialized into the page while the browser makes a fresh request, allowing recovery.

Run `node scripts/test-prefetch.cjs` from the root after installing the Solution 04 dependencies to check success, failure, critical and optional timeouts, timer cleanup, and late rejections. Telemetry is mocked in these checks; they do not verify live Sentry delivery.
