import { InferSchemaType, model, Schema } from "mongoose";
import { toJSONOptions } from "./schemaOptions.ts";

export const roleSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    permissions: [{ type: String, required: true }],
  },
  { timestamps: true, toJSON: toJSONOptions }
);

export type Role = InferSchemaType<typeof roleSchema>;
export const RoleModel = model("Role", roleSchema);
