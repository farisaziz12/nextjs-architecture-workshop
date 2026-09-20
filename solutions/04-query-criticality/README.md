# Solution 04 — Query Criticality

Reference implementation for [Exercise 04](../../exercises/04-query-criticality/README.md). Start there if you haven't tried the exercise yet.

## 🔌 How to run

```bash
pnpm mock-api
pnpm solution 04
```

Runs in production build mode (see exercise README for why).

## 🔍 Key implementation choices

- **Discriminated union for the prefetch result.** `{ type: 'success', data } | { type: 'error', error }` lets the wrappers switch on a literal without runtime type guards. The base `prefetch` never throws — it always returns one of the two shapes.
- **`captureException` lives in the base `prefetch`, not in the wrappers.** Both critical and optional failures get reported to Sentry exactly once. The wrappers only decide what to *do* with the failure (throw vs. return null), not whether to report it.
- **Critical failures throw past `getServerSideProps`.** In Pages Router that triggers `_error.jsx` / `500.tsx`. In App Router this would be `error.tsx`. The error boundary lives in the framework, not the page.
- **Optional failures return `null`, not `undefined`.** `null` is an explicit "I tried and there's nothing"; `undefined` reads as "nobody set this." Components consuming the result get a clearer signal.

## 💬 Discussion prompts

- Who decides if a query is critical or optional — the backend, the page, or product? What happens when those three disagree?
- "Critical for SSR but optional for client-side hydration" — does that exist? How would you model it?
- The user lands on a page where critical data is broken. They see the error fallback. They refresh — same fallback. What's the **next** layer of resilience you reach for? (Multiple right answers: cache, feature flag kill switch, redirect, etc.)
- This pattern composes with the timeout from Exercise 02 and the circuit breaker from Exercise 01. Sketch the call stack of `criticalQuery(timeout(breaker(fetch)))`. Which layer reports what to Sentry?
