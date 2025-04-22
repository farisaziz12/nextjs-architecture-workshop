# Error Boundaries Exercise

## Objective
In this exercise, you'll learn how to implement error boundaries in a Next.js application. You'll work with 4 quadrants that each contain components that will throw errors when interacted with. Currently, any error will crash the entire application, but you'll add error boundaries to isolate failures to their respective quadrants.

## Goals
1. Implement error boundaries to isolate failures to individual quadrants
2. Understand how to use error tags for better error reporting
3. Create custom fallback UIs for different types of errors

## Initial State
In the starting code:
- The application has a global error boundary in `_app.tsx`
- Any error in any of the quadrants will crash the entire application
- There are TODO comments throughout the codebase guiding you on what to implement

## Tasks
1. Import the `QuadrantErrorBoundary` component in `pages/index.tsx`
2. Wrap each quadrant with a `QuadrantErrorBoundary` component
3. Add appropriate error tags to each boundary for better error reporting
4. (Optional) Create a custom fallback UI for at least one quadrant

## Components Overview
- `QuadrantErrorBoundary.tsx`: A reusable error boundary component that you'll use to wrap each quadrant
- `GlobalErrorBoundary.tsx`: Already implemented to catch uncaught errors at the application level
- `Quadrant1.tsx`, `Quadrant2.tsx`, etc.: Components that intentionally throw errors when interacted with

## Tips
- Error boundaries only catch errors in the component tree below them
- Each error boundary can have its own error tag for better categorization
- You can provide custom fallback UIs to replace the default error UI
- The `resetError` method allows users to retry after an error occurs

## Understanding Error Tags
Error tags help categorize different types of errors for better reporting. When you add an error tag to an error boundary, it gets passed to the error reporting service (like Sentry in real applications) to group similar errors together, rather than relying on the underlying error name.