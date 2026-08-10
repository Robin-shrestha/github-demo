import { Router } from "express";
import {
  addStudent,
  deleteStudent,
  findStudent,
  listStudents,
  updateStudent,
} from "../data/studentsData.ts";
import { validateStudent } from "../middleware/validateStudent.ts";
import { NotFound } from "../types/httpError.ts";
import type { StudentInput } from "../models/Student.ts";

const router = Router();
// const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

router.get("/", async (req, res) => {
  const { role } = req.query;
  const students = listStudents();
  // await Promise.reject(new NotFound("Simulated error for testing error handling"));

  if (typeof role === "string") {
    res.json(students.filter((student) => student.role === role));
    return;
  }

  res.status(200).json(students);
});

router.get("/:id", (req, res) => {
  const student = findStudent(req.params.id);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
});

router.post("/", validateStudent, (req, res) => {
  res.status(201).json(addStudent(req.body as StudentInput));
});

router.put("/:id", validateStudent, (req, res) => {
  const updated = updateStudent(req.params.id, req.body as StudentInput);

  if (!updated) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(updated);
});

router.delete("/:id", (req, res) => {
  if (!deleteStudent(req.params.id)) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.status(204).end();
});

export default router;
