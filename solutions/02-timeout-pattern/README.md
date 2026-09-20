# Solution 02 — Timeout Pattern

Reference implementation for [Exercise 02](../../exercises/02-timeout-pattern/README.md). Start there if you haven't tried the exercise yet.

## 🔌 How to run

```bash
pnpm mock-api
pnpm solution 02
```

## 🔍 Key implementation choices

- **`Promise.race` doesn't cancel the loser.** When the timeout wins, the original fetch keeps running until it eventually settles — the result is just ignored. For a real network call this means open sockets and Node memory until the upstream replies. The stretch goal asks you to fix this with `AbortController`.
- **The timeout `rejects`, it doesn't `resolve` with a sentinel.** A rejected promise is what makes `Promise.race` propagate the failure as a thrown error — `await` will throw, and the caller's try/catch handles it like any other failure.
- **`captureException` is called inside `prefetch`, not at the page layer.** Centralising the Sentry call means every prefetch call site gets observability for free; pages don't need to remember to instrument.
- **The timeout value is passed in, not hard-coded.** `getServerSideProps` decides the budget for *its* prefetch. A faster page might use 500ms; a richer one might allow 3s. This decision belongs at the call site, not in the helper.

## 💬 Discussion prompts

- Why not just rely on the HTTP client's built-in timeout (`fetch` doesn't have one; `axios` does)? Where does each timeout actually live?
- What's the right timeout value? How would you measure it in production?
- A timeout fires, you serve the page without that data. The user reloads. Same data is still slow — same timeout fires again. What's the next pattern you reach for? (Hint: it's in Exercise 01.)
- Timeouts mask latency problems. How do you avoid declaring "all good" when actually the upstream is degraded?
