import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Role, UserModel } from "../models/index.ts";
import { Unauthorized } from "../types/httpError.ts";
import { envConstants } from "../constants/env.ts";
import type { LoginInput } from "./authSchemas.ts";
import {
  clearRefreshTokenCookie,
  REFRESH_TOKEN_COOKIE,
  setRefreshTokenCookie,
  signAccessToken,
  signRefreshToken,
} from "./tokens.ts";
import { userDataById, userDataByUsername } from "./authService.ts";

export async function loginUser(req: Request, res: Response): Promise<void> {
  const { username, password } = req.body as LoginInput;

  const user = await userDataByUsername(username);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new Unauthorized("Invalid credentials");
  }

  setRefreshTokenCookie(res, signRefreshToken(user.id, user.tokenVersion));
  res.json({ token: signAccessToken(user.id, user.username, user.role ?? []) });
}

export async function refreshAccessToken(req: Request, res: Response): Promise<void> {
  const token = req.cookies?.[REFRESH_TOKEN_COOKIE];

  if (!token) {
    throw new Unauthorized("Missing refresh token");
  }

  const payload = jwt.verify(token, envConstants.JWT_SECRET) as {
    id: string;
    type: string;
    tokenVersion: number;
  };

  if (payload.type !== "refresh") {
    throw new Unauthorized("Invalid refresh token");
  }

  const user = await userDataById(payload.id);

  if (!user || user.tokenVersion !== payload.tokenVersion) {
    throw new Unauthorized("Session expired, please log in again");
  }

  res.json({ token: signAccessToken(user.id, user.username, user.role ?? []) });
}

export async function logoutUser(req: Request, res: Response): Promise<void> {
  const user = await UserModel.findById(req.user?.id);

  if (user) {
    user.tokenVersion += 1;
    await user.save();
  }

  clearRefreshTokenCookie(res);
  res.status(204).send();
}
