import type { Request, Response } from "express";
import {
  createStudent,
  findStudentById,
  findStudents,
  removeStudent,
  updateStudent,
} from "../services/studentsService.ts";
import { NotFound } from "../types/httpError.ts";
import type {
  CreateStudentInput,
  ListStudentsQuery,
  PatchStudentInput,
} from "../validation/studentSchemas.ts";

export async function listStudents(req: Request, res: Response): Promise<void> {
  // validate() already replaced req.query with the parsed values, which
  // TypeScript has no way of knowing.
  const students = await findStudents(req.query as unknown as ListStudentsQuery);

  res.json(students);
}

export async function getStudent(req: Request<{ id: string }>, res: Response): Promise<void> {
  const student = await findStudentById(req.params.id);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}

export async function postStudent(
  req: Request<unknown, unknown, CreateStudentInput>,
  res: Response
): Promise<void> {
  const student = await createStudent(req.body);

  res.status(201).json(student);
}

export async function putStudent(
  req: Request<{ id: string }, unknown, CreateStudentInput>,
  res: Response
): Promise<void> {
  const student = await updateStudent(req.params.id, req.body);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}

export async function patchStudent(
  req: Request<{ id: string }, unknown, PatchStudentInput>,
  res: Response
): Promise<void> {
  const student = await updateStudent(req.params.id, req.body);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}

export async function deleteStudent(req: Request<{ id: string }>, res: Response): Promise<void> {
  const student = await removeStudent(req.params.id);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.status(204).end();
}
