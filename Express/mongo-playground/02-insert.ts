import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

const one = await students.insertOne({
  name: "Tiger woods",
  role: "Fullstack",
  avatar: "https://i.pravatar.cc/150?img=8",
});

console.log("insertOne      :", one.acknowledged, String(one.insertedId));

// insertMany sends several documents in one round trip.
const many = await students.insertMany([
  { name: "Anjali Karki", role: "Frontend", avatar: "https://i.pravatar.cc/150?img=9" },
  { name: "Suman Lama", role: "Backend", avatar: "https://i.pravatar.cc/150?img=11" },
]);

console.log("insertMany     :", many.insertedCount, "inserted");

// There is no schema, so nothing stops a document of a different shape from
// being written. This is the trade-off for the flexibility.
await students.insertOne({ name: "No Role" } as never);
console.log("odd shape      : written without complaint, nothing validated it");

console.log("total          :", await students.countDocuments());

await disconnectFromDatabase();
