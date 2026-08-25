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

export function authorizeWithPermission(...permissions: string[]) {
  return async (req: Request, _res: Response, next: NextFunction): Promise<void> => {
    const user = await UserModel.findById(req.user?.id).populate<{ role: Role[] }>("role");

    if (!user) {
      throw new Unauthorized("User not found");
    }
    const allUserPermissions = Array.from(new Set(user?.role.flatMap((role) => role.permissions)));

    const hasPermission = allUserPermissions.some((permission) => permissions.includes(permission));
    console.log("🚀 ~ authorizeWithPermission ~ hasPermission:", allUserPermissions, hasPermission);
    if (!hasPermission) {
      throw new Forbidden("You don't have permission to do this");
    }

    next();
  };
}
