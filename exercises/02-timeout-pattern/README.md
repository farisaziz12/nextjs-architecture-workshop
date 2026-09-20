# Exercise 02 — Timeout Pattern

## 🎯 What you'll learn

How to bound the time you'll wait for a slow upstream by racing the real request against a timeout promise. Without this, a single hung API call holds your event loop, your TanStack Query cache, and your user's tab hostage.

## ⏱ Time

~15 minutes

## 🧠 The problem

`pages/index.tsx` prefetches transactions in `getServerSideProps` so the dashboard renders with data already on the wire. But the mock API has been instrumented to occasionally take 2 full seconds to respond. Without a timeout, the SSR step blocks on it, and the user sees a frozen tab until the upstream eventually replies (or never does).

You'll bound the wait with `Promise.race(fetch, timeout)` so a slow upstream becomes a clean, observable timeout error you can decide how to handle — fall back, retry, surface a friendlier UI — instead of a hang.

## 🗺 Files you'll work in

- `src/utils/prefetcher.ts` — the prefetch helper used by SSR. Add the timeout primitive here.
- `src/pages/index.tsx` — wire the timeout value into the prefetch call (defaults to 500ms currently).

## 📋 Your task

1. **In `src/utils/prefetcher.ts`**, implement the `timeout(ms)` helper near the top of the file. It should return a `Promise` that **rejects** after `ms` milliseconds with a clearly-named error (e.g., `new Error('Request timed out')`).
2. **Race the fetch against the timeout** inside the `prefetch` function using `Promise.race([fetchPromise, timeout(ms)])`. The first one to settle wins.
3. **Catch the timeout** so the upstream call doesn't bring down the whole SSR. Capture with Sentry (`captureException` is already imported), then return an error result the caller can branch on — don't let it bubble up to the page.
4. **Try different timeout values** from `src/pages/index.tsx`'s `getServerSideProps` to confirm behavior.

## ✅ You'll know you're done when

- [ ] With the timeout set to **3000ms**, the page loads transactions normally (mock API delay is ~2s).
- [ ] With the timeout set to **1000ms**, the prefetch errors out cleanly — the page still renders (no crash) but transactions are empty/error-state.
- [ ] No unhandled promise rejection in the server logs.
- [ ] Sentry sees a `captureException` call when the timeout fires (visible in your Sentry dev console if configured).
- [ ] Running `pnpm solution 02` side-by-side shows the same behavior.

## 💡 Hints (if stuck)

- `setTimeout` doesn't return a promise. Wrap it: `new Promise((_, reject) => setTimeout(() => reject(new Error(...)), ms))`.
- `Promise.race` resolves/rejects with whichever input settles first. The "loser" still runs to completion in the background — clear the timeout in cleanup if you care.
- The fetch promise here is whatever `queryFn` returns. Don't wrap `apiFetcher` directly; wrap the `queryFn` you pass into `queryClient.prefetchQuery`.
- An ergonomic shape: `const result = await Promise.race([queryFn(), timeout(ms)]).catch(...)`.

## 🌶 Stretch goals

- Make the timeout `AbortController`-aware so the actual fetch is cancelled (not just ignored) when the timeout wins.
- Differentiate timeout errors from upstream 5xx in your Sentry tag (`error.type: 'timeout' | 'upstream'`).
- Add an exponential backoff retry once before giving up, but cap the **total** wall-clock budget at your timeout value.
- Surface the timeout state to the client so it can show "we're having trouble loading this — try again."

## 🔌 How to run

```bash
# Terminal 1
pnpm mock-api

# Terminal 2
pnpm exercise 02
```
