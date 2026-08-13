import { model, Schema, type InferSchemaType } from "mongoose";
import { toJSONOptions } from "./schemaOptions.ts";

const teacherSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    department: { type: String, required: true, trim: true },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

// Mongoose can declare the reverse relationship on the schema as a virtual field
teacherSchema.virtual("courses", {
  ref: "Course",
  localField: "_id",
  foreignField: "teacher",
});

export type Teacher = InferSchemaType<typeof teacherSchema>;

export const TeacherModel = model("Teacher", teacherSchema);
