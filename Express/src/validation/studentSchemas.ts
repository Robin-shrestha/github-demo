import { z } from "zod";
import { ROLES } from "../models/Student.ts";

export const createStudentSchema = z.object({
  name: z.string().trim().min(2).max(80),
  role: z.enum(ROLES),
  email: z.email(),
  avatar: z.url().optional(),
  bio: z.string().trim().max(500).optional(),
  experienceYears: z.number().int().min(0).max(60).optional(),
  hobbies: z.array(z.string().trim().min(1)).max(10).optional(),
});

// PUT reuses createStudentSchema: a replacement must carry the whole resource.
// PATCH accepts any subset, but not an empty object, which would mean nothing.
export const patchStudentSchema = createStudentSchema
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    error: "Nothing to update",
  });

export const studentIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "not a valid id"),
});

export const listStudentsQuerySchema = z.object({
  role: z.enum(ROLES).optional(),
  // Everything in a query string is a string, so ?page=2 arrives as "2".
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
});

export type CreateStudentInput = z.infer<typeof createStudentSchema>;
export type PatchStudentInput = z.infer<typeof patchStudentSchema>;
export type ListStudentsQuery = z.infer<typeof listStudentsQuerySchema>;
