import { Router } from "express";
import {
  addStudent,
  deleteStudent,
  findStudent,
  listStudents,
  updateStudent,
} from "../data/studentsData.ts";
import type { NewStudent } from "../types/studentTypes.ts";

const router = Router();

function validateStudent(body: unknown): NewStudent | null {
  if (typeof body !== "object" || body === null) return null;
  const { name, role, avatar } = body as Record<string, unknown>;
  if (typeof name !== "string" || name.trim() === "") return null;
  if (typeof role !== "string" || role.trim() === "") return null;
  if (typeof avatar !== "string" || avatar.trim() === "") return null;
  return { name, role, avatar };
}

router.get("/", (req, res) => {
  const { role } = req.query;
  const students = listStudents();

  if (typeof role === "string") {
    res.json(students.filter((student) => student.role === role));
    return;
  }

  res.status(200).json(students);
});

router.get("/:id", (req, res) => {
  const student = findStudent(req.params.id);

  if (!student) {
    res.status(404).json({ error: `No student with id ${req.params.id}` });
    return;
  }

  res.json(student);
});

router.post("/", (req, res) => {
  const input = validateStudent(req.body);

  if (!input) {
    res.status(400).json({ error: "name, role and avatar are required" });
    return;
  }

  res.status(201).json(addStudent(input));
});

router.put("/:id", (req, res) => {
  const input = validateStudent(req.body);

  if (!input) {
    res.status(400).json({ error: "name, role and avatar are required" });
    return;
  }

  const updated = updateStudent(req.params.id, input);

  if (!updated) {
    res.status(404).json({ error: `No student with id ${req.params.id}` });
    return;
  }

  res.json(updated);
});

router.delete("/:id", (req, res) => {
  if (!deleteStudent(req.params.id)) {
    res.status(404).json({ error: `No student with id ${req.params.id}` });
    return;
  }

  res.status(204).end();
});

export default router;
