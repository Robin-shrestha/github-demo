# Routing, Params and Request Bodies

Three different places data arrives from in a request, and how to read each one.

## Route params

Named segments in the path, written with a colon. Used to identify one specific thing.

```js
app.get("/items/:id", (req, res) => {
  console.log(req.params.id);
});
```

`GET /items/42` gives `req.params.id === "42"`. Values are always strings, even when they
look like numbers, so compare against strings or convert first.

Multiple params work too:

```js
app.get("/users/:userId/posts/:postId", (req, res) => {
  const { userId, postId } = req.params;
});
```

## Query strings

Everything after the `?`. Used for optional things: filtering, sorting, paging.

```js
app.get("/items", (req, res) => {
  const { role, page } = req.query;
});
```

`GET /items?role=admin&page=2` gives `role === "admin"` and `page === "2"`.

A query value is `undefined` when absent, a string when present once, and an array when
repeated (`?tag=a&tag=b`). Check the type before using it:

## Request bodies

Bodies arrive as a stream, so Express does not parse them unless told to. Add the JSON parser
once, before the routes:

```js
app.use(express.json());
```

Then `req.body` is the parsed object:

```js
app.post("/items", (req, res) => {
  const { name } = req.body;
});
```

Without `express.json()`, `req.body` is `undefined`.

## Which to use for what

| Need                              | Use          | Example                 |
| --------------------------------- | ------------ | ----------------------- |
| Identify one resource             | Route param  | `GET /items/42`         |
| Filter, sort or page a collection | Query string | `GET /items?role=admin` |
| Send data to create or update     | Body         | `POST /items` with JSON |

Bodies belong on POST, PUT and PATCH. GET and DELETE requests should carry what they need in
the path or query string instead.
