import { z } from "zod";
import { signupSchema } from "../auth/authSchemas.ts";

export const userIdSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, "not a valid id"),
});

export const createUserByAdminSchema = signupSchema.extend({
  role: z.string().trim().min(1).optional(),
});

export const updateUserSchema = z
  .object({
    firstName: z.string().trim().min(1),
    lastName: z.string().trim().min(1),
    email: z.string().trim().min(1).email("Enter a valid email address"),
    address: z.string().trim().min(1),
    role: z.array(z.string().trim().min(1)).min(1),
  })
  .partial()
  .refine((changes) => Object.keys(changes).length > 0, {
    error: "Nothing to update",
  });

export type CreateUserByAdminInput = z.infer<typeof createUserByAdminSchema>;
export type UpdateUserInput = z.infer<typeof updateUserSchema>;
