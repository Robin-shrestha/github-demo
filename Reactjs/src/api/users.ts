import type { User } from "../types/types";
import { USERS_ENDPOINT } from "./endpoints";
import { authHeader, failOnError } from "./httpClient";
import { userApiSchema, toUser } from "./userMapper";

export async function getCurrentUser(token: string): Promise<User> {
  const response = await fetch(`${USERS_ENDPOINT}/me`, {
    headers: authHeader(token),
  });

  await failOnError(response);

  const parsed = userApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from GET /users/me");
  }

  return toUser(parsed.data);
}
