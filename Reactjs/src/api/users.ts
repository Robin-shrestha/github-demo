import { z } from "zod";
import type { User } from "../types/types";
import type { SignupFormValues } from "../components/SignupForm";
import { USERS_ENDPOINT } from "./endpoints";
import { failOnError, resolveFileUrl } from "./httpClient";

const userApiSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  username: z.string(),
  dateOfBirth: z.string(),
  address: z.string(),
  profilePic: z.string(),
  idDocuments: z.array(z.string()).optional(),
});

type RawUser = z.infer<typeof userApiSchema>;

function toUser(raw: RawUser): User {
  return {
    id: raw.id,
    firstName: raw.firstName,
    lastName: raw.lastName,
    username: raw.username,
    dateOfBirth: raw.dateOfBirth,
    address: raw.address,
    profilePic: resolveFileUrl(raw.profilePic),
    idDocuments: raw.idDocuments?.map(resolveFileUrl),
  };
}

export async function signupUser(values: SignupFormValues): Promise<User> {
  const formData = new FormData();
  formData.append("firstName", values.firstName);
  formData.append("lastName", values.lastName);
  formData.append("username", values.username);
  formData.append("dateOfBirth", values.dateOfBirth);
  formData.append("address", values.address);
  formData.append("profilePic", values.profilePic);

  values.idDocuments?.forEach((file) => formData.append("idDocuments", file));

  const response = await fetch(`${USERS_ENDPOINT}/signup`, {
    method: "POST",
    body: formData,
  });

  await failOnError(response);

  const parsed = userApiSchema.safeParse(await response.json());

  if (!parsed.success) {
    throw new Error("Unexpected response shape from POST /users/signup");
  }

  return toUser(parsed.data);
}
