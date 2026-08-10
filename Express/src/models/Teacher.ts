import { model, Schema, type InferSchemaType } from "mongoose";

const teacherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type Teacher = InferSchemaType<typeof teacherSchema>;

export const TeacherModel = model("Teacher", teacherSchema);
