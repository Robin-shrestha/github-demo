# The MongoDB Driver

The official driver is the library the database itself ships. It sends commands and returns
results, and does nothing else. There is no schema, no validation and no model layer.

## Connecting

```js
import { MongoClient, ServerApiVersion } from "mongodb";

const client = new MongoClient(uri, {
  serverApi: { version: ServerApiVersion.v1, deprecationErrors: true },
});

await client.connect();
```

`serverApi` pins the command set to a stable version, so a future server upgrade cannot
change the meaning of a command underneath the app. `deprecationErrors: true` turns
deprecation warnings into errors.

The connection snippet Atlas hands out also sets `strict: true`. That makes the server reject
any command outside the versioned set, and the set is smaller than it sounds. Everyday
commands such as `distinct` are not in it, so a query that works fine elsewhere fails with:

```
MongoServerError: Provided apiStrict:true, but the command distinct
is not in API Version 1.
```

Leave `strict` off unless there is a specific reason to lock the app down to the versioned
commands only.

## One client, shared

A `MongoClient` manages a pool of connections. Create it once and export it. Creating a
client per request opens a new pool each time and will exhaust the server's connection limit.

```js
export const client = new MongoClient(uri, options);
export const db = client.db("students");
export const students = db.collection("students");
```

## Confirming the connection actually works

`connect()` can resolve before any real command reaches the server, so a ping is worth doing
at startup:

```js
await client.connect();
await db.command({ ping: 1 });
```

Without it, a wrong password or an unreachable host may only surface on the first query,
which could be minutes later and in the middle of a request.

## Naming the database

`client.db()` with no argument uses the database from the URI path. When the URI ends in a
bare `/`, the driver falls back to a database literally named `test`. Passing the name
explicitly avoids writing to the wrong place:

```js
const db = client.db("students");
```

## Getting a collection

```js
const students = db.collection("students");
```

The collection name is exactly the string given. Nothing is pluralised or transformed, unlike
an ODM that derives the name from a model.

Neither the database nor the collection has to exist. Both are created on first write.

## Types

There is no schema, so TypeScript is the only thing describing the shape:

```ts
interface Student {
  name: string;
  role: string;
  avatar: string;
}

export const students = db.collection<Student>("students");
```

`find()` results and `insertOne()` arguments are now checked against that interface. Worth
being clear about what this does and does not do: it checks the code, not the data. A
document written by another program, or by an older version of this one, can have any shape
at all, and the type says nothing about it.

## \_id and ObjectId

Every document gets an `_id`, generated as an `ObjectId` unless one is supplied. The driver
returns it as an `ObjectId` instance, not a string.

That matters when an id arrives from a URL or a JSON body, because it will be a string and
has to be converted before it can be used in a filter:

```js
import { ObjectId } from "mongodb";

await students.findOne({ _id: new ObjectId(idFromUrl) });
```

`new ObjectId()` throws on a malformed value, which is a 400. A well-formed id that matches
nothing returns `null`, which is a 404.

## Closing

```js
await client.close();
```

Scripts should close so the process can exit. A long-running server usually should not: the
client is meant to stay open for the lifetime of the app.

## Driver or ODM

The driver is what an ODM such as Mongoose is built on. The driver gives commands and
results. An ODM adds schemas, validation, casting and lifecycle hooks on top, at the cost of
a layer between the code and the query actually sent.

Starting with the driver means the mapping between code and database commands is direct:
`students.find({ role: "Backend" })` is the query, not a description of one.
