import { model, Schema, type InferSchemaType } from "mongoose";
import { toJSONOptions } from "./schemaOptions.ts";

export const ROLES = ["Frontend", "Backend", "Fullstack", "QA", "DevOps"] as const;

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: [...ROLES] },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: "https://i.pravatar.cc/150" },
    bio: { type: String, trim: true, maxlength: 500 },
    experienceYears: { type: Number, min: 0, max: 60 },
    hobbies: { type: [String], default: undefined },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true, toJSON: toJSONOptions }
);

export type StudentRole = (typeof ROLES)[number];

export type Student = InferSchemaType<typeof studentSchema>;

export type StudentInput = Omit<Student, "createdAt" | "updatedAt" | "courses">;

export const StudentModel = model("Student", studentSchema);
