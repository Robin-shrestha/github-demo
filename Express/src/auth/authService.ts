import bcrypt from "bcryptjs";
import { RoleModel, UserModel } from "../models/index.ts";
import type { Role } from "../models/Role.ts";
import type { SignupInput } from "./authSchemas.ts";
import type { AccessTokenClaims } from "./tokens.ts";

const SALT_ROUNDS = 10;
const DEFAULT_ROLE_NAME = "student";

export type CreateUserInput = SignupInput & {
  profilePic: string;
  idDocuments?: string[];
};

export async function createUser(input: CreateUserInput, roleName = DEFAULT_ROLE_NAME) {
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);
  const role = await RoleModel.findOne({ name: roleName });

  if (!role) {
    throw new Error(`No "${roleName}" role found. Seed the Role collection first.`);
  }

  return UserModel.create({ ...input, password, role: [role.id] });
}

export function resolveClaims(roles: Role[]): AccessTokenClaims {
  return {
    roles: roles.map((role) => role.name),
    permissions: [...new Set(roles.flatMap((role) => role.permissions))],
  };
}
