import jwt from "jsonwebtoken";
import type { Response } from "express";
import { envConstants } from "../constants/env.ts";

const ACCESS_TOKEN_EXPIRES_IN = "15m";
const REFRESH_TOKEN_EXPIRES_IN = "7d";
const REFRESH_TOKEN_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

export const REFRESH_TOKEN_COOKIE = "refreshToken";

export interface AccessTokenClaims {
  roles: string[];
  permissions: string[];
}

export function signAccessToken(userId: string, claims: AccessTokenClaims): string {
  return jwt.sign(
    { id: userId, type: "access", roles: claims.roles, permissions: claims.permissions },
    envConstants.JWT_SECRET,
    { expiresIn: ACCESS_TOKEN_EXPIRES_IN }
  );
}

export function signRefreshToken(userId: string, tokenVersion: number): string {
  return jwt.sign({ id: userId, type: "refresh", tokenVersion }, envConstants.JWT_SECRET, {
    expiresIn: REFRESH_TOKEN_EXPIRES_IN,
  });
}

export function setRefreshTokenCookie(res: Response, token: string): void {
  res.cookie(REFRESH_TOKEN_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: REFRESH_TOKEN_MAX_AGE_MS,
  });
}

export function clearRefreshTokenCookie(res: Response): void {
  res.clearCookie(REFRESH_TOKEN_COOKIE);
}
