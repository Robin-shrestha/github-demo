# React Router — Client-Side Routing

A reference for the routing concepts used to add multiple "pages" to a single-page React app.

## Client-side routing

**What it is:** Mapping different URL paths to different rendered components, without the browser making a new request to the server for each path.

**Why it's used:** Without it, an SPA either shows everything on one screen, or swaps content using ad hoc state (e.g. a `currentPage` variable) — which breaks the browser's back/forward buttons, bookmarking, and sharable links, since the URL never changes.

**Alternatives:** Handling it by hand with the browser's native `history.pushState`/`popstate` APIs — possible for a couple of routes, but pattern matching for dynamic segments (`/students/:id`), nested layouts, and redirects have to be built manually.

## react-router-dom

**What it is:** A routing library for React. `BrowserRouter` wraps the app and hooks into the browser's History API; `Routes`/`Route` declare which component renders for which path.

**Why it's used:** Handles path matching (including dynamic segments and catch-alls), nested layouts, and redirects, while integrating with React's re-render model — so navigating updates the URL and the rendered component together, without a full page reload.

**Alternatives:**

- **TanStack Router** — fully type-safe (route params are inferred, not just strings), built-in data loading. Newer, smaller community, steeper setup.
- **Next.js routing (App/Pages Router)** — file-based routing tied to a full framework with server-side rendering. A different tool entirely, relevant only if adopting Next.js instead of a Vite SPA.
- **Wouter** — a minimal (~1.5 kB) hook-based router. Covers basic routes and params, but no built-in nested layouts or data loaders.

## `Link` and `NavLink`

**What it is:** Components that render an `<a>` tag but intercept the click, updating the route via the router instead of letting the browser reload the page. `NavLink` additionally applies an "active" class/style when its `to` path matches the current URL.

**Why it's used:** A plain `<a href="/students/3">` triggers a full page reload, discarding all React state. `Link`/`NavLink` keep navigation inside the SPA.

## `useParams`

**What it is:** A hook that reads dynamic segments out of the current URL. For a route defined as `/students/:id`, `useParams()` returns `{ id: "3" }` when the URL is `/students/3`.

**Why it's used:** Lets one route component (e.g. `StudentProfile`) render different data depending on which URL matched it, instead of needing a separate component per student.

## `useNavigate`

**What it is:** A hook returning a function to change routes from code — outside of a click on a `Link` — such as after a form submits, or a redirect based on a condition.

**Why it's used:** Some navigation isn't tied to a link click (e.g. "go back," or "redirect to login if not authenticated").

## Nested layouts with `Outlet`

**What it is:** A component that marks the spot inside a parent route's element where the matched child route should render. A parent route (e.g. a `Layout` with a shared header/nav) renders `<Outlet />` where its children — `/`, `/students/:id`, etc. — get inserted.

**Why it's used:** Avoids repeating shared UI (header, nav, footer) inside every single route component.

## Catch-all (not-found) routes

**What it is:** A route with `path="*"`, matched only when no other route matches the current URL.

**Why it's used:** Gives users a real page instead of a blank screen when they hit a URL that doesn't exist.

## Protected routes

**What it is:** A wrapper component that checks some condition (e.g. "is the user logged in?") and either renders its children/`<Outlet />`, or redirects elsewhere using `<Navigate />`.

**Why it's used:** Keeps the "is this allowed?" check in one place rather than repeating it inside every route component that needs protecting.

**Note:** This project's version checks a mocked auth flag, not a real login system — real authentication (password hashing, sessions/JWTs) is covered later in the course.

## Quick recap

| Concept | What it's for | Alternatives |
|---|---|---|
| react-router-dom | Maps URL paths to components | TanStack Router, Next.js routing, Wouter |
| `Link` / `NavLink` | Navigate without a full page reload | — |
| `useParams` | Read dynamic URL segments | — |
| `useNavigate` | Navigate from code, not just a click | — |
| `Outlet` | Render a child route inside a shared layout | — |
| Catch-all route (`path="*"`) | Handle unmatched URLs | — |
| Protected route wrapper | Gate a route behind a condition | — |
