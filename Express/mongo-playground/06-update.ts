import { students } from "./db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "./db/client.ts";

await connectToDatabase();

const target = await students.findOne({ name: "Priya Thapa" });

if (!target) {
  console.log("Run 00-seed.ts first");
  await disconnectFromDatabase();
  process.exit(0);
}

// $set changes the listed fields and leaves the rest alone. The operator is
// required: passing a bare object throws.
const updated = await students.updateOne({ _id: target._id }, { $set: { role: "Fullstack" } });
console.log(
  "updateOne       :",
  updated.matchedCount,
  "matched,",
  updated.modifiedCount,
  "changed"
);
console.log("value now       :", (await students.findOne({ _id: target._id }))?.role);

// findOneAndUpdate returns the document. returnDocument decides whether that
// is the version from before or after the change. "before" is the default.
const before = await students.findOneAndUpdate({ _id: target._id }, { $set: { role: "Backend" } });
console.log("returned (default):", before?.role, "<- the old value");

const after = await students.findOneAndUpdate(
  { _id: target._id },
  { $set: { role: "Frontend" } },
  { returnDocument: "after" }
);
console.log("returnDocument after:", after?.role);

// updateMany changes every match.
const many = await students.updateMany({ role: "QA" }, { $set: { role: "Quality" } });
console.log("updateMany      :", many.matchedCount, "matched,", many.modifiedCount, "changed");

// matchedCount and modifiedCount differ when the value was already correct.
const again = await students.updateMany({ role: "Quality" }, { $set: { role: "Quality" } });
console.log("no-op update    :", again.matchedCount, "matched,", again.modifiedCount, "changed");

// upsert inserts when nothing matched.
const upserted = await students.updateOne(
  { name: "test" },
  { $set: { role: "Intern", avatar: "https://i.pravatar.cc/150?img=60" } },
  { upsert: true }
);
console.log("upsert          :", upserted.upsertedCount, "inserted");

await disconnectFromDatabase();
