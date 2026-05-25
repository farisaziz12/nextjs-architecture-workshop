# Exercise 01 — Circuit Breaker Pattern

## 🎯 What you'll learn

How to stop a flaky upstream API from taking down your whole app — by wrapping calls in a circuit breaker that "opens" after repeated failures, serves a fallback, then "closes" again automatically once the dependency recovers.

## ⏱ Time

~30 minutes

## 🧠 The problem

The product catalog API behind this app is unreliable. Under load it returns 500s; sometimes it's just slow. Without protection, every page request still hammers the failing API, queuing requests, exhausting the Node event loop, and propagating the outage to users who never asked for a product page.

A circuit breaker breaks this loop: after N failures it stops forwarding calls and immediately serves a fallback (cached or empty data), giving the upstream time to recover. After a cool-off it lets one probe through (half-open); on success it closes again.

You'll use [`opossum`](https://nodeshift.dev/opossum/) — a small, battle-tested circuit breaker for Node.

## 🗺 Files you'll work in

- `lib/circuitBreaker.ts` — already-built helper that wraps a function with `opossum` (no edits needed; you'll *use* it)
- `pages/api/products/index.ts` — list endpoint, wrap the upstream call here
- `pages/api/products/[id].ts` — detail endpoint, same pattern
- `components/ProductList.tsx` — needs to read the circuit status from the API response and surface it
- `components/CircuitStatusIndicator.tsx` — skeleton you'll flesh out into a visible banner/badge

## 📋 Your task

1. **Wrap the upstream API call in `pages/api/products/index.ts`** with `breaker(...)` from `lib/circuitBreaker.ts`. Add a fallback that returns empty/cached data plus a `circuitStatus` field on the JSON response.
2. **Do the same in `pages/api/products/[id].ts`** for the detail endpoint.
3. **In `components/ProductList.tsx`**, add state for the circuit status and read it from the API response. Wire it through to the indicator.
4. **In `components/CircuitStatusIndicator.tsx`**, render a clear visual signal: closed = green/no banner, half-open = amber, open = red banner with "serving cached data."
5. **Pick sensible thresholds** in your `breaker()` call — start with `errorThresholdPercentage: 50`, `resetTimeout: 10000`. Document why.

## ✅ You'll know you're done when

- [ ] With the mock API at 0% failure rate, the page loads products normally and shows no banner.
- [ ] Setting the mock API to 80% failure rate and refreshing 5–10 times opens the circuit — you see the "open" indicator and cached/empty content instead of an error.
- [ ] Dropping the failure rate back to 0% and waiting `resetTimeout` ms moves the circuit through half-open → closed (visible in the indicator).
- [ ] Server logs show the opossum event lifecycle (`open`, `halfOpen`, `close`, `fallback`).
- [ ] Running `pnpm solution 01` side-by-side shows the same behavior.

## 💡 Hints (if stuck)

- The `breaker(fn, opts)` helper returns an opossum `CircuitBreaker` instance. Call `.fire(arg)` on it to invoke your wrapped function and get a promise back.
- Use `.fallback(fn)` to register what to return when the circuit is open *or* the wrapped call fails.
- The current circuit state is `circuit.status.state` (`'closed'`, `'open'`, `'halfOpen'`) — surface this in the API response so the frontend can render the indicator without re-querying.
- Create the breaker **once per module** (not per request) — circuit state needs to persist across requests.

## 🌶 Stretch goals

- Add a `lastFailureReason` field to the response so the indicator can show *why* the circuit opened.
- Emit a custom Sentry breadcrumb on each state transition (`open`, `halfOpen`, `close`).
- Add a manual "reset circuit" admin endpoint and a button in the indicator.
- Use the cache slot in `core-app/mocks/` to serve real last-known-good product data instead of an empty array.

## 🔌 How to run

```bash
# Terminal 1 — the mock API (provides /api/products + the failure-rate dashboard)
pnpm mock-api

# Terminal 2 — the exercise app
pnpm exercise 01
```

Then open <http://localhost:3000> and the mock-API control dashboard at <http://localhost:3001>.
