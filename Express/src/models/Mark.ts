import { model, Schema, type InferSchemaType } from "mongoose";
import { toJSONOptions } from "./schemaOptions.ts";

export const ASSESSMENTS = ["quiz", "assignment", "midterm", "final"];

const markSchema = new Schema(
  {
    student: { type: Schema.Types.ObjectId, ref: "Student", required: true },
    course: { type: Schema.Types.ObjectId, ref: "Course", required: true },

    assessment: { type: String, required: true, enum: ASSESSMENTS },
    score: { type: Number, required: true, min: 0 },
    maxScore: { type: Number, required: true, min: 1 },
    gradedAt: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: toJSONOptions }
);

markSchema.index({ student: 1, course: 1, assessment: 1 }, { unique: true });

export type Mark = InferSchemaType<typeof markSchema>;

export const MarkModel = model("Mark", markSchema);
