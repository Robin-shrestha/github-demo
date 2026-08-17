# CORS

Cross Origin Resource Sharing is a set of response headers that tell a browser it's allowed to
hand a response to JavaScript running on a different origin. Without those headers the browser
throws the response away.

It only exists because of a rule browsers have followed since the 90s: a page can send requests
anywhere, but it can only read responses from its own origin. That rule stops a random website
reading a logged in user's inbox by fetching mail.google.com in the background. CORS is the
exception, and the server has to grant it.

## Origins

An origin is scheme, host and port together. All three have to match.

```
http://localhost:5173     the page
http://localhost:3001     the API           different port
https://localhost:5173    different scheme
http://127.0.0.1:5173     different host, same machine
```

`localhost` and `127.0.0.1` resolve to the same machine but
they're different strings, so the browser treats them as different origins.

Vite runs on 5173, Express on 3001. Cross origin. Nothing breaks in Thunder Client or curl,
which is why this only shows up once a browser is involved.

## Where is CORS enforced

Cors is enforced in the browser, after the response arrives.

when a server gets the request. It runs the handler, queries the database, and sends a reply. The
browser read the response headers and if it doesn't find cors headers(`Access-Control-Allow-Origin`), it refuses to give
the body to the application.
The server has completed the request and the logs will say so, but since cors is enforced in the browser the console logs will show that the request has failed.

Two things follow. Server logs are no help in debugging it, because from the server's side
nothing went wrong. And a POST that looks blocked in the console may already have written a
record.

It also isn't a security feature for the API. Only browsers enforce it. curl, Postman, a
script, another server, none of them care. Keeping people out is authentication's job.

## Preflight

Some requests go straight out and only the response gets checked. A GET, or a POST sending a
plain HTML form, counts as simple.

Anything else gets a preflight. The browser sends this first:

```
OPTIONS /items
Origin: http://localhost:5173
Access-Control-Request-Method: POST
Access-Control-Request-Headers: content-type
```

and waits for the server to say yes before sending the real request.

The browser does this because a cross origin POST could change something. Once the request has
gone out, the damage is done, so for anything beyond the handful of shapes that were already
possible with plain HTML forms, it asks permission first.

This is why GET works and POST doesn't. `Content-Type: application/json` isn't one of
the simple values, so it triggers a preflight, and a plain GET doesn't. Two requests appear in
the network tab where one was expected.

## Implementing CORS on Express

```js
import cors from "cors";

app.use(cors());
```

That opens the door to everyone. Fine in local development, not fine anywhere public. Name the
origin instead:

```js
app.use(
  cors({
    origin: config.CLIENT_ORIGIN,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  })
);
```

Before the routes. Middleware runs top to bottom, and headers cannot be added to a response
that already left.

Keep the origin in config. It differs between local development, staging and production.

## Cookies

Cross origin requests don't carry cookies unless both sides ask for it:

```js
app.use(cors({ origin: config.CLIENT_ORIGIN, credentials: true }));
```

```js
fetch(url, { credentials: "include" });
```

With `credentials: true` the server can no longer reply with `*`. It has to name the origin.
Browsers reject that combination deliberately, because a wildcard plus cookies would let any
site make requests as a logged in user.
