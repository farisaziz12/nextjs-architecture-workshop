# Exercise 04 — Query Criticality

## 🎯 What you'll learn

Not every API call is equally important. Some data is **critical** — the page can't render meaningfully without it. Other data is **optional** — a nice-to-have that shouldn't drag the whole page down if it fails. You'll build a prefetch API that makes this distinction explicit and lets the page handle each kind correctly.

## ⏱ Time

~25 minutes

## 🧠 The problem

Today `src/utils/prefetcher.ts` exposes a single `prefetch()` that swallows errors silently. The page in `src/pages/index.tsx` prefetches two endpoints in `getServerSideProps`:
- `transactions` — the main table content. **No transactions = empty page = nothing to look at.**
- `analytics` — a sidebar widget with KPIs. **No analytics = page is still useful.**

Right now both are treated identically. If `analytics` is slow or broken, the whole page either hangs (no timeout) or silently renders with empty widgets (no error report). And if `transactions` fails, you don't notice either, because the prefetch eats the error.

You'll split the API into:
- `criticalQuery(key, fn)` — fetch, and if it fails, **throw** (caught by an error boundary upstream so the user sees a "this page is broken" state and Sentry sees the exception).
- `optionalQuery(key, fn)` — fetch, and if it fails, **return null** + report to Sentry so the page renders without the optional widget.

> **This exercise must run in production build mode** (the runner does this for you). The dev overlay would catch the thrown error before the boundary does.

## 🗺 Files you'll work in

- `src/utils/prefetcher.ts` — add `criticalQuery` and `optionalQuery`, and harden the base `prefetch` with try/catch + Sentry capture.
- `src/pages/index.tsx` — replace the two `prefetch.prefetch(...)` calls in `getServerSideProps` with the right `criticalQuery` / `optionalQuery` variant.

## 📋 Your task

1. **Harden the base `prefetch`** (around line 75 of `prefetcher.ts`): wrap the fetch in `try/catch`, call `captureException(error)` (already imported), and **return** an error result the wrappers can branch on. Don't throw from the base function — let the wrappers decide.
2. **Implement `criticalQuery(queryKey, queryFn, options?)`** (around line 81): call `prefetch` underneath. If the result is an error, **throw** it so the error boundary upstream catches it. If success, return the data.
3. **Implement `optionalQuery(queryKey, queryFn, options?)`** (around line 112): call `prefetch` underneath. If error, **return `null`**. If success, return the data. Sentry already saw the error via the base prefetch — don't double-capture.
4. **In `src/pages/index.tsx`** (around lines 330, 340), swap the two prefetch calls:
   - `transactions` → `prefetch.criticalQuery(...)`
   - `analytics` → `prefetch.optionalQuery(...)`

## ✅ You'll know you're done when

- [ ] With both endpoints healthy, the page renders normally — transactions table and analytics widgets both populated.
- [ ] Set `optionalEndpointFailure: true` in the mock API dashboard. The page **still renders** transactions; analytics widgets are gracefully empty/null. Sentry receives an error report.
- [ ] Set `criticalEndpointFailure: true`. The page renders the **error boundary fallback** (not a blank screen, not a crash). Sentry receives an error report.
- [ ] No unhandled promise rejections in server logs in either scenario.
- [ ] Running `pnpm solution 04` side-by-side shows the same behavior.

## 💡 Hints (if stuck)

- The discriminated union pattern is cleanest: `type PrefetchResult<T> = { type: 'success'; data: T } | { type: 'error'; error: Error }`. Wrappers switch on `.type`.
- Don't capture in `criticalQuery` AND in `prefetch` — you'll get duplicate Sentry events for the same error. Capture once in `prefetch`.
- The error you throw from `criticalQuery` needs to reach an error boundary. In Pages Router this means it propagates through `getServerSideProps` and triggers `pages/_error.jsx` (or `pages/500.tsx`).
- The mock API dashboard at <http://localhost:3001> has dedicated `criticalEndpointFailure` and `optionalEndpointFailure` toggles for this exercise.

## 🌶 Stretch goals

- Add a `timeout` option to both wrappers (reuse the timeout pattern from Exercise 02) so a *slow* critical query also throws instead of hanging.
- Add a third tier: `degradedQuery(queryKey, queryFn, fallback)` — like `optionalQuery` but returns a caller-provided fallback instead of `null`.
- Differentiate Sentry tags: `query.criticality: 'critical' | 'optional'` so you can alert only on critical failures.
- Add a `Cache-Control: stale-if-error` strategy on top: if the call fails, serve the last cached value (the cache file is `src/utils/cache.ts`).

## 🔌 How to run

```bash
# Terminal 1
pnpm mock-api

# Terminal 2
pnpm exercise 04
```

Use the mock API dashboard at <http://localhost:3001> to flip the `criticalEndpointFailure` and `optionalEndpointFailure` toggles while testing.
