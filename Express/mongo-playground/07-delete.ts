import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

console.log("before          :", await students.countDocuments());

// deleteOne reports how many it removed rather than what it removed.
const removed = await students.deleteOne({ name: "Rohan KC" });
console.log("deleteOne       :", removed.deletedCount, "removed");

// Deleting something that is not there is not an error. deletedCount is 0,
// which is how an API knows to answer 404.
const missing = await students.deleteOne({ name: "Nobody At All" });
console.log("no match        :", missing.deletedCount, "removed");

// findOneAndDelete hands back the document it removed, useful when the
// response should include what was deleted.
const doc = await students.findOneAndDelete({ role: "Backend" });
console.log("findOneAndDelete:", doc?.name);

// deleteMany takes a filter and removes every match.
const bulk = await students.deleteMany({ role: "Frontend" });
console.log("deleteMany      :", bulk.deletedCount, "removed");

console.log("after           :", await students.countDocuments());
console.log("run 00-seed.ts --force to restore the data");

await disconnectFromDatabase();
