# Solution 03 — Failure isolation and recovery

Follow the [exercise instructions](../../exercises/03-error-boundaries/README.md) for the full 35-minute session and verification checklist.

Run `pnpm solution 03` from the repository root. No mock API is required. Stop the exercise first: both use port 3000. The runner builds production mode; rerun it after changes.

## Implementation

- The provided custom class boundary uses `getDerivedStateFromError` for its fallback and `componentDidCatch` for reporting.
- Each quadrant has its own boundary; the global boundary remains a last resort.
- The error tag uses a template literal type requiring the `Error` suffix. The reporting helper wraps the original error as its cause and sets the wrapper’s name. It does not use `Sentry.withScope`, and labels alone do not guarantee issue grouping.
- The default fallback exposes Retry. The timer uses `fallback={(error, resetError) => (...)}` and invokes `resetError` from Restart timer.
- Quadrant 4 intentionally throws directly in a click handler and bypasses the boundaries. Its counter stays usable. This contrasts with Quadrants 1–3, whose failures occur in React rendering or effect execution.
- Recovery remounts the failed subtree while healthy sibling state remains intact.
