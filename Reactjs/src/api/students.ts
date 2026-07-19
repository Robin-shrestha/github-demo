import { v4 as uuid } from "uuid";
import type { Student } from "../types/types";
import { STUDENTS_ENDPOINT } from "./endpoints";

interface RawStudent {
  id: number;
  name: string;
  role: string;
  avatar: string;
}

function toStudent(raw: RawStudent): Student {
  return { id: raw.id, name: raw.name, role: raw.role, avatar: raw.avatar };
}

// All fetch calls to /students live here. These are plain functions, not
// hooks — they just do I/O and throw on failure; hooks/components decide
// how to handle loading/error state.

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(STUDENTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const data = (await response.json()) as RawStudent[];
  return data.map(toStudent);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const raw = (await response.json()) as RawStudent;
  return toStudent(raw);
}

export async function addStudent(newStudent: Omit<Student, "id">): Promise<Student> {
  const response = await fetch(STUDENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newStudent.name,
      role: newStudent.role,
      avatar: newStudent.avatar,
      id: uuid(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const raw = (await response.json()) as RawStudent;
  return toStudent(raw);
}

export async function deleteStudent(id: number): Promise<void> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
