# express.Router

A Router is a group of routes that share a path prefix. It lets one file own one resource
instead of every route living in the server file.

## Why use it?

Every route for one resource repeats the same prefix:

```js
app.get("/items", ...);
app.get("/items/:id", ...);
app.post("/items", ...);
app.put("/items/:id", ...);
app.delete("/items/:id", ...);
```

## Splitting it out

The router file declares paths relative to the prefix, so `/items` becomes `/`:

```js
// routes/items.js
import { Router } from "express";

const router = Router();

router.get("/", (req, res) => { ... });
router.get("/:id", (req, res) => { ... });
router.post("/", (req, res) => { ... });

export default router;
```

The server file mounts it under the prefix, which appears exactly once:

```js
// server.js
import itemsRouter from "./routes/items.js";

app.use("/items", itemsRouter);
```

`GET /items/42` now reaches the router's `/:id` handler.

The prefix lives in one place, so renaming the resource is a one-line change and each file stays
short enough to read. Adding a second resource means adding a file rather than growing an
existing one.

## Mounting more than one

```js
app.use("/items", itemsRouter);
app.use("/users", usersRouter);
```

## Things to watch

Paths inside the router are relative. Writing `router.get("/items")` inside a router mounted
at `/items` produces `/items/items`.

Route order still applies inside a router, so put specific paths above patterns that would
also match them.

A router can carry its own middleware with `router.use(...)`, which then runs only for
requests that reach that router. That becomes useful for things like requiring a login on one
group of routes.
