import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

// A projection picks which fields come back. 1 includes, 0 excludes.
const namesOnly = await students
  .find({}, { projection: { name: 1 } })
  .limit(1)
  .toArray();
console.log("projection name :", JSON.stringify(namesOnly[0]));

// _id is the one field included unless explicitly turned off.
const withoutId = await students
  .find({}, { projection: { name: 1, role: 1, _id: 0 } })
  .limit(1)
  .toArray();
console.log("without _id     :", JSON.stringify(withoutId[0]));

// sort: 1 ascending, -1 descending. A string field sorts alphabetically.
const sorted = await students.find().sort({ name: 1 }).limit(3).toArray();
console.log("first 3 by name :", sorted.map((s) => s.name).join(", "));

const reversed = await students.find().sort({ name: -1 }).limit(3).toArray();
console.log("last 3 by name  :", reversed.map((s) => s.name).join(", "));

// limit caps how many come back, skip jumps past some. Together they page.
const page1 = await students.find().sort({ name: 1 }).limit(5).toArray();
const page2 = await students.find().sort({ name: 1 }).skip(5).limit(5).toArray();
console.log("page 1          :", page1.map((s) => s.name).join(", "));
console.log("page 2          :", page2.map((s) => s.name).join(", "));

// Chaining builds up one query on the cursor. Nothing is sent until toArray.
const combined = await students
  .find({ role: { $ne: "Backend" } }, { projection: { name: 1, role: 1, _id: 0 } })
  .sort({ name: 1 })
  .limit(3)
  .toArray();
console.log("combined        :", JSON.stringify(combined));

// countDocuments counts without transferring the documents themselves.
console.log("total           :", await students.countDocuments());
console.log("backend count   :", await students.countDocuments({ role: "Backend" }));

// using distinct with aggregation (v1 doesn't have distinct integrated)
// const roles = await students.aggregate([{ $group: { _id: "$role" } }]).toArray();
// console.log("🚀 ~ roles:", roles);

// distinct pulls the unique values of one field. (not in V1)
// console.log("distinct roles  :", await students.distinct("role"));

await disconnectFromDatabase();
