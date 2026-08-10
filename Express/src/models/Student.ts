import { model, Schema, type InferSchemaType } from "mongoose";

export const ROLES = ["Frontend", "Backend", "Fullstack", "QA", "DevOps"];

const studentSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, enum: ROLES },
    avatar: { type: String, default: "https://i.pravatar.cc/150" },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
  },
  { timestamps: true }
);

export type Student = InferSchemaType<typeof studentSchema>;

export type StudentInput = Omit<Student, "createdAt" | "updatedAt" | "courses">;

export const StudentModel = model("Student", studentSchema);
