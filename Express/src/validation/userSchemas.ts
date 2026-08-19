import { z } from "zod";

export const signupSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required"),
  lastName: z.string().trim().min(1, "Last name is required"),
  username: z
    .string()
    .trim()
    .min(3, "At least 3 characters")
    .regex(/^[a-zA-Z0-9_]+$/, "Letters, numbers and underscore only"),
  dateOfBirth: z.coerce.date({ error: "Date of birth is required" }),
  address: z.string().trim().min(1, "Address is required"),
});

export type SignupInput = z.infer<typeof signupSchema>;
