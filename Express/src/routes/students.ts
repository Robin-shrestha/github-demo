import { Router } from "express";
import {
  deleteStudent,
  getStudent,
  listStudents,
  patchStudent,
  postStudent,
  putStudent,
} from "../controllers/studentsController.ts";
import { uploadStudentPhotoLocal } from "../controllers/studentPhotoLocal.ts";
import { authenticate } from "../auth/authenticate.ts";
import { requirePermission } from "../auth/authorize.ts";
import { validate } from "../middleware/validate.ts";
import {
  createStudentSchema,
  listStudentsQuerySchema,
  patchStudentSchema,
  studentIdSchema,
} from "../validation/studentSchemas.ts";

const router = Router();

router.get(
  "/",
  authenticate,
  requirePermission("student:read"),
  validate({ query: listStudentsQuerySchema }),
  listStudents
);

router.get(
  "/:id",
  authenticate,
  requirePermission("student:read"),
  validate({ params: studentIdSchema }),
  getStudent
);

router.post(
  "/",
  authenticate,
  requirePermission("student:create"),
  validate({ body: createStudentSchema }),
  postStudent
);

// PUT and PATCH differ only in what the body must contain.
router.put(
  "/:id",
  authenticate,
  requirePermission("student:update"),
  validate({ params: studentIdSchema, body: createStudentSchema }),
  putStudent
);

router.patch(
  "/:id",
  authenticate,
  requirePermission("student:update"),
  validate({ params: studentIdSchema, body: patchStudentSchema }),
  patchStudent
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("student:delete"),
  validate({ params: studentIdSchema }),
  deleteStudent
);

router.post(
  "/:id/photo",
  authenticate,
  requirePermission("student:update"),
  validate({ params: studentIdSchema }),
  ...uploadStudentPhotoLocal
);

export default router;
