import { model, Schema, type InferSchemaType } from "mongoose";

const courseSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    credits: { type: Number, required: true, min: 1, max: 6 },
    isActive: { type: Boolean, default: true },
    teacher: { type: Schema.Types.ObjectId, ref: "Teacher", required: true },
  },
  { timestamps: true }
);

export type Course = InferSchemaType<typeof courseSchema>;

export const CourseModel = model("Course", courseSchema);
