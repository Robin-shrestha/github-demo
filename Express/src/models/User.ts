import { model, Schema, type InferSchemaType } from "mongoose";
import { toJSONOptions } from "./schemaOptions.ts";

const userSchema = new Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, select: false },
    tokenVersion: { type: Number, default: 0 },
    dateOfBirth: { type: Date },
    address: { type: String, trim: true },
    profilePic: { type: String },
    idDocuments: { type: [String], default: undefined },
    googleId: { type: String },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

export type User = InferSchemaType<typeof userSchema>;

export type UserInput = Omit<User, "createdAt" | "updatedAt">;

export const UserModel = model("User", userSchema);
