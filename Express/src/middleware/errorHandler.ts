import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../types/httpError.ts";

interface FieldError {
  field: string;
  message: string;
}

interface Described {
  status: number;
  message: string;
  details?: FieldError[];
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const { status, message, details } = describe(err);

  if (status >= 500) {
    console.error(err);
  }

  res.status(status).json(details ? { error: message, details } : { error: message });
}

function describe(err: unknown): Described {
  if (err instanceof ZodError) {
    return {
      status: 400,
      message: "Validation failed",
      details: err.issues.map((issue) => ({
        field: issue.path.join(".") || "body",
        message: issue.message,
      })),
    };
  }

  if (err instanceof HttpError) {
    return { status: err.status, message: err.message };
  }

  if (err instanceof Error && err.name === "ValidationError") {
    const errors = (err as unknown as { errors: Record<string, { message: string }> }).errors;

    return {
      status: 400,
      message: "Validation failed",
      details: Object.entries(errors).map(([field, detail]) => ({
        field,
        message: detail.message,
      })),
    };
  }

  if (err instanceof Error && err.name === "CastError") {
    return { status: 400, message: "Invalid id" };
  }

  if (err instanceof Error && err.name === "MulterError") {
    return { status: 400, message: err.message };
  }

  if (isDuplicateKey(err)) {
    return { status: 409, message: "Already exists" };
  }

  return {
    status: getStatus(err),
    message: err instanceof Error ? err.message : "Internal Server Error",
  };
}

function isDuplicateKey(err: unknown): boolean {
  return typeof err === "object" && err !== null && "code" in err && err.code === 11000;
}

function getStatus(err: unknown): number {
  if (typeof err === "object" && err !== null && "status" in err) {
    const { status } = err as { status?: unknown };
    if (typeof status === "number") return status;
  }

  return 500;
}
