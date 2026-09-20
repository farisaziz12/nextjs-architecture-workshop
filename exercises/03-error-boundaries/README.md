# Exercise 03 — Failure isolation and recovery

## Goal and timing

35 minutes: 5-minute demonstration, 15-minute implementation, 10-minute verification, 5-minute discussion.

This app is a four-quadrant dashboard. The starter has a global boundary; failures in Quadrants 1–3 replace the whole page. Add local boundaries so healthy quadrants stay interactive and keep their state. The product-page failure map is a separate discussion example, not this app.

## Run

From the repository root, use `pnpm exercise 03`. No mock API is required. The runner builds and serves production mode so the development error overlay does not obscure the fallback demonstration. Stop the server and rerun after editing to rebuild. Run `pnpm solution 03` after stopping the exercise; both use port 3000.

## Implementation — 15 minutes

1. In `components/QuadrantErrorBoundary.tsx`, add ``errorTag: `${string}Error` `` to the props and pass it to `reportError` in `componentDidCatch`.
2. In `utils/errorReporting.ts`, accept the same tag type and include the label with the reported error. Update the existing call in `components/GlobalErrorBoundary.tsx` to `reportError(error, "GlobalError")` so it still typechecks after adding the required parameter. Labels aid diagnosis; they do not guarantee Sentry issue grouping.
3. In `pages/index.tsx`, wrap each quadrant in the provided custom class boundary, using `ButtonClickError`, `InputRenderError`, `TimerCountdownError`, and `ControlQuadrantError` respectively. Keep the global boundary as a last resort.
4. Give Quadrant 3 a custom fallback with a restart button. The provided API is `fallback={(error, resetError) => (...)}`; invoke `resetError` from the button. It is not the `react-error-boundary` package API.

## Verification — 10 minutes

- Increase Quadrant 4’s counter and remember its value.
- Click Quadrant 1 three times: only that quadrant shows a fallback. Retry restores it and Quadrant 4 retains its count.
- Type `crash` into Quadrant 2: only that quadrant fails. Retry restores a usable input.
- Start Quadrant 3 and wait for zero: only the timer fails. Restart restores a five-second idle timer; start it again to verify recovery.
- Click Quadrant 4’s Test Error: no boundary fallback appears. The browser reports the uncaught event-handler error, and the counter stays usable. This is intentional.
- Verify error labels in the console. A configured Sentry project is optional for remote inspection.
- Check that TypeScript rejects an `errorTag` without the `Error` suffix.

## Discussion — 5 minutes

Quadrant 1 changes state in a click handler but throws during rendering. Quadrant 2 throws during rendering. Quadrant 3 throws synchronously inside a React effect after the timer updates state; it does not throw in the timeout callback. Quadrant 4 throws directly in the event handler, outside the boundary’s coverage. Discuss handling event errors explicitly with try/catch and reporting or displaying an appropriate local message.

Resetting a failed boundary remounts its failed subtree; it does not preserve that subtree’s old local state. Healthy sibling state should remain intact. Loading and empty-data states are covered later in the query-criticality exercise.
