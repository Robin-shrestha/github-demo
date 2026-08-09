# MongoDB Queries

Reading, filtering, shaping, updating and deleting with the driver. Every example assumes a
collection called `students`.

## Reading

```js
await students.find().toArray(); // every document
await students.find({ role: "Backend" }).toArray(); // filtered
await students.findOne({ role: "Backend" }); // one document or null
```

`find()` returns a **cursor**, not an array. Nothing is fetched until it is collected:

```js
const cursor = students.find(); // no query sent yet
const list = await cursor.toArray(); // now it runs
```

A cursor can also be iterated, which avoids loading everything into memory at once:

```js
for await (const student of students.find()) {
  console.log(student.name);
}
```

`find` gives `[]` when nothing matches, `findOne` gives `null`. Neither is an error, so a
missing record has to be checked for rather than caught.

There is no `findById`. The id is an ordinary field:

```js
await students.findOne({ _id: new ObjectId(id) });
```

## Filters

A filter object matches on equality by default. Operators go in a nested object.

```
{ role: "Backend" }                            equal
{ role: { $ne: "Backend" } }                   not equal
{ role: { $in: ["Frontend", "Fullstack"] } }   any of
{ age: { $gt: 18 } }                           greater than, also $gte $lt $lte
{ name: /^S/ }                                 regex, starts with S
{ name: /ra/i }                                regex, contains, case insensitive
{ email: { $exists: true } }                   field is present at all
```

Several keys in one object means AND:

```
{ role: "Backend", name: /^P/ }
```

OR needs `$or`, which takes an array of complete filters:

```
{ $or: [{ role: "Frontend" }, { name: /^A/ }] }
```

`$exists` has no real equivalent in SQL. It matters here because documents in one collection
are not obliged to have the same fields.

## Shaping the result

Projection is the second argument to `find`, not a chained method. 1 includes a field, 0
excludes it:

```js
await students.find({}, { projection: { name: 1 } }).toArray();
await students.find({}, { projection: { name: 1, _id: 0 } }).toArray();
await students.find({}, { projection: { avatar: 0 } }).toArray();
```

`_id` comes back unless explicitly switched off.

Sorting and paging chain onto the cursor:

```js
await students.find().sort({ name: 1 }).toArray(); // 1 asc, -1 desc
await students.find().limit(10).toArray();
await students.find().skip(20).limit(10).toArray(); // page three of ten
await students.countDocuments({ role: "Backend" });
await students.distinct("role"); // unique values of one field
```

All together:

```js
const results = await students
  .find({ role: { $ne: "Backend" } }, { projection: { name: 1, _id: 0 } })
  .sort({ name: 1 })
  .limit(5)
  .toArray();
```

Selecting fewer fields means less data over the wire. On a large collection, projection and
`limit` are the difference between a fast endpoint and a slow one.

## Updating

```js
await students.updateOne({ _id: id }, { $set: { role: "Backend" } });
await students.updateMany({ role: "QA" }, { $set: { role: "Quality" } });
await students.findOneAndUpdate({ _id: id }, { $set: { role: "Backend" } });
```

**The update operator is required.** Passing a bare object throws. `$set` changes the listed
fields and leaves the rest alone; other operators include `$inc`, `$push` and `$unset`.

`updateOne` and `updateMany` return counts, not documents:

```js
const result = await students.updateOne(filter, update);
result.matchedCount; // how many the filter found
result.modifiedCount; // how many actually changed
```

Those two differ when the update sets a field to the value it already had.

`findOneAndUpdate` returns the document, and by default that is the version from **before**
the change:

```js
await students.findOneAndUpdate(filter, update, { returnDocument: "after" });
```

Returning the stale one to an API caller is a common bug.

`upsert` inserts when nothing matched:

```js
await students.updateOne(filter, update, { upsert: true });
```

## Deleting

```js
await students.deleteOne({ _id: id });
await students.deleteMany({ role: "Frontend" });
await students.findOneAndDelete({ _id: id }); // returns the deleted document
```

`deleteOne` returns `{ deletedCount }`. A `deletedCount` of 0 means nothing matched, which is
how an endpoint knows to answer 404 rather than 204.

## Nothing validates the data

There is no schema, so the database accepts whatever is sent. A missing field, a number where
a string was expected, a typo in a key: all written without complaint.

```js
await students.insertOne({ nmae: "typo" }); // fine as far as MongoDB cares
```

TypeScript catches this in code that uses the typed collection, but only there. Anything
reaching the database another way is unchecked. Validation is the application's job, either
in the route layer or by adding a library that provides schemas.
