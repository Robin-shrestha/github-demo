import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { UserModel } from "./models/user.ts";

function report(label: string, err: unknown): void {
  if (err instanceof Error && err.name === "ValidationError") {
    const fields = (err as unknown as { errors: Record<string, { message: string }> }).errors;

    for (const [path, detail] of Object.entries(fields)) {
      console.log(`${label.padEnd(15)} ${path}: ${detail.message}`);
    }

    return;
  }

  console.log(label, err);
}

const valid = {
  name: "Priya Thapa",
  email: "priya.thapa@lf.edu",
  age: 24,
  address: { street: "12 Main St", city: "Kathmandu" },
  hobbies: ["reading", "cycling"],
};

await connectWithMongoose();

try {
  await UserModel.deleteMany({});

  const ok = await UserModel.create(valid);
  console.log("accepted       :", ok.name, ok.age);

  try {
    await UserModel.create({ ...valid, email: "priya" });
  } catch (err) {
    report("bad email", err);
  }

  try {
    await UserModel.create({ ...valid, age: 24.5 });
  } catch (err) {
    report("fractional age", err);
  }

  try {
    await UserModel.create({ ...valid, age: 9 });
  } catch (err) {
    report("under min", err);
  }

  try {
    await UserModel.create({ ...valid, hobbies: ["a", "b", "c", "d", "e", "f"] });
  } catch (err) {
    report("too many", err);
  }

  try {
    await UserModel.create({ ...valid, hobbies: ["reading", "reading"] });
  } catch (err) {
    report("repeated", err);
  }

  try {
    await UserModel.create({ ...valid, age: 15 });
  } catch (err) {
    report("minor, no guardian", err);
  }

  const minor = await UserModel.create({
    ...valid,
    age: 15,
    guardianEmail: "guardian@lf.edu",
  });
  console.log("minor accepted :", minor.age, minor.guardianEmail);

  try {
    await UserModel.create({ ...valid, email: "priya", age: 200, hobbies: ["x", "x"] });
  } catch (err) {
    report("three at once", err);
  }

  try {
    await UserModel.create({ ...valid, address: { city: "Kathmandu" } });
  } catch (err) {
    report("nested required", err);
  }

  const stale = await UserModel.findByIdAndUpdate(ok._id, { age: 200 }, { new: true });
  console.log("\nupdate without runValidators :", stale?.age);

  try {
    await UserModel.findByIdAndUpdate(ok._id, { age: 200 }, { runValidators: true });
  } catch (err) {
    report("with flag", err);
  }

  await UserModel.deleteMany({});
} finally {
  await disconnectMongoose();
}
