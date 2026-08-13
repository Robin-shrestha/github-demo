import type { Request, Response } from "express";
import { findStudentById, findStudents } from "../services/studentsService.ts";
import { NotFound } from "../types/httpError.ts";

export async function listStudents(req: Request, res: Response): Promise<void> {
  const { role } = req.query;
  const students = await findStudents(typeof role === "string" ? role : undefined);

  res.json(students);
}

export async function getStudent(req: Request<{ id: string }>, res: Response): Promise<void> {
  const student = await findStudentById(req.params.id);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}
