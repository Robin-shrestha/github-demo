# Code Splitting (lazy & Suspense)

By default a build bundles the whole app into one JavaScript file, so the browser downloads everything before showing anything. Code splitting breaks that bundle into smaller pieces that load only when needed.

## Why use it

As an app grows, the single bundle grows with it, and the user waits longer for the first screen even if they only visit one page. Code splitting lets you load the code for a route or a heavy feature on demand, so the initial download is smaller and the app becomes interactive sooner.

Good split points: individual routes or pages, and large pieces that are not needed right away (a chart library, a rich text editor, a rarely-opened dialog).

## How it works in React

`React.lazy` wraps a dynamic import so a component is fetched only when it first renders. Because that fetch takes time, you wrap the lazy component in `Suspense` and give it a `fallback` to show while the code is loading.

```tsx
const Reports = lazy(() => import("./Reports"));

<Suspense fallback={<p>Loading…</p>}>
  <Reports />
</Suspense>;
```

The bundler sees the dynamic `import()` and automatically puts that code in a separate chunk.

## Pros and cons

Pros: smaller initial download, faster first paint, and code the user never reaches is never downloaded.

Cons: a small delay when a split chunk loads (so it needs a fallback, and you should handle load failure too), and splitting too finely creates many tiny requests, which can be slower than one. Split at meaningful boundaries, not everywhere.

## General rules

- Route level is the most common and highest-value place to split.
- Pair a Suspense boundary with an error boundary so a failed chunk load has a fallback too.
- Measure before micro-splitting. The first big win is usually just lazy-loading routes.

## Quick recap

| Term               | What it is                                               |
| ------------------ | -------------------------------------------------------- |
| Code splitting     | Breaking one bundle into pieces loaded on demand         |
| `lazy`             | Loads a component's code the first time it renders       |
| Dynamic `import()` | The syntax the bundler uses to create a separate chunk   |
| `Suspense`         | A boundary that shows a fallback while inside is loading |
