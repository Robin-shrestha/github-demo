import type { NextFunction, Request, Response } from "express";
import { BadRequest } from "../types/httpError.ts";

// Generic in P because this only reads the body. Pinning the params type here
// would widen req.params for the route handlers that follow it.
export function validateStudent<P>(req: Request<P>, _res: Response, next: NextFunction): void {
  const body: unknown = req.body;

  if (typeof body !== "object" || body === null) {
    next(new BadRequest("Request body must be an object"));
    return;
  }

  const { name, role, avatar } = body as Record<string, unknown>;
  const missing: string[] = [];

  if (typeof name !== "string" || name.trim() === "") missing.push("name");
  if (typeof role !== "string" || role.trim() === "") missing.push("role");
  if (typeof avatar !== "string" || avatar.trim() === "") missing.push("avatar");

  if (missing.length > 0) {
    next(new BadRequest(`Missing or invalid fields: ${missing.join(", ")}`));
    return;
  }

  next();
}
