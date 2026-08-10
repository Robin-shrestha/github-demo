import { connectToDatabase, db, disconnectFromDatabase } from "./db/client.ts";
import { COLLECTION_NAMES, validators } from "./db/validators.ts";
import { describeValidationError } from "./db/validationError.ts";

const force = process.argv.includes("--force");

const createCollections = async (): Promise<void> => {
  await connectToDatabase();

  try {
    const existing = (await db.listCollections().toArray()).map((c) => c.name);
    const clashCollections = COLLECTION_NAMES.filter((name) => existing.includes(name));

    if (clashCollections.length > 0 && !force) {
      console.log(
        `Already exist: ${clashCollections.join(", ")}. Run with --force to drop and recreate.`
      );
      return;
    }

    for (const name of clashCollections) {
      await db.collection(name).drop();
      console.log(`dropped   ${name}`);
    }

    for (const name of COLLECTION_NAMES) {
      await db.createCollection(name, {
        validator: { $jsonSchema: validators[name] },
        validationLevel: "strict",
        validationAction: "error",
      });

      console.log(`created   ${name}`);
    }

    // Uniqueness is an index, not a validation rule, so it is created separately.
    await db.collection("teachers").createIndex({ email: 1 }, { unique: true });
    await db.collection("courses").createIndex({ code: 1 }, { unique: true });
    await db
      .collection("marks")
      .createIndex({ student: 1, course: 1, assessment: 1 }, { unique: true });

    console.log("indexes   created");

    try {
      await db.collection("teachers").insertOne({ name: "No Email" } as never);
    } catch (err) {
      console.log("rejected  missing required field:\n", describeValidationError(err));
    }

    try {
      await db.collection("students").insertOne({ name: "Wrong Role", role: "Designer" } as never);
    } catch (err) {
      console.log("rejected  value outside enum:\n", describeValidationError(err));
    }
  } finally {
    await disconnectFromDatabase();
  }
};

await createCollections();
