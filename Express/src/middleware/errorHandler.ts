import type { NextFunction, Request, Response } from "express";
import { HttpError } from "../types/httpError.ts";

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { status, message } = describe(err);

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json({ error: message });
}

function describe(err: unknown): { status: number; message: string } {
  if (err instanceof HttpError) {
    return { status: err.status, message: err.message };
  }

  if (err instanceof Error && err.name === "CastError") {
    return { status: 400, message: "Invalid id" };
  }

  return {
    status: getStatus(err),
    message: err instanceof Error ? err.message : "Internal Server Error",
  };
}

function getStatus(err: unknown): number {
  if (typeof err === "object" && err !== null && "status" in err) {
    const { status } = err as { status?: unknown };
    if (typeof status === "number") return status;
  }

  return 500;
}
