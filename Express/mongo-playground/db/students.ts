import { db } from "./client.ts";
import type { Student } from "../../src/types/studentTypes.ts";

export const students = db.collection<Student>("students");
