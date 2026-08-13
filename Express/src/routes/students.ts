import { Router } from "express";
import { getStudent, listStudents } from "../controllers/studentsController.ts";
import { findStudents } from "../services/studentsService.ts";

const router = Router();

router.get("/", listStudents);

router.get("/:id", getStudent);

export default router;
