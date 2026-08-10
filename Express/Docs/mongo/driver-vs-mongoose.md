# Driver or Mongoose

Both talk to the same database. The driver sends commands. Mongoose sends the same commands
with a schema layer in front.

## What the driver does not do

MongoDB has no schema, so nothing rejects a document of the wrong shape:

```js
await items.insertOne({ nmae: "Typo" });
```

This succeeds. The collection now holds a document with a misspelled field, and the bug
appears later as a missing value somewhere unrelated. TypeScript does not help here, because
it checks the code, not the data that reaches the database at runtime.

Writing this by hand means checking every field before every insert and update, in every
place that writes. That check is what an ODM is.

## What Mongoose adds

**A schema in one place.** One file states what a document contains. Without it the shape is
whatever the code that writes it happened to send.

**Validation before the write.** Required fields, allowed values, ranges. Errors arrive as a
`ValidationError` naming each failing field.

**Unknown fields dropped.** A key not in the schema is not stored, so a typo cannot quietly
create a new field.

**Defaults and timestamps.** Filled in without being sent.

**Convenience.** `findByIdAndUpdate` rather than `updateOne` with `$set` and an `ObjectId`.

**Hooks.** Code that runs before or after a save, which is the usual place for hashing a
password or maintaining a derived field.

## What it costs

**A layer to see through.** What is sent is no longer exactly what was written. Debugging
means knowing what Mongoose does on your behalf.

**The schema is enforced by the application, not the database.** Any other program writing to
the same database ignores it entirely, as does anything typed into a shell. Mongoose
validation is a good default, not a guarantee. Database level rules require MongoDB's own
schema validation, which is configured on the collection.

**A second API to learn.** Close to the driver's, but not identical, and the differences are
in the details rather than the outline.

## Differences worth remembering

| Driver                                      | Mongoose                                               |
| ------------------------------------------- | ------------------------------------------------------ |
| `find()` returns a cursor, then `toArray()` | `find()` returns a query, awaiting gives an array      |
| `updateOne(filter, { $set: changes })`      | `findByIdAndUpdate(id, changes)`, `$set` added for you |
| `{ returnDocument: "after" }`               | `{ new: true }`                                        |
| `new ObjectId(id)` before querying          | `findById(id)` casts the string                        |
| Returns plain objects                       | Returns documents with methods                         |
| Validation is your own code                 | Validation is in the schema                            |

## Which to use

Use Mongoose when documents have a known shape that the application owns, which is most
applications. Use the driver directly for scripts, migrations and one off queries where a
schema adds nothing, and for the small number of operations Mongoose does not wrap.

## Use the MongoDB Driver when you want:

- maximum control
- maximum MongoDB feature access
- minimal abstraction
- high-performance data access
- relatively simple data models
- you're comfortable handling validation yourself

## Use Mongoose when you want:

- schemas
- validation
- models
- middleware
- hooks
- populate
- structured application architecture
- convenient TypeScript models
