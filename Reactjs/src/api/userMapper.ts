import { z } from "zod";
import type { User } from "../types/types";
import { resolveFileUrl } from "./httpClient";

const roleApiSchema = z.object({
  name: z.string(),
  permissions: z.array(z.string()).optional(),
});

export const userApiSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  email: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
  profilePic: z.string(),
  idDocuments: z.array(z.string()).optional(),
  role: z.array(roleApiSchema).optional(),
});

export type RawUser = z.infer<typeof userApiSchema>;

export function toUser(raw: RawUser): User {
  const roleList = raw.role ?? [];

  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    username: raw.username,
    email: raw.email,
    dateOfBirth: raw.dateOfBirth,
    address: raw.address,
    profilePic: resolveFileUrl(raw.profilePic),
    idDocuments: raw.idDocuments?.map(resolveFileUrl),
    roles: roleList.map((role) => role.name),
    permissions: [...new Set(roleList.flatMap((role) => role.permissions ?? []))],
  };
}
