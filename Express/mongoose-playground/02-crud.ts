import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { StudentModel } from "../src/models/Student.ts";

await connectWithMongoose();

const created = await StudentModel.create({ name: "Bikash Rai", role: "Fullstack" });
console.log("created     :", String(created._id), created.name);

const backend = await StudentModel.find({ role: "Backend" }).limit(3);
console.log("found       :", backend.length, "backend students");

const one = await StudentModel.findById(created._id);
console.log("findById    :", one?.name);

const updated = await StudentModel.findByIdAndUpdate(
  created._id,
  { role: "asdad" },
  { returnDocument: "after", runValidators: true }
);
console.log("updated     :", updated);

await StudentModel.findByIdAndDelete(created._id);
console.log("deleted     :", (await StudentModel.findById(created._id)) === null);

console.log("total       :", await StudentModel.countDocuments());

await disconnectMongoose();
