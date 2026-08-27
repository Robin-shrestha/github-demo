import { z } from "zod";
import type { User } from "../types/types";
import type { SignupFormValues } from "../components/SignupForm";
import { AUTH_ENDPOINT } from "../api/endpoints";
import { authHeader, failOnError } from "../api/httpClient";
import { userApiSchema, toUser } from "../api/userMapper";

export async function signupUser(values: SignupFormValues): Promise<User> {
  const formData = new FormData();
  formData.append("firstName", values.firstName);
  formData.append("lastName", values.lastName);
  formData.append("username", values.username);
  formData.append("email", values.email);
  formData.append("password", values.password);
  formData.append("dateOfBirth", values.dateOfBirth);
  formData.append("address", values.address);
  formData.append("profilePic", values.profilePic);

  values.idDocuments?.forEach((file) => formData.append("idDocuments", file));

  const response = await fetch(`${AUTH_ENDPOINT}/signup`, {
    method: "POST",
    body: formData,
  });

  await failOnError(response);

  const parsed = userApiSchema.omit({ role: true }).safeParse(await response.json());

  if (!parsed.success) {
    console.error(parsed.error.issues);
    throw new Error("Unexpected response shape from POST /auth/signup");
  }

  return toUser(parsed.data);
}

export interface LoginCredentials {
  username: string;
  password: string;
}

const loginApiSchema = z.object({ token: z.string() });

export async function loginUser(credentials: LoginCredentials): Promise<string> {
  const response = await fetch(`${AUTH_ENDPOINT}/login`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  await failOnError(response);

  const parsed = loginApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from POST /auth/login");
  }

  return parsed.data.token;
}

export async function refreshAccessToken(): Promise<string> {
  const response = await fetch(`${AUTH_ENDPOINT}/refresh`, {
    method: "POST",
    credentials: "include",
  });

  await failOnError(response);

  const parsed = loginApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from POST /auth/refresh");
  }

  return parsed.data.token;
}

export async function logoutUser(token: string): Promise<void> {
  const response = await fetch(`${AUTH_ENDPOINT}/logout`, {
    method: "POST",
    credentials: "include",
    headers: authHeader(token),
  });

  await failOnError(response);
}
