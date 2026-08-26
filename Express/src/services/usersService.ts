import { RoleModel, UserModel } from "../models/index.ts";
import type { Role } from "../models/Role.ts";
import { BadRequest } from "../types/httpError.ts";
import type { UpdateUserInput } from "../validation/userManagementSchemas.ts";

export function listUsers() {
  return UserModel.find().populate<{ role: Role[] }>("role");
}

export function findUserById(id: string) {
  return UserModel.findById(id).populate<{ role: Role[] }>("role");
}

export async function updateUser(id: string, changes: UpdateUserInput) {
  const { role: roleNames, ...rest } = changes;
  const update: Record<string, unknown> = { ...rest };

  if (roleNames) {
    const roles = await RoleModel.find({ name: { $in: roleNames } });

    if (roles.length !== roleNames.length) {
      throw new BadRequest("One or more roles were not found");
    }

    update.role = roles.map((role) => role.id);
  }

  return UserModel.findByIdAndUpdate(id, update, {
    returnDocument: "after",
    runValidators: true,
  }).populate<{ role: Role[] }>("role");
}

export function deleteUser(id: string) {
  return UserModel.findByIdAndDelete(id);
}
