import bcrypt from "bcryptjs";
import { Role, RoleModel, UserModel } from "../models/index.ts";
import type { SignupInput } from "./authSchemas.ts";
import { Unauthorized } from "../types/httpError.ts";

const SALT_ROUNDS = 10;
const DEFAULT_ROLE_NAME = "student";

export type CreateUserInput = SignupInput & {
  profilePic: string;
  idDocuments?: string[];
};

export async function createUser(input: CreateUserInput) {
  console.log("🚀 ~ createUser ~ input:", input);
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);
  const defaultRole = await RoleModel.findOne({ name: DEFAULT_ROLE_NAME });
  const roles = await RoleModel.find();
  console.log("🚀 ~ createUser ~ roles:", roles);

  if (!defaultRole) {
    throw new Error(`No "${DEFAULT_ROLE_NAME}" role found. Seed the Role collection first.`);
  }

  return UserModel.create({ ...input, password, role: [defaultRole.id] });
}

export const userDataByUsername = async (username: string) => {
  const user = await UserModel.findOne({ username })
    .select("+password")
    .populate<{ role: Role[] }>("role")
    .lean();
  const roles = user?.role.map((item) => item.name);

  if (!user) {
    throw new Unauthorized("Invalid credentials");
  }
  return { ...user, role: roles, id: user._id.toString() };
};

export const userDataById = async (id: string) => {
  const user = await UserModel.findById(id).populate<{ role: Role[] }>("role").lean();
  const roles = user?.role.map((item) => item.name);

  if (!user) {
    throw new Unauthorized("Invalid credentials");
  }
  return { ...user, role: roles, id: user._id.toString() };
};
