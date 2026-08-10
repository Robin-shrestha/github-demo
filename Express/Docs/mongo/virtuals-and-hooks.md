# Virtuals and hooks

Two schema features that do things field options cannot.

## Virtuals

A virtual is a field computed when you read it. It is never stored.

```js
markSchema.virtual("percentage").get(function () {
  return Math.round((this.score / this.maxScore) * 100);
});
```

It must be `function` and not an arrow, because `this` has to be the document. An arrow
function captures `this` from the surrounding scope and the getter breaks.

Read it like any other field:

```js
const mark = await Mark.findOne();
mark.percentage;
```

Use a virtual when a value can always be derived from fields that are already there. Storing
it instead means two places that can disagree, and a `percentage` that no longer matches
`score` is worse than no `percentage` at all.

### What virtuals cannot do

**They are not in the database**, so they cannot be queried, filtered or sorted:

```js
await Mark.find({ percentage: { $gte: 80 } }); // matches nothing
```

There is no such field to match on. If a client needs to filter by it, it has to be a real
field, kept correct on every write.

**They are left out of JSON by default.** `res.json()` will not include a virtual unless the
schema is told to serialise them.

**They are not in the inferred type.** `InferSchemaType` reads the field definitions, and a
virtual is not one, so TypeScript does not know about it. `document.get("percentage")` works
in the meantime.

## Hooks

A hook is a function that runs before or after an operation. `pre` runs before, `post` runs
after. They are the same idea as request middleware, one layer down.

### Document hooks

`pre("save")` runs on `save()` and on `create()`. `this` is the document:

```js
noteSchema.pre("save", function () {
  const now = new Date();

  if (this.isNew) {
    this.createdAt = now;
  }

  this.updatedAt = now;
});
```

`this.isNew` distinguishes a first save from a later one, which is how a created date is set
once and never touched again.

This is worth writing by hand once, because it is exactly what `{ timestamps: true }` does.
Having seen it, use the option.

### Query hooks

Update methods never load the document, so a document hook cannot fire. `findByIdAndUpdate`
sends a command straight to the database and gets a result back.

That means the hook above keeps `createdAt` and `updatedAt` correct for `save()` and quietly
leaves `updatedAt` stale for every update. The fix is a hook on the query instead:

```js
noteSchema.pre("findOneAndUpdate", function () {
  this.set({ updatedAt: new Date() });
});
```

`this` here is the query, not a document, so there are no fields to read and no `isNew`.
`this.set()` adds to the update being sent.

`findByIdAndUpdate` is `findOneAndUpdate` underneath, so one hook covers both.

### The rule worth remembering

| Operation                        | Document hooks | Query hooks |
| -------------------------------- | -------------- | ----------- |
| `save()`, `create()`             | run            | do not run  |
| `findByIdAndUpdate`, `updateOne` | do not run     | run         |
| `insertMany`                     | do not run     | do not run  |

This is the same split as schema validation, which also only runs on `save` unless an update
is given `runValidators: true`. Anything that must happen on every write needs covering on
both paths, or the write has to go through `save()`.

### Async hooks

Return a promise or declare the function `async` and the operation waits:

```js
userSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
});
```

`this.isModified` avoids repeating work when the field has not changed. This is the usual
place for hashing a password, and the reason it belongs in a hook rather than in a route is
that every path that saves a user gets it, including a script.
