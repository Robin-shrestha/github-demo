import { ObjectId } from "mongodb";
import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

// find() returns a cursor, not an array. Nothing is fetched until it is
// iterated or collected with toArray().
const cursor = students.find();
console.log("find() returns :", cursor.constructor.name);

const all = await cursor.toArray();
console.log("toArray()      :", all.length, "documents");

// An object is a filter. Keys are fields, values are what to match.
const backend = await students.find({ role: "Backend" }).toArray();
console.log("find({role})   :", backend.length, "backend students");

// findOne returns a single document or null, never an array.
const first = await students.findOne({ role: "Frontend" });
console.log("findOne()      :", first?.name);

// There is no findById. The id is just another field, and it has to be a
// real ObjectId rather than the string that came out of JSON.
if (first) {
  const byId = await students.findOne({ _id: first._id });
  console.log("by _id         :", byId?.name);

  const fromString = await students.findOne({ _id: new ObjectId(String(first._id)) });
  console.log("from string id :", fromString?.name);
}

// Nothing matching is not an error. find gives [], findOne gives null.
console.log("no match, find :", await students.find({ role: "Astronaut" }).toArray());
console.log("no match, one  :", await students.findOne({ role: "Astronaut" }));

// A malformed id is an error, unlike an id that is simply absent.
try {
  new ObjectId("not-a-real-id");
} catch (err) {
  console.log("bad id         :", (err as Error).name);
}

await disconnectFromDatabase();
