import bcrypt from "bcryptjs";
import { UserModel } from "../models/index.ts";
import type { SignupInput } from "./authSchemas.ts";

const SALT_ROUNDS = 10;

export interface CreateUserInput extends SignupInput {
  profilePic: string;
  idDocuments?: string[];
}

export async function createUser(input: CreateUserInput) {
  const password = await bcrypt.hash(input.password, SALT_ROUNDS);

  return UserModel.create({ ...input, password });
}

interface GoogleProfile {
  email: string;
  firstName: string;
  lastName: string;
  profilePic?: string;
  googleId: string;
}

async function generateUniqueUsername(base: string): Promise<string> {
  const cleaned = base.replace(/[^a-zA-Z0-9_]/g, "_") || "user";
  let candidate = cleaned;
  let suffix = 1;

  while (await UserModel.exists({ username: candidate })) {
    candidate = `${cleaned}${suffix}`;
    suffix += 1;
  }

  return candidate;
}

export async function findOrCreateGoogleUser(profile: GoogleProfile) {
  const existing = await UserModel.findOne({ email: profile.email });

  if (existing) {
    if (!existing.googleId) {
      existing.googleId = profile.googleId;
      await existing.save();
    }
    return existing;
  }

  const username = await generateUniqueUsername(profile.email.split("@")[0]);

  return UserModel.create({
    firstName: profile.firstName,
    lastName: profile.lastName,
    username,
    email: profile.email,
    profilePic: profile.profilePic,
    googleId: profile.googleId,
  });
}
