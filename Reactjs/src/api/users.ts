import { z } from "zod";
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

export async function listUsers(token: string): Promise<User[]> {
  const response = await fetch(USERS_ENDPOINT, { headers: authHeader(token) });

  await failOnError(response);

  const parsed = z.array(userApiSchema).safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from GET /users");
  }

  return parsed.data.map(toUser);
}

export async function updateUserRoles(id: string, roles: string[], token: string): Promise<User> {
  const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json", ...authHeader(token) },
    body: JSON.stringify({ role: roles }),
  });

  await failOnError(response);

  const parsed = userApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error(`Unexpected response shape from PATCH /users/${id}`);
  }

  return toUser(parsed.data);
}

export async function deleteUser(id: string, token: string): Promise<void> {
  const response = await fetch(`${USERS_ENDPOINT}/${id}`, {
    method: "DELETE",
    headers: authHeader(token),
  });

  await failOnError(response);
}
