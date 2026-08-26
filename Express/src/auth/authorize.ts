import type { NextFunction, Request, Response } from "express";
import { UserModel } from "../models/index.ts";
import type { Role } from "../models/Role.ts";
import { Forbidden, Unauthorized } from "../types/httpError.ts";

export function authorizeRoles(...allowedRoles: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const user = await UserModel.findById(req.user?.id).populate<{ role: Role[] }>("role");

    if (!user) {
      throw new Unauthorized("User not found");
    }

    const hasRole = user.role.some((role) => allowedRoles.includes(role.name));

    if (!hasRole) {
      throw new Forbidden("You don't have permission to do this");
    }

    next();
  };
}

export function requirePermission(...anyOf: string[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const permissions = req.user?.permissions ?? [];
    const allowed = anyOf.some((permission) => permissions.includes(permission));

    if (!allowed) {
      throw new Forbidden("You don't have permission to do this");
    }

    next();
  };
}
