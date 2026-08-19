import { UserModel } from "../models/index.ts";
import type { UserInput } from "../models/User.ts";

export function createUser(input: UserInput) {
  return UserModel.create(input);
}
