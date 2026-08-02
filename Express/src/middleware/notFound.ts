import type { NextFunction, Request, Response } from "express";
import { NotFound } from "../types/httpError.ts";

export function notFound(req: Request, _res: Response, next: NextFunction): void {
  next(new NotFound(`Cannot ${req.method} ${req.originalUrl}`));
}
