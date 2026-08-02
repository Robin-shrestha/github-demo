# Middleware

Middleware is a function that runs during a request, before or instead of the route handler.
It is how anything that applies to more than one route gets written once.

## The shape

```js
function middleware(req, res, next) {
  // do something
  next();
}
```

Three parameters: the request, the response, and `next`. Calling `next()` passes control to
whatever comes after. Not calling it, and not sending a response, leaves the request hanging
until the client times out. That is the most common middleware bug.

Middleware can do three things: change `req` or `res`, end the request by sending a response,
or pass control along with `next()`.

## You are already using it

```js
app.use(express.json());
```

That is middleware. It reads the request body and sets `req.body` before the handler runs.

A handler registered with `app.use` and no path is also middleware, which is how a catch-all
404 works.

## Order is everything

Express runs middleware in the order it is registered, top to bottom. A logger registered
above the routes runs for every request. The same logger registered below them never runs,
because the routes already sent a response.

```js
app.use(logger); // runs for everything below
app.use(express.json());
app.use("/items", itemsRouter);
app.use(notFound); // only reached when nothing above matched
app.use(errorHandler); // last
```

## Three places to attach it

Application level, for every request:

```js
app.use(logger);
```

Router level, for one group of routes:

```js
router.use(requireLogin);
```

Route level, for one endpoint:

```js
router.post("/", validateBody, createHandler);
```

Route level is how repeated checks stop being copy-pasted into each handler. Anything listed
before the final handler runs first, and can reject the request before the handler is ever
called.

## Writing one

A logger that reports the status and how long the request took:

```js
export function requestLogger(req, res, next) {
  const startedAt = Date.now();

  res.on("finish", () => {
    console.log(`${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - startedAt}ms`);
  });

  next();
}
```

The `finish` event fires after the response is sent, which is the only point where the status
code is known. Middleware wraps the whole request, so it can act at both ends.

## Passing data along

Middleware can attach values to `req` for later handlers to read:

```js
function attachUser(req, res, next) {
  req.user = lookUpUser(req.headers.authorization);
  next();
}
```

This is how authentication works: one middleware identifies the user, and every handler after
it can rely on `req.user` existing.

## In TypeScript

Type the parameters with `Request`, `Response` and `NextFunction` from express, or type the
whole function as `RequestHandler`.

One catch. If middleware is written with the default `Request` type and then used on a route
with a path parameter, the params type widens and `req.params.id` stops being a plain string.
Leaving the params generic open avoids it:

```ts
function validateBody<P>(req: Request<P>, res: Response, next: NextFunction): void {
  // only reads req.body, so the params type stays whatever the route says it is
}
```
