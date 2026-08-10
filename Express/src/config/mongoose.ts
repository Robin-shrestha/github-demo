import mongoose from "mongoose";
import { envConstants } from "../constants/env.ts";

export async function connectWithMongoose(): Promise<void> {
  await mongoose.connect(envConstants.MONGO_URI, {
    dbName: envConstants.MONGO_DB_NAME,
  });

  console.log(`Mongoose connected to ${mongoose.connection.name}`);
}

export async function disconnectMongoose(): Promise<void> {
  await mongoose.disconnect();
  console.log("Mongoose disconnected");
}

// just like mongoDb we have connection event listeners where we can perform actions
// mongoose.connection.on("connecting", () => console.log("connecting"));
// mongoose.connection.on("connected", () => console.log("connected"));
// mongoose.connection.on("open", () => console.log("open"));
// mongoose.connection.on("disconnected", () => console.log("disconnected"));
// mongoose.connection.on("disconnecting", () => console.log("disconnecting"));
// mongoose.connection.on("close", () => console.log("close"));
