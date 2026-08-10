# Mongoose Basics

Mongoose is an ODM, an object document mapper. It sits on top of the MongoDB driver and adds
a schema, validation and a model API.

## Connecting

```js
import mongoose from "mongoose";

await mongoose.connect(uri, { dbName: "example" });
```

Mongoose stores the connection on the `mongoose` object itself. Models registered in any file
use it without being passed a client, which is why model files do not import a connection.

Connect once when the process starts. `mongoose.disconnect()` closes it.

## Schema

A schema describes the shape of a document.

```js
import { Schema, model } from "mongoose";

const itemSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    status: { type: String, required: true, enum: ["draft", "published"] },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);
```

Common field options:

| Option       | Effect                                       |
| ------------ | -------------------------------------------- |
| `required`   | Reject the document if the field is missing  |
| `default`    | Fill the field in when it is not supplied    |
| `enum`       | Restrict a string to a fixed list            |
| `min`, `max` | Bound a number or a date                     |
| `trim`       | Strip surrounding whitespace from a string   |
| `lowercase`  | Store a string lowercased                    |
| `unique`     | Create a unique index. Not a validation rule |

`{ timestamps: true }` adds `createdAt` and `updatedAt` and maintains them.

## Nested objects and arrays

A document does not have to be flat. A field can hold an object, and the usual way to describe
one is a second schema:

```js
const addressSchema = new Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    postcode: String,
  },
  { _id: false }
);

const userSchema = new Schema({
  name: String,
  address: addressSchema,
});
```

`{ _id: false }` matters. Without it Mongoose gives the nested object its own `_id`, which is
rarely wanted for something that only exists inside its parent.

Nested fields validate like any other, so a missing `address.street` produces a
`ValidationError` on the path `address.street`. Query them with dot notation:

```js
await User.find({ "address.city": "Kathmandu" });
await User.findByIdAndUpdate(id, { "address.city": "Pokhara" });
```

Updating with `{ address: { city: "Pokhara" } }` instead replaces the whole object and drops
the other fields, which is a common way to lose data by accident.

An array of primitives needs only the type in brackets:

```js
hobbies: { type: [String] },
```

It defaults to an empty array rather than `undefined`, so there is no need to guard before
pushing. Matching an array field matches any element:

```js
await User.find({ hobbies: "cycling" });
```

Arrays of objects use the same pattern as a nested object, with the schema in brackets:

```js
contacts: [contactSchema],
```

## Model

```js
export const Item = model("Item", itemSchema);
```

The first argument is the model name. Mongoose lowercases and pluralises it to get the
collection name, so `"Item"` writes to a collection called `items`. Passing a collection name
explicitly as a third argument overrides this.

## Types

The schema already describes the shape, so the TypeScript type can be read off it rather than
written twice:

```ts
type Item = InferSchemaType<typeof itemSchema>;
```

Passing an interface into `new Schema<T>()` instead makes the inference circular, because the
schema then returns the type it was given rather than deriving one.

## Queries

Most query methods take the same filter objects as the driver.

```js
await Item.create({ name: "First", status: "draft" });

await Item.find({ status: "draft" }).sort({ name: 1 }).limit(10);
await Item.findById(id);
await Item.findOne({ name: "First" });

await Item.findByIdAndUpdate(id, { status: "published" }, { new: true });
await Item.findByIdAndDelete(id);

await Item.countDocuments({ status: "draft" });
```

`find` returns a query rather than a cursor. Awaiting it gives an array directly, so there is
no `toArray` step.

A query is only sent when it is awaited, so chaining `sort`, `limit` and `select` builds it up
first. That part matches the driver's cursor behaviour.

## Validation and when it runs

Validation runs on `save()` and `create()`. It does **not** run on update methods such as
`findByIdAndUpdate` unless asked:

```js
await Item.findByIdAndUpdate(id, changes, { new: true, runValidators: true });
```

Without it, an update can put a document into a state the schema forbids.

Errors from validation are a `ValidationError` with one entry per failing field, which is what
makes a useful message possible.

## Custom validation

The built in options cover common cases. Anything else is a function that returns true when
the value is acceptable:

```js
points: {
  type: Number,
  required: true,
  validate: {
    validator: Number.isInteger,
    message: "points must be a whole number",
  },
},
```

The validator only runs when a value is present. `required` is what rejects a missing one, so
the two are separate jobs and a field usually wants both.

### More than one rule per field

Pass an array. Every validator runs, so one save can report several problems at once:

```js
validate: [
  { validator: Number.isInteger, message: "points must be a whole number" },
  { validator: (value) => value <= 100, message: "points cannot exceed 100" },
],
```

### Messages that include the value

`message` can be a function receiving the failing value:

```js
validate: {
  validator: (value) => /^\S+@\S+\.\S+$/.test(value),
  message: (props) => `${props.value} is not an email address`,
},
```

### Comparing against another field

A validator declared with `function` has the document as `this`, which is how one field can be
checked against another. `min` and `max` only compare against constants:

```js
points: {
  type: Number,
  validate: {
    validator: function (value) {
      return value <= this.outOf;
    },
    message: "points cannot be higher than outOf",
  },
},
```

An arrow function breaks this, because `this` is then whatever surrounds the schema.

The catch is that `this` is only the document on the save path. During an update there is no
document in memory, so a validator that reads another field cannot work there. Cross field
rules that must hold on updates belong in a query hook, or the write has to go through
`save()`.

### Validators do not run on missing values

A validator is only called when there is a value to check. A field left out entirely is
`required`'s job, not the validator's, so a rule like "must be present when some other field
says so" cannot be written as a validator.

`required` accepts a function for exactly that case:

```js
guardianEmail: {
  type: String,
  required: function () {
    return this.age < 18;
  },
},
```

Again `function` and not an arrow, because `this` has to be the document.

### Async validators

Return a promise and the save waits for it:

```js
validate: {
  validator: async (value) => (await Teacher.countDocuments({ email: value })) === 0,
  message: "that email is already taken",
},
```

Reaching for the database inside a validator is worth thinking twice about. It costs a query
on every save, and it cannot promise anything, because two requests can both pass the check
before either has written. A unique index is the only real guarantee.

### Reading the error

A `ValidationError` carries one entry per failing path:

```js
try {
  await Score.create(input);
} catch (err) {
  if (err.name === "ValidationError") {
    for (const [path, detail] of Object.entries(err.errors)) {
      console.log(path, detail.message);
    }
  }
}
```

That shape is what makes a per-field API response possible, and it is the difference between
this and the raw `Document failed validation` a database level validator returns.

## Documents are not plain objects

What comes back from a query is a Mongoose document with methods on it, not a plain object.
`toObject()` and `toJSON()` convert it. `res.json()` calls `toJSON()` automatically, which is
why responses look plain even though the value is not.

Every document also has an `id` getter that returns `_id` as a string. It exists on the
document only, not in the database.

## Hooks

Functions can run before or after a save:

```js
itemSchema.pre("save", function () {
  // runs before every save of this model
});
```

This is how derived fields and hashed passwords are usually handled.
