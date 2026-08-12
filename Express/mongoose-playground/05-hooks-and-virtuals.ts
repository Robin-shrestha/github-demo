import { connectWithMongoose, disconnectMongoose } from "../src/config/mongoose.ts";
import { UserModel } from "./models/user.ts";

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

await connectWithMongoose();

try {
  const user = await UserModel.create({
    name: "Priya Thapa",
    email: "Priya.Thapa@LF.edu  ",
    age: 24,
    address: { street: "12 Main St", city: "Kathmandu", postcode: "44600" },
    hobbies: ["reading", "cycling"],
  });

  console.log("email stored :", JSON.stringify(user.email));
  console.log("created      :", user.createdAt?.toISOString(), user.updatedAt?.toISOString());

  await wait(1100);

  user.hobbies.push("cooking");
  await user.save();
  console.log("saved        :", user.createdAt?.toISOString(), user.updatedAt?.toISOString());

  await wait(1100);

  const moved = await UserModel.findByIdAndUpdate(
    user._id,
    { "address.city": "Pokhara" },
    { new: true }
  );
  console.log("updated      :", moved?.createdAt?.toISOString(), moved?.updatedAt?.toISOString());

  console.log("\nnested city  :", moved?.address?.city);
  console.log("hobbies      :", moved?.hobbies.join(", "));
  console.log("isAdult      :", moved?.get("isAdult"));
  console.log("fullAddress  :", moved?.get("fullAddress"));
  console.log("stored       :", Object.keys(moved?.toObject() ?? {}).includes("fullAddress"));
  console.log("queryable    :", await UserModel.countDocuments({ isAdult: true }));
} finally {
  await disconnectMongoose();
}
