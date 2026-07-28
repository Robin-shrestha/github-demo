# Error Boundaries

An error boundary is a component that catches a JavaScript error thrown while rendering somewhere below it, and shows a fallback UI instead of letting the whole app crash.

## Why use them

Without one, an error thrown during render unmounts the entire React tree and the user sees a blank page. That is a bad experience for something that might be a small, local problem. An error boundary contains the damage: the broken section shows a fallback, and the rest of the app keeps working.

Common fallbacks: a "Something went wrong" message, a retry button, or a link back to a safe page.

## What they catch (and don't)

An error boundary catches errors thrown during rendering, in lifecycle methods, and in the constructors of the tree below it.

It does not catch errors in event handlers (a click handler that throws), in asynchronous code (a promise rejection, a `setTimeout`), or errors thrown in the boundary itself. Those you handle with regular `try/catch` or by putting the error into state and rendering it.

## Good to know

- Put a catch-all boundary high up, plus targeted boundaries around independent sections.
- Pair boundaries with Suspense so both "loading" and "failed" have fallbacks.
- The boundary is a good place to log the error to a monitoring service.

## Quick recap

| Idea           | What it means                                               |
| -------------- | ----------------------------------------------------------- |
| Error boundary | Catches render-time errors below it and shows a fallback    |
| Catches        | Errors during render, lifecycle, and child constructors     |
| Does not catch | Event handlers, async code, its own errors                  |
| Placement      | A root catch-all plus smaller boundaries around risky areas |
