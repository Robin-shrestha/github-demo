import { db } from "./client.ts";
import type { Student } from "./studentTypes.ts";

export const students = db.collection<Student>("students");
