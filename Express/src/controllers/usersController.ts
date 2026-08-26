import type { Request, Response } from "express";
import { UserModel } from "../models/index.ts";
import { NotFound } from "../types/httpError.ts";
import {
  deleteUser as deleteUserRecord,
  findUserById,
  listUsers as listUserRecords,
  updateUser as updateUserRecord,
} from "../services/usersService.ts";
import type { UpdateUserInput } from "../validation/userManagementSchemas.ts";

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  const user = await UserModel.findById(req.user?.id).populate("role");

  if (!user) {
    throw new NotFound("No user with that id");
  }

  res.json(user);
}

export async function listUsers(_req: Request, res: Response): Promise<void> {
  const users = await listUserRecords();

  res.json(users);
}

export async function getUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await findUserById(req.params.id);

  if (!user) {
    throw new NotFound(`No user with id ${req.params.id}`);
  }

  res.json(user);
}

export async function updateUser(
  req: Request<{ id: string }, unknown, UpdateUserInput>,
  res: Response
): Promise<void> {
  const user = await updateUserRecord(req.params.id, req.body);

  if (!user) {
    throw new NotFound(`No user with id ${req.params.id}`);
  }

  res.json(user);
}

export async function deleteUser(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await deleteUserRecord(req.params.id);

  if (!user) {
    throw new NotFound(`No user with id ${req.params.id}`);
  }

  res.status(204).end();
}
