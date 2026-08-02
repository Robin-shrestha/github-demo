# Error Handling

Without a custom error handler, Express replies to a failure with an HTML page. An API that
returns JSON when things work and HTML when they do not is awkward to consume, and the fix is
one function.

## The error handler

It looks like middleware with one extra parameter:

```js
function errorHandler(err, req, res, next) {
  const status = err.status ?? 500;
  res.status(status).json({ error: err.message });
}
```

Four parameters is what marks it as an error handler. With three, Express treats it as normal
middleware, no matter what the parameters are named.

Register it last, after every route:

```js
app.use("/items", itemsRouter);
app.use(notFound);
app.use(errorHandler);
```

## Reaching it

Call `next(err)` with an argument. Anything passed to `next` that is not the string `"route"`
is treated as an error, and Express skips straight past the remaining normal middleware to
the error handler.

```js
router.get("/:id", (req, res, next) => {
  const item = findItem(req.params.id);

  if (!item) {
    next(someError);
    return;
  }

  res.json(item);
});
```

Throwing works too, in synchronous code and, from Express 5 onward, in async handlers.

## Attaching a status

A plain `Error` has no status, so the handler cannot tell a missing record from a crash. A
small helper solves it:

```js
export class HttpError extends Error {
  static statusCode = 500;
  status: number;

  constructor(status = HttpError.statusCode, message?: string) {
    super(message);
    this.name = new.target.name;
    this.status = status;
  }
}

next(new HttpError("No item with that id"));
```

Anything without a status becomes a 500, which is the right default. An unexpected error is a
server error until proven otherwise.

## Async errors

In Express 4, a rejected promise inside an async handler was not caught. It became an
unhandled rejection and the request hung until the client gave up. There were three common
ways around it.

**Try/catch in every handler.** Correct, but the same four lines repeated everywhere:

```js
router.get("/:id", async (req, res, next) => {
  try {
    const item = await db.find(req.params.id);
    res.json(item);
  } catch (err) {
    next(err);
  }
});
```

**An asyncHandler wrapper.** A function that takes a handler, runs it, and attaches `next` to
the rejection. Written once, then wrapped around every async route:

```js
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

router.get(
  "/:id",
  asyncHandler(async (req, res) => {
    const item = await db.find(req.params.id);
    res.json(item);
  })
);
```

**The express-async-errors package.** Imported once at the top of the app, it patches Express
so no wrapper is needed at the call site:

```js
import "express-async-errors";
```

Express 5 forwards rejected promises to the error handler automatically, so none of the three
is needed:

```js
router.get("/:id", async (req, res) => {
  const item = await db.find(req.params.id); // throwing here is fine
  res.json(item);
});
```

Most tutorials still teach the wrapper. Recognising it matters, because inherited code is
full of it, and because seeing `asyncHandler` is a sign that the code was
written for Express 4.

## Routing 404s through the same place

A request that matches no route is just another failure. Handling it as one keeps every error
response identical in shape:

```js
function notFound(req, res, next) {
  next(httpError(404, `Cannot ${req.method} ${req.originalUrl}`));
}
```

Registered after the routes and before the error handler, it catches everything that fell
through.

## What to log and what to send

Log the full error on the server for 500s, since that is a bug someone needs to fix. Do not
send stack traces or database messages to the client, as they leak internal detail and are
useless to whoever is calling the API.

```js
if (status >= 500) {
  console.error(err);
}

res.status(status).json({ error: err.message });
```

Deliberate 4xx errors do not need logging. They are the API working correctly.
