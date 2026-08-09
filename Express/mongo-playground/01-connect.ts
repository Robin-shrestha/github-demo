import { client, db, connectToDatabase, disconnectFromDatabase } from "./db/client.ts";
import { envConstants } from "../src/constants/env.ts";

await connectToDatabase();

console.log("uri            :", envConstants.MONGO_URI.replace(/\/\/.*@/, "//<credentials>@"));
console.log("database       :", db.databaseName);

const collections = await db.listCollections().toArray();
console.log("collections    :", collections.map((c) => c.name).join(", ") || "(none yet)");

// A database is not created until something is written to it, so a brand new
// name will not appear in this list.
const admin = await client.db("admin").command({ ping: 1 });
console.log("ping           :", admin.ok === 1 ? "ok" : "failed");

await disconnectFromDatabase();
