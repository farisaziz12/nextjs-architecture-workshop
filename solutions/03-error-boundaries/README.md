# Solution 03 — Error Boundaries

Reference implementation for [Exercise 03](../../exercises/03-error-boundaries/README.md). Start there if you haven't tried the exercise yet.

## 🔌 How to run

```bash
pnpm solution 03
```

Runs in production build mode (see exercise README for why). No mock API needed.

## 🔍 Key implementation choices

- **Per-quadrant boundaries, not one boundary wrapping all four.** Containment is the whole point — a single shared boundary would re-introduce the original "one error kills the page" problem in a different shape.
- **Template literal type `\`${string}Error\``.** Forces tag names to be self-describing at the call site. `errorTag="ButtonClickError"` reads better than `errorTag="ButtonClick"` and is enforced by the compiler instead of a convention.
- **`Sentry.withScope` for tag isolation.** Setting a tag globally would attach it to every subsequent event in the request. `withScope` keeps the tag bound to this single exception report.
- **The global boundary in `_app.tsx` stays.** Per-quadrant boundaries handle *known* failure points; the global boundary catches anything the per-quadrant boundaries miss (e.g., a bug in the layout itself). Defense in depth.

## 💬 Discussion prompts

- Error boundaries only catch errors during **rendering**, in lifecycle methods, and in constructors. They do **not** catch errors in event handlers, async code, or `setTimeout`. Where in our quadrants does each error actually originate? Why does the boundary still catch them?
- A boundary that auto-retries vs. one that requires the user to click "retry" — which one belongs where?
