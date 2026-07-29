# React Context & useContext

## What is Context

Context lets a component provide a value to everything below it in the tree, so any descendant — no matter how deep — can read that value directly instead of receiving it through a chain of props. It's the built-in answer to prop-drilling.

The part people get wrong: **Context is a transport, not a state container.** It moves a value down the tree; it does not hold or manage state on its own. You still keep the actual state with `useState` or `useReducer` somewhere, and Context is just how you hand it out. "Using Context" and "doing state management" are not the same thing.

## The three pieces

```tsx
// 1. Create the context (with a sensible default).
const ThemeContext = createContext<ThemeValue | null>(null);

// 2. Provide a value to a subtree. Everything inside can read it.
function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<"light" | "dark">("light");
  const value = {
    mode,
    toggle: () => setMode((m) => (m === "light" ? "dark" : "light")),
  };
  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}

// 3. Read it anywhere below, with no props threaded through.
function ThemeToggleButton() {
  const { mode, toggle } = useContext(ThemeContext)!;
  return (
    <button onClick={toggle}>
      Switch to {mode === "light" ? "dark" : "light"}
    </button>
  );
}
```

Note that `mode` is held by `useState` inside the provider — Context is just delivering it. The state still lives in a normal React hook.

## The custom-hook + guard pattern

Reading a context that might be `null` (because a component was rendered outside its provider) is a common bug. The idiomatic fix is a small custom hook that reads the context and throws a clear error if it's missing:

```tsx
function useTheme() {
  const value = useContext(ThemeContext);
  if (!value) throw new Error("useTheme must be used inside <ThemeProvider>");
  return value;
}
```

Now components call `useTheme()` and never deal with the `null` case, and a misplaced component fails loudly with a helpful message instead of silently. (This is a custom hook like any other — it starts with `use` and calls a hook inside, so the Rules of Hooks apply.)

## The cost: re-renders

Context's big catch: **when the provider's value changes, every component reading that context re-renders** — all of them, whether or not they care about the part that changed. Context has no way to subscribe to just a slice of the value; it's all-or-nothing.

For rarely-changing values (theme, locale, the current user) that's a non-issue — the value barely changes, so the re-renders barely happen. It becomes a problem when you put frequently-changing state in a context that lots of components read: every tiny update re-renders all of them.

Two common mitigations:

- **Memoize the provider value** so it isn't a brand-new object on every render (a new object reference is treated as a change and re-renders all consumers even if the contents are identical).
- **Split into separate contexts** — e.g. one for a value that changes and one for the setter that doesn't — so components that only need the stable half don't re-render when the other half changes.

## Context vs. Redux — choosing one

They solve overlapping problems, but they're aimed at different situations.

**Reach for Context when** the shared value is relatively stable and simply needs to reach many components: theme, language, the logged-in user, feature flags. It's built in, has almost no boilerplate, and is exactly right for this "set it up high, read it wherever" job.

**Reach for a store like Redux when** the shared state is complex, changes often, and is read/written from many places — and you'd benefit from selectors (subscribe to just a slice, so only the components using that slice re-render), DevTools (inspect every change, time-travel), and a structured, predictable update flow. That power costs a dependency and more concepts.

A useful way to hold it: Context answers "how do I get this value to the components that need it?" A store answers "how do I manage complex, changing state predictably?" Context doesn't do the second on its own — pairing `useContext` with `useReducer` gets you partway, but without selectors or tooling.

And it's **not either/or.** In this project, auth lives in Redux (checked often, part of a structured flow) while the theme lives in Context (set once, rarely changes). Most real apps use both, each for what it's good at.

## Quick recap

| Concept              | What it is                                                                                                             |
| -------------------- | ---------------------------------------------------------------------------------------------------------------------- |
| Context              | A built-in way to provide a value to a subtree and read it at any depth                                                |
| `createContext`      | Creates the context object (holds a default value)                                                                     |
| Provider             | `<Ctx.Provider value={...}>` — makes the value available to everything inside                                          |
| `useContext`         | Reads the current context value from any descendant                                                                    |
| Transport, not state | Context delivers a value; state still lives in `useState`/`useReducer`                                                 |
| Re-render cost       | Every consumer re-renders when the value changes; no per-slice subscription                                            |
| Context vs Redux     | Context = share stable values without prop-drilling; store = manage complex, churny shared state (selectors, DevTools) |
