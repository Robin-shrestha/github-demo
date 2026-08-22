import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserModel } from "../models/index.ts";
import { NotFound, Unauthorized } from "../types/httpError.ts";
import { envConstants } from "../constants/env.ts";
import type { LoginInput } from "../validation/userSchemas.ts";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as LoginInput;

  const user = await UserModel.findOne({ username }).select("+password");

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized("Invalid credentials");
  }

  const token = jwt.sign(
    { id: user.id, name: `${user.firstName} ${user.lastName}`, email: user.email },
    envConstants.JWT_SECRET,
    { expiresIn: "1h" }
  );

  res.json({ token });
}

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const user = await UserModel.findById(req.user?.id);

  if (!user) {
    throw new NotFound("No user with that id");
  }

  res.json(user);
}
