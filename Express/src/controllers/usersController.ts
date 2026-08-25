import type { Request, Response } from "express";
import { UserModel } from "../models/index.ts";
import { NotFound } from "../types/httpError.ts";

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const user = await UserModel.findById(req.user?.id).populate("role");

  if (!user) {
    throw new NotFound("No user with that id");
  }

  res.json(user);
}
