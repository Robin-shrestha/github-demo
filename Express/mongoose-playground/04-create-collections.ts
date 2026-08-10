import type { Model } from "mongoose";
import { validators } from "../mongo-playground/db/validators.ts";
import { describeValidationError } from "../mongo-playground/db/validationError.ts";
import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { CourseModel } from "../src/models/Course.ts";
import { MarkModel } from "../src/models/Mark.ts";
import { StudentModel } from "../src/models/Student.ts";
import { TeacherModel } from "../src/models/Teacher.ts";

const force = process.argv.includes("--force");

const models: Model<never>[] = [TeacherModel, CourseModel, StudentModel, MarkModel] as never;

const createCollections = async (): Promise<void> => {
  await connectWithMongoose();

  try {
    const db = StudentModel.db.db;

    if (!db) {
      throw new Error("No database handle. Is the connection open?");
    }

    // autoCreate is on by default, so importing the models has already asked
    // Mongoose to create these collections, without any validator. Waiting for
    // that to finish first makes the drop below meaningful.
    await Promise.all(models.map((model) => model.init()));

    const existing = (await db.listCollections().toArray()).map((c) => c.name);
    const clash = models.filter((m) => existing.includes(m.collection.collectionName));

    if (clash.length > 0 && !force) {
      const names = clash.map((m) => m.collection.collectionName).join(", ");
      console.log(`Already exist: ${names}. Run with --force to drop and recreate.`);
      return;
    }

    for (const model of clash) {
      await model.collection.drop();
      console.log(`dropped   ${model.collection.collectionName}`);
    }

    for (const model of models) {
      const name = model.collection.collectionName;

      await model.createCollection();

      // Model.createCollection ignores its options when the collection already
      // exists, and swallows the error, so the validator is applied with collMod.
      // collMod works either way, which is also how validation gets added to a
      // collection that is already full of data.
      await db.command({
        collMod: name,
        validator: { $jsonSchema: validators[name] },
        validationLevel: "strict",
        validationAction: "error",
      });

      await model.syncIndexes();

      console.log(`created   ${name}`);
    }

    try {
      await StudentModel.collection.insertOne({ name: "Wrong Role", role: "Designer" } as never);
      console.log("\nnot rejected: no validator is in place");
    } catch (err) {
      console.log("\nrejected by the server:\n", describeValidationError(err));
    }
  } catch (err) {
    console.log("Error:", err);
  } finally {
    await disconnectMongoose();
  }
};

await createCollections();
