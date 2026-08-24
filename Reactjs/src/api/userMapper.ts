import { z } from "zod";
import type { User } from "../types/types";
import { resolveFileUrl } from "./httpClient";

export const userApiSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  dateOfBirth: z.string().optional(),
  address: z.string().optional(),
  profilePic: z.string(),
  idDocuments: z.array(z.string()).optional(),
});

export type RawUser = z.infer<typeof userApiSchema>;

export function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    username: raw.username,
    email: raw.email,
    dateOfBirth: raw.dateOfBirth ?? undefined,
    address: raw.address,
    profilePic: resolveFileUrl(raw.profilePic),
    idDocuments: raw.idDocuments?.map(resolveFileUrl),
  };
}
