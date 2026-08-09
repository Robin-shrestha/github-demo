# MongoDB Basics

MongoDB stores JSON-like documents instead of rows in tables. For an application that
already speaks JSON end to end, that removes a translation step.

## The vocabulary

| MongoDB    | Rough SQL equivalent | What it is                     |
| ---------- | -------------------- | ------------------------------ |
| database   | database             | A named group of collections   |
| collection | table                | A group of documents           |
| document   | row                  | One record, stored as BSON     |
| field      | column               | One key inside a document      |
| \_id       | primary key          | Unique id, added automatically |

A document looks like the object you would send over an API:

```json
{
  "_id": "6712a3f19c4d2b0012a4b8e1",
  "name": "Priya Thapa",
  "role": "Backend"
}
```

## Documents are not rows

Two differences matter in practice.

**No fixed shape.** Two documents in the same collection can have different fields. Nothing
stops one student having an `email` and another not. This is flexible and also a trap, which
is why a schema gets defined in application code.

**Related data can be nested.** Where SQL splits data across tables and joins them back
together, a document can hold an array or an object inline. Deciding when to nest and when to
reference is its own topic.

## \_id and ObjectId

Every document gets an `_id`. Unless one is supplied, MongoDB generates an ObjectId: a 12 byte
value that is unique across machines and happens to encode its own creation time.

It is not a number, and in JSON it appears as a 24 character hex string. Code that treats it
as a plain string mostly works, but a malformed value passed to a query throws a cast error
rather than simply matching nothing. That distinction becomes an API detail later: a
well-formed id that matches nothing is a 404, while a malformed id is a 400.

## Talking to it

Three ways, all doing the same thing underneath:

- **mongosh**, the shell. Good for a quick look or a one-off fix.
- **Compass**, the GUI. Good for browsing data and seeing what actually got written.
- **A driver or ODM in code**, which is how an application does it.

Being able to open Compass and confirm a document really is there settles a lot of "is my code
broken or is my query wrong" questions.

## Useful mongosh commands

```
show dbs                  list databases
use myapp                 switch to one, creating it lazily
show collections          list collections
db.students.find()        read everything in a collection
db.students.countDocuments()
db.students.drop()        remove the collection
```

## Running it locally

The server process is `mongod`, and it listens on port 27017 by default. Check it is up:

```
mongosh --eval "db.runCommand({ping:1})"
```

A response containing `ok: 1` means the server is running and reachable. A connection error
means `mongod` is not started, which is a different problem from anything in the application
code.
