import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Unauthorized } from "../types/httpError.ts";
import { envConstants } from "../constants/env.ts";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.get("authorization");

  if (!header?.startsWith("Bearer ")) {
    throw new Unauthorized("Missing or invalid Authorization header");
  }

  const token = header.slice("Bearer ".length);
  const payload = jwt.verify(token, envConstants.JWT_SECRET) as {
    id: string;
    type?: string;
    roles?: string[];
    permissions?: string[];
  };

  if (payload.type !== "access") {
    throw new Unauthorized("Invalid access token");
  }

  req.user = { id: payload.id, roles: payload.roles ?? [], permissions: payload.permissions ?? [] };
  next();
}
