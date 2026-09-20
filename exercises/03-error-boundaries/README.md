# Exercise 03 — Error Boundaries

## 🎯 What you'll learn

How to contain a runtime error to a small piece of UI instead of letting it crash the whole app — and how to **tag** those errors so your monitoring tool groups them meaningfully instead of by their generic `TypeError` / `ReferenceError`.

## ⏱ Time

~25 minutes

## 🧠 The problem

The app is a 2×2 dashboard of four "quadrants." Each quadrant is wired to throw a different runtime error when the user interacts with it (button click, input value, timer expiry). Today there's only a *global* error boundary in `_app.tsx`, so any one quadrant blowing up takes the entire page down — including the three quadrants that work fine.

You'll wrap each quadrant in its own `QuadrantErrorBoundary` so failures stay local. Then you'll improve the boundary so every error it catches carries an `errorTag` — a typed label (`'ButtonClickError'`, `'TimerCountdownError'`, etc.) that Sentry can group on instead of the raw exception class.

> **This exercise must run in production build mode** (the runner does this for you). Next.js's dev overlay intercepts these errors before they reach the boundary — you'd never see the boundary fire in dev.

## 🗺 Files you'll work in

- `pages/index.tsx` — the 2×2 grid. Wrap each `<Quadrant*>` here.
- `components/QuadrantErrorBoundary.tsx` — already imports `react-error-boundary`. You'll add the `errorTag` prop + reporting wiring.
- `utils/errorReporting.ts` — the helper that ships the tag into Sentry. Tighten its types.
- `components/GlobalErrorBoundary.tsx` — already done, no edits. Reference for what *not* to do (it catches everything).

## 📋 Your task

1. **In `components/QuadrantErrorBoundary.tsx`**: add an `errorTag` prop to `ErrorBoundaryProps`. Use a TypeScript template literal type to force the tag to end with `'Error'` (e.g., `type ErrorTag = \`${string}Error\``). Wire `errorTag` into the `onError` handler that calls `errorReporting.ts`.
2. **In `utils/errorReporting.ts`**: update the function signature so `errorTag` uses the same template literal type. Inside, decorate the error (or attach a Sentry tag) so the tag is sent with the exception report.
3. **In `pages/index.tsx`**: import `QuadrantErrorBoundary` and wrap each of the four quadrants:
   - `<Quadrant1 />` → `errorTag="ButtonClickError"`
   - `<Quadrant2 />` → `errorTag="InputRenderError"`
   - `<Quadrant3 />` → `errorTag="TimerCountdownError"`
   - `<Quadrant4 />` → `errorTag="ControlQuadrantError"`
4. **(Optional)** Provide a custom `FallbackComponent` for at least one quadrant so its fallback UI matches its purpose ("Timer crashed — restart?" beats a generic "Something went wrong").

## ✅ You'll know you're done when

- [ ] Click the button in Quadrant 1 three times — Quadrant 1 shows its fallback UI; Quadrants 2, 3, 4 still work and remain interactive.
- [ ] Type "crash" in Quadrant 2's input — Quadrant 2 shows its fallback; the rest of the page is unaffected.
- [ ] Start Quadrant 3's countdown and let it hit zero — Quadrant 3 shows its fallback; the rest stays alive.
- [ ] Click Quadrant 4's "Test Error" button — Quadrant 4 shows its fallback; the rest stays alive.
- [ ] In dev tools / Sentry, each captured error carries its tag (`ButtonClickError`, etc.), not just the underlying JS error name.
- [ ] TypeScript rejects an `errorTag` that doesn't end in `Error` at the call site.
- [ ] Running `pnpm solution 03` side-by-side shows the same behavior.

## 💡 Hints (if stuck)

- `react-error-boundary` exports `<ErrorBoundary FallbackComponent={...} onError={(error, info) => ...} onReset={...} />`. The `onError` callback is where you tag.
- Template literal type: `type ErrorTag = \`${string}Error\`` — accepts any string ending in `"Error"`, rejects others at the TS level.
- For Sentry tagging, `Sentry.withScope(scope => { scope.setTag('errorTag', errorTag); Sentry.captureException(error); })` keeps the tag scoped to this one event.
- The fallback prop `resetErrorBoundary` lets users retry. Pass it to a button in your custom fallback if you want recovery.

## 🌶 Stretch goals

- Add a "telemetry" prop that takes any extra context (user id, route, feature flags) and forwards it to Sentry with the captured exception.
- Wire one quadrant's fallback to *also* render a "report this" button that posts the error and a user comment to a feedback API.

## 🔌 How to run

```bash
# Terminal 1 — mock API is optional for this exercise (the quadrants don't fetch)
pnpm exercise 03
```

The runner builds the app and starts it in production mode on :3000. Dev overlay would mask the errors, so don't try `next dev` here.
