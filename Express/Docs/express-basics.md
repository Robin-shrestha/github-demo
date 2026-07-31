# Express Basics

Express is a small library on top of Node's built-in `http` module. It does not replace
Node. It adds routing, a request and response API with helpers, and a way to run shared code
on every request.

## Creating an app

```js
import express from "express";

const app = express();

app.get("/", (req, res) => {
  res.json({ message: "Hello" });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
```

`app` is a request handler function, the same shape Node's `createServer` expects. These two
are equivalent:

```js
app.listen(3000);
```

```js
import { createServer } from "node:http";
createServer(app).listen(3000);
```

`app.listen` is a convenience wrapper that creates the server for you. Everything Express
does happens inside a plain request handler.

## What Express gives you over raw http

Writing a JSON API with the `http` module alone means doing four things by hand:

| Job                            | Raw `http`                               | Express                 |
| ------------------------------ | ---------------------------------------- | ----------------------- |
| Match a path and method        | `if` chain on `req.url` and `req.method` | `app.get("/path", ...)` |
| Read a path segment like an id | Regex or `split` on the URL              | `req.params.id`         |
| Read a JSON body               | Collect chunks, then `JSON.parse`        | `express.json()`        |
| Send a JSON response           | Set headers, then `JSON.stringify`       | `res.json(value)`       |

## The response helpers

```js
res.json({ ok: true }); // sets Content-Type and serialises
res.status(201).json(created); // status code, then body
res.status(204).end(); // no body at all
```

`res.status()` returns the response object, so it chains. Sending a response ends the
request, so return after it if there is more code below.

## Route order matters

Express checks routes in the order they are registered and uses the first match. A specific
path has to be registered before a pattern that would also match it:

```js
app.get("/items/count", handler); // must come first
app.get("/items/:id", handler); // otherwise this catches "count" as an id
```

## Handling unmatched requests

Express replies with its own 404 page when nothing matches. To return JSON instead, register
a handler after all routes:

```js
app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});
```
