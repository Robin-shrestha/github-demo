import { students } from "../mongo-playground/db/students.ts";
import { connectToDatabase, disconnectFromDatabase } from "../mongo-playground/db/client.ts";
import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { StudentModel } from "../src/models/Student.ts";

await connectToDatabase();
await connectWithMongoose();

const junk = await students.insertOne({ nmae: "Typo Thapa" } as never);
console.log("driver accepted   :", junk.acknowledged);
await students.deleteOne({ _id: junk.insertedId });

try {
  await StudentModel.create({ nmae: "Typo Thapa" } as never);
} catch (err) {
  console.log("mongoose rejected :", (err as Error).message);
}

try {
  await StudentModel.create({ name: "Wrong Role", role: "Designer" } as never);
} catch (err) {
  console.log("bad role rejected :", (err as Error).message);
}

const saved = await StudentModel.create({
  name: "Anjali Karki",
  role: "Frontend",
  nickname: "AK",
} as never);
console.log("🚀 ~ saved:", saved);

console.log("unknown key kept  :", "nickname" in saved.toObject());

console.log("avatar default    :", saved.avatar);
console.log("createdAt set     :", saved.get("createdAt") instanceof Date);

await StudentModel.deleteOne({ _id: saved._id });

await disconnectMongoose();
await disconnectFromDatabase();
