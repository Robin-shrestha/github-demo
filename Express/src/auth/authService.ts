import bcrypt from "bcryptjs";
import { UserModel } from "../models/index.ts";
import type { UserInput } from "../models/User.ts";

const SALT_ROUNDS = 10;

export async function createUser(input: UserInput) {
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);

  return UserModel.create({ ...input, password });
}
