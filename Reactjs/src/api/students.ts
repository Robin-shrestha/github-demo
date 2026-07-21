import { v4 as uuid } from "uuid";
import { z } from "zod";
import type { Student } from "../types/types";
import { STUDENTS_ENDPOINT } from "./endpoints";

const studentApiSchema = z.object({
  id: z.union([z.number(), z.string()]),
  name: z.string(),
  role: z.string(),
  avatar: z.string(),
  email: z.string().optional(),
  bio: z.string().optional(),
  experienceYears: z.number().optional(),
  hobbies: z.array(z.string()).optional(),
});

type RawStudent = z.infer<typeof studentApiSchema>;

// Thrown when the "server" rejects a new student because the email is taken.
// A form can catch this and map it onto the email field.
export class DuplicateEmailError extends Error {
  constructor() {
    super("A student with this email already exists");
    this.name = "DuplicateEmailError";
  }
}

function toStudent(raw: RawStudent): Student {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    avatar: raw.avatar,
    email: raw.email,
    bio: raw.bio,
    experienceYears: raw.experienceYears,
    hobbies: raw.hobbies,
  };
}

// All fetch calls to /students live here. These are plain functions, not
// hooks — they just do I/O and throw on failure; hooks/components decide
// how to handle loading/error state.

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(STUDENTS_ENDPOINT);
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const parsed = z.array(studentApiSchema).safeParse(await response.json());
  if (!parsed.success) {
    throw new Error("Unexpected response shape from GET /students");
  }
  return parsed.data.map(toStudent);
}

export async function getStudentById(id: string): Promise<Student | null> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`);
  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const parsed = studentApiSchema.safeParse(await response.json());
  if (!parsed.success) {
    throw new Error(`Unexpected response shape from GET /students/${id}`);
  }
  return toStudent(parsed.data);
}

export async function addStudent(newStudent: Omit<Student, "id">): Promise<Student> {
  // Stand-in for a server-side uniqueness rule: reject a duplicate email.
  const existing = await getStudents();
  const clash = existing.some(
    (s) => s.email && s.email.toLowerCase() === newStudent.email?.toLowerCase()
  );
  if (clash) {
    throw new DuplicateEmailError();
  }

  const response = await fetch(STUDENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: newStudent.name,
      role: newStudent.role,
      avatar: newStudent.avatar,
      email: newStudent.email,
      bio: newStudent.bio,
      experienceYears: newStudent.experienceYears,
      hobbies: newStudent.hobbies,
      id: uuid(),
    }),
  });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
  const raw = (await response.json()) as RawStudent;
  return toStudent(raw);
}

export async function deleteStudent(id: number | string): Promise<void> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });
  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }
}
