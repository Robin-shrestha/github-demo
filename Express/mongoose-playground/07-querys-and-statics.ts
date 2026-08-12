import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { UserModel } from "./models/user.ts";

await connectWithMongoose();

try {
  const users = await UserModel.create([
    { name: "Cr7 Ronaldo", email: "cr7@lf.edu", age: 40, hobbies: ["football"] },
    { name: "Leo Messi", email: "leo@lf.edu", age: 37, hobbies: ["football"] },
    {
      name: "Leo Junior",
      email: "leo.jr@lf.edu",
      age: 15,
      guardianEmail: "leo@lf.edu",
      hobbies: ["football"],
    },
  ]);
  console.log("🚀 ~ users:", users);

  const ids = users.map((item) => item.id);
  UserModel.sayHi();

  const one = await UserModel.getOneByName("cr7");
  console.log("static, one doc  :", one?.name);

  const named = await UserModel.find().getByName("leo");
  console.log("helper, by name  :", named.map((user) => user.name).join(", "));

  const adults = await UserModel.find().getByName("leo").getByAdultAgeLimit();
  console.log("helper, chained  :", adults.map((user) => user.name).join(", "));

  const oneAdult = await UserModel.findOne().getByAdultAgeLimit();
  console.log("helper on findOne:", oneAdult?.name);

  const deleted = await UserModel.deleteMany({ _id: { $in: ids } });
  console.log("🚀 ~ deleted:", deleted);
} catch (err) {
  console.error(err);
} finally {
  await disconnectMongoose();
}
