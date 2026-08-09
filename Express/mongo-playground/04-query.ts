import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

const count = (filter: object) => students.countDocuments(filter);

// Plain equality.
console.log("role = Backend      :", await count({ role: "Backend" }));

// $in matches any value in a list.
console.log("role in [FE, FS]    :", await count({ role: { $in: ["Frontend", "Fullstack"] } }));

// $ne is not equal.
console.log("role != Backend     :", await count({ role: { $ne: "Backend" } }));

// Regex for partial text. ^ anchors to the start.
console.log("name starts with S  :", await count({ name: /^S/ }));

// The i flag makes it case insensitive.
console.log("name contains 'ra'  :", await count({ name: /ra/i }));

// Several keys in one object means AND.
console.log("Backend AND ^P      :", await count({ role: "Backend", name: /^P/ }));

// $or takes an array of whole filters.
console.log("Fullstack OR ^A     :", await count({ $or: [{ role: "Fullstack" }, { name: /^A/ }] }));

// $exists asks whether the field is present at all, which matters in a
// database where documents in one collection can have different shapes.
console.log("has avatar          :", await count({ avatar: { $exists: true } }));

// A quick look at who actually matched.
const sample = await students.find({ role: "DevOps" }).limit(3).toArray();
console.log("sample DevOps       :", sample.map((s) => s.name).join(", "));

await disconnectFromDatabase();
