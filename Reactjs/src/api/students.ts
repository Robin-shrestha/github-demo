import { z } from "zod";
import type { Student } from "../types/types";
import { STUDENTS_ENDPOINT } from "./endpoints";
import { failOnError, resolveFileUrl } from "./httpClient";

const studentApiSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.string(),
  email: z.string(),
  avatar: z.string(),
  bio: z.string().optional(),
  experienceYears: z.number().optional(),
  hobbies: z.array(z.string()).optional(),
});

type RawStudent = z.infer<typeof studentApiSchema>;

function toStudent(raw: RawStudent): Student {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    email: raw.email,
    avatar: resolveFileUrl(raw.avatar),
    bio: raw.bio,
    experienceYears: raw.experienceYears,
    hobbies: raw.hobbies,
  };
}

export async function getStudents(): Promise<Student[]> {
  const response = await fetch(STUDENTS_ENDPOINT);
  await failOnError(response);

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

  await failOnError(response);

  const parsed = studentApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error(`Unexpected response shape from GET /students/${id}`);
  }

  return toStudent(parsed.data);
}

export async function addStudent(newStudent: Omit<Student, "id">): Promise<Student> {
  const response = await fetch(STUDENTS_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newStudent),
  });

  await failOnError(response);

  const parsed = studentApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from POST /students");
  }

  return toStudent(parsed.data);
}

export async function patchStudent(
  id: string,
  changes: Partial<Omit<Student, "id">>
): Promise<Student> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
  });

  await failOnError(response);

  const parsed = studentApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error(`Unexpected response shape from PATCH /students/${id}`);
  }

  return toStudent(parsed.data);
}

export async function deleteStudent(id: string): Promise<void> {
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}`, { method: "DELETE" });

  // 204 has no body, so nothing is parsed here.
  await failOnError(response);
}

export async function uploadStudentPhoto(id: string, file: File): Promise<Student> {
  const formData = new FormData();
  formData.append("photo", file);

  // No Content-Type header here. The browser sets multipart/form-data with
  // the correct boundary itself; setting it by hand breaks the request.
  const response = await fetch(`${STUDENTS_ENDPOINT}/${id}/photo`, {
    method: "POST",
    body: formData,
  });

  await failOnError(response);

  const parsed = studentApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error(`Unexpected response shape from POST /students/${id}/photo`);
  }

  return toStudent(parsed.data);
}
