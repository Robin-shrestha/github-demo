# Global State & Redux

## The problem: prop-drilling

Most state belongs where it's used: a form's fields live in the form, a toggle's on/off lives in the component with the switch. React's own `useState` is perfect for that.

The trouble starts when a lot of components, spread across the tree, need the same piece of state. The usual first move is to lift that state up to a common parent and pass it down as props. That works until the parent and the components that actually need the value are several layers apart — and now every component in between has to accept the prop and hand it along, even though it never uses it itself.

## What global state is

Global state is state that lives _outside_ the component tree, in one shared place any component can read from and write to directly — without the value being threaded through props. A component that needs "is the user logged in?" asks the shared store for it; a component that wants to log out tells the store, and everything reading that value updates. No intermediate component has to know the value exists.

A **store** is that shared place. Redux is one popular implementation of the idea, but the concept — one central bucket of shared state — shows up in many tools.

## The core pieces (Redux vocabulary)

Redux is built from a few small, strict parts. The strictness is the point: state only changes in one predictable way, which makes the app easier to reason about and debug.

- **Store** — the single object holding your shared state.
- **Action** — a plain object describing _what happened_, e.g. `{ type: "auth/login" }`. It's just a message; it doesn't change anything by itself.
- **Reducer** — a pure function that takes the current state and an action and returns the _next_ state. Same inputs, same output, no side effects. This is the only thing allowed to compute new state.
- **Dispatch** — how you send an action to the store ("this happened, deal with it").
- **Selector** — how a component reads a slice of state out of the store.

The flow is a one-way loop: a component **dispatches** an action → the **reducer** produces new state → the **store** updates → components reading that state (via **selectors**) re-render. State never changes any other way, which is what makes it predictable.

## Why Redux Toolkit, not "plain" Redux

Redux the original library was famously verbose. You hand-wrote action-type string constants, action creator functions, and big `switch` statements in reducers, and you had to copy objects carefully by hand every time to avoid mutating state. The ideas were good; the ceremony was exhausting.

**Redux Toolkit (RTK)** is the official, batteries-included way to use Redux, and it removes most of that ceremony:

- `configureStore` sets up the store (with sensible defaults and DevTools wired up) in one call.
- `createSlice` bundles a piece of state with its reducers and _auto-generates the action creators_ for you — no hand-written action types.
- It uses **Immer** under the hood, so inside a reducer you can write what looks like a direct mutation (`state.isAuthenticated = true`) and it safely produces a new immutable state for you.

```ts
// A slice: state + reducers in one place, action creators generated for you.
const authSlice = createSlice({
  name: "auth",
  initialState: { isAuthenticated: false },
  reducers: {
    login(state) {
      state.isAuthenticated = true; // looks mutable, Immer makes it safe
    },
    logout(state) {
      state.isAuthenticated = false;
    },
  },
});
```

A component then reads with a selector and writes with dispatch — no props threaded through the middle:

```tsx
const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
const dispatch = useDispatch();
// ...
dispatch(authSlice.actions.logout());
```

## When NOT to reach for Redux

Redux is not a default. Most apps, and most state, don't need it. Reaching for a global store when a local `useState` would do just adds indirection.

when to use it: many components across the tree read and write the same state, that state changes in ways worth tracing, or you want the debugging tools (Redux DevTools can show every action and even "time-travel" through state changes).

For lighter needs there are smaller options — React's own **Context** (covered separately) for passing a value down without prop-drilling, a custom hook, or just keeping state local.

## Alternatives for global state

Zustand, Recoil, Jotai

## Quick recap

| Term          | What it is                                                                              |
| ------------- | --------------------------------------------------------------------------------------- |
| Prop-drilling | Passing a prop through components that don't use it, just to reach one that does        |
| Global state  | Shared state kept outside the component tree, readable/writable from anywhere           |
| Store         | The single object holding global state                                                  |
| Action        | A plain object describing what happened                                                 |
| Reducer       | A pure function: `(state, action) → next state`                                         |
| Dispatch      | Sending an action to the store                                                          |
| Selector      | Reading a slice of state out of the store                                               |
| Redux Toolkit | The official, low-boilerplate way to use Redux (`configureStore`, `createSlice`, Immer) |
