# React Hooks — What They Are & The Rules

## What is a Hook?

A Hook is a function — either one built into React or one you write yourself — that lets a function component "hook into" React features it wouldn't otherwise have access to: state, side effects, refs, context, and more. Before hooks existed, only class components could do these things; hooks bring the same capabilities to plain functions.

Every hook name starts with `use`, and every hook call happens directly inside the body of a function component (or inside another hook) — never inside a regular helper function, a loop, or a condition (see the rules below).

Example — `useState` gives a function component a piece of state it can read and update:

```tsx
function ExpandableCard() {
  const [expanded, setExpanded] = useState(false); // "hooks into" state

  return (
    <button onClick={() => setExpanded(!expanded)}>{expanded ? "Collapse" : "Expand"}</button>
  );
}
```

Without `useState`, `ExpandableCard` would just be a plain function with no memory between calls — `expanded` would reset every time it ran. The hook is what lets it "remember."

## What is a Custom Hook?

A custom hook is a regular JavaScript function — one you write — whose name starts with `use` and that calls one or more built-in (or other custom) hooks inside it. It exists for the same reason any function exists: to pull out repeated logic so it isn't duplicated across components. The difference from a normal helper function is that a custom hook is allowed to use hooks internally, because React recognizes the `use` prefix.

Example — extracting the Day 3 fetch logic (`students`, `loading`, `error`) into a reusable `useStudents` hook:

```tsx
// useStudents.ts
import { useEffect, useState } from "react";
import type { Student } from "../types/types";

interface UseStudentsResult {
  students: Student[];
  loading: boolean;
  error: string | null;
}

function useStudents(): UseStudentsResult {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch("http://localhost:3000/students")
      .then((res) => res.json())
      .then((data: Student[]) => setStudents(data))
      .catch((err) => setError(err instanceof Error ? err.message : "Unknown error"))
      .finally(() => setLoading(false));
  }, []);

  return { students, loading, error };
}

export default useStudents;
```

Using it is now a single line, and any other component that needs the same data can reuse it too:

```tsx
function CardGrid() {
  const { students, loading, error } = useStudents();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong: {error}</p>;

  return (
    <div className="card-grid">
      {students.map((student) => (
        <StudentCard key={student.id} {...student} onViewProfile={handleViewProfile} />
      ))}
    </div>
  );
}
```

All the `useState`/`useEffect` logic moved out of `CardGrid` and into `useStudents` — `CardGrid` just consumes the result.

## Rule 1: Only call hooks at the top level

Don't call hooks inside loops, conditions, or nested functions.

Bad:

```tsx
function StudentCard({ student }: Props) {
  if (student.active) {
    const [expanded, setExpanded] = useState(false); // conditional hook call
  }
  // ...
}
```

Good — call the hook unconditionally, then use the condition around what you do with it:

```tsx
function StudentCard({ student }: Props) {
  const [expanded, setExpanded] = useState(false); // always called
  if (!student.active) return null;
  // ...
}
```

**Why:** React doesn't track hooks by name — it tracks them by call order, using a shared internal list per component instance. If a hook call is skipped on some renders and included on others, every hook after it shifts by one slot, and React ends up handing the component the wrong state.

## Rule 2: Only call hooks from React functions

Only call hooks from:

- React function components (e.g. `function StudentCard() { ... }`)
- Custom hooks (functions whose name starts with `use`, e.g. `useStudents()`)

Never from regular JS functions, class components, or outside of a component's render.

## Custom hooks must start with `use`

This isn't just a style convention — it's how React (and lint tooling) knows a function is allowed to call other hooks internally. `useStudents()`, `useAuth()`, `useDebounce()` are all valid; `getStudents()` is not, even if it internally calls `useState`.

## Enforced automatically in this project

`Reactjs/.oxlintrc.json` already has `"react/rules-of-hooks": "error"` enabled, so Oxlint flags a violation before it ever becomes a runtime bug. Run `npm run lint` to check.

## Quick reference

| Rule | Bad | Good |
|---|---|---|
| Top level only | Hook inside `if`/`for`/a nested function | Hook called unconditionally at the top of the component |
| React functions only | Hook called in a plain helper function | Hook called in a component or a `use`-prefixed custom hook |
| Naming | `getStudents()` internally using `useState` | `useStudents()` |
