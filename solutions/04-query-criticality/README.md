# Solution 04 — Slow and failing dependencies

Follow [Exercise 04](../../exercises/04-query-criticality/README.md) for setup and the verification matrix.

Run `pnpm solution 04` from the repository root after stopping the exercise. Start `pnpm mock-api` separately.

The `withTimeout` helper rejects with `TimeoutError` and clears its timer in `finally`. It bounds the wait without cancelling the underlying operation. The prefetch result is `{ type: "data", data } | { type: "error", error }`. Critical queries rethrow error results, including timeouts; optional queries return null. Critical SSR failures use the Pages Router error page. Optional SSR failure is serialized into a visible unavailable state; successful empty analytics is rendered separately.

Run `node scripts/test-prefetch.cjs` from the root after installing the Solution 04 dependencies to check success, failure, critical and optional timeouts, timer cleanup, and late rejections. Telemetry is mocked in these checks; they do not verify live Sentry delivery.
