import { OAuth2Client } from "google-auth-library";
import type { Request, Response } from "express";
import { envConstants } from "../constants/env.ts";
import { BadRequest, Unauthorized } from "../types/httpError.ts";
import { findOrCreateGoogleUser } from "./authService.ts";
import { setRefreshTokenCookie, signAccessToken, signRefreshToken } from "./tokens.ts";

const client = new OAuth2Client(envConstants.GOOGLE_CLIENT_ID);

export async function googleLogin(req: Request, res: Response): Promise<void> {
  const { credential } = req.body as { credential?: string };

  if (!credential) {
    throw new BadRequest("Missing Google credential");
  }

  const ticket = await client.verifyIdToken({
    idToken: credential,
    audience: envConstants.GOOGLE_CLIENT_ID,
  });
  console.log("🚀 ~ googleLogin ~ ticket:", ticket);

  const payload = ticket.getPayload();

  if (!payload?.email) {
    throw new Unauthorized("Google account has no email");
  }
  console.log("🚀 ~ googleLogin ~ payload:", payload);

  const user = await findOrCreateGoogleUser({
    email: payload.email,
    firstName: payload.given_name ?? "",
    lastName: payload.family_name ?? "",
    profilePic: payload.picture,
    googleId: payload.sub,
  });

  setRefreshTokenCookie(res, signRefreshToken(user.id, user.tokenVersion));
  res.json({ token: signAccessToken(user.id) });
}
