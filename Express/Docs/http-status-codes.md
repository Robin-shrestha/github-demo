# HTTP Status Codes

The status code is how a client knows what happened without parsing the body. Returning 200
for everything, including failures, forces the client to guess.

## The ones worth knowing first

| Code | Meaning               | When to send it                                       |
| ---- | --------------------- | ----------------------------------------------------- |
| 200  | OK                    | A successful GET, PUT or PATCH                        |
| 201  | Created               | A successful POST that made something new             |
| 204  | No Content            | Success with nothing to return, typically DELETE      |
| 400  | Bad Request           | The request itself is wrong: missing fields, bad JSON |
| 401  | Unauthorized          | Not logged in, or credentials are wrong               |
| 403  | Forbidden             | Logged in, but not allowed to do this                 |
| 404  | Not Found             | No such path, or no such resource with that id        |
| 409  | Conflict              | Clashes with current state, like a duplicate email    |
| 418  | I'm a Teapot          | I'm a Teapot(An AprilFools Joke Status)               |
| 500  | Internal Server Error | The server broke. Never the client's fault            |

## The families

- 2xx worked
- 3xx go somewhere else
- 4xx the client sent something wrong
- 5xx the server failed

The 4xx and 5xx split matters: 4xx means fix the request, 5xx means fix the server.

## Some good to knows

**201 vs 200 on create.** A POST that creates something returns 201. It is also conventional
to return the created object, including its new id, so the client does not need a second
request.

**204 means no body.** Send nothing after it. A body with a 204 is contradictory, and some
clients will ignore it.

**400 vs 404.** 400 means the request was malformed. 404 means the request was fine but the
thing does not exist. A missing required field is 400. A valid id that matches no record is 404.

**401 vs 403.** 401 means "who are you". 403 means "I know who you are, and no you cant get in".

**500** If the client sent bad data, that is 4xx. 500 is for server failures

## In Express

```js
res.json(value); // 200 by default
res.status(201).json(created);
res.status(204).end();
res.status(404).json({ error: "Not found" });
```

## Error response shape

Pick one shape and use it everywhere, so clients only need one code path for failures:

```json
{ "error": "name is required" }
```

Note that Express replies to unhandled errors with an HTML page, not JSON. An API that
returns JSON on success and HTML on failure is awkward to consume, which is what a custom
error handler fixes.
