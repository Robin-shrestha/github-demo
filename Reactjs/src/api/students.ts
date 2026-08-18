import { z } from "zod";
import type { Student } from "../types/types";
import { API_BASE_URL, STUDENTS_ENDPOINT } from "./endpoints";

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

const errorSchema = z.object({
  error: z.string(),
  details: z.array(z.object({ field: z.string(), message: z.string() })).optional(),
});

type RawStudent = z.infer<typeof studentApiSchema>;

// Carries the per field messages the API sends with a 400 so a form can put
// each one next to the input that caused it.
export class ApiError extends Error {
  status: number;
  fields: Record<string, string>;

  constructor(status: number, message: string, fields: Record<string, string> = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fields = fields;
  }
}

// fetch only rejects on a network failure, so a 400 or 500 arrives here as a
// perfectly normal response and has to be checked by hand.
async function failOnError(response: Response): Promise<void> {
  if (response.ok) {
    return;
  }

  const parsed = errorSchema.safeParse(await response.json().catch(() => null));

  if (!parsed.success) {
    throw new ApiError(response.status, `Request failed with status ${response.status}`);
  }

  const fields = Object.fromEntries(
    (parsed.data.details ?? []).map((detail) => [detail.field, detail.message])
  );

  throw new ApiError(response.status, parsed.data.error, fields);
}

function resolveAvatarUrl(avatar: string): string {
  return avatar.startsWith("http") ? avatar : `${API_BASE_URL}${avatar}`;
}

function toStudent(raw: RawStudent): Student {
  return {
    id: raw.id,
    name: raw.name,
    role: raw.role,
    email: raw.email,
    avatar: resolveAvatarUrl(raw.avatar),
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
