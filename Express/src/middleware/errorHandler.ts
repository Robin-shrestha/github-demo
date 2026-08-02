import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../types/httpError.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err instanceof HttpError ? err.status : getStatus(err);
  const message = err instanceof Error ? err.message : "Internal Server Error";

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}

function getStatus(err: unknown): number {
  if (typeof err === "object" && err !== null && "status" in err) {
    const { status } = err as { status?: unknown };
    if (typeof status === "number") return status;
  }

  return 500;
}
