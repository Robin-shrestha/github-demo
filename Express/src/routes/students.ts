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
import { authorizeRoles, authorizeWithPermission } from "../auth/authorize.ts";
import { validate } from "../middleware/validate.ts";
import {
  createStudentSchema,
  listStudentsQuerySchema,
  patchStudentSchema,
  studentIdSchema,
} from "../validation/studentSchemas.ts";

const router = Router();

router.get("/", validate({ query: listStudentsQuerySchema }), listStudents);

router.get("/:id", validate({ params: studentIdSchema }), getStudent);

router.post(
  "/",
  authenticate,
  // authorizeRoles("admin"),
  authorizeWithPermission("student:create"),
  validate({ body: createStudentSchema }),
  postStudent
);

// PUT and PATCH differ only in what the body must contain.
router.put(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: studentIdSchema, body: createStudentSchema }),
  putStudent
);

router.patch(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: studentIdSchema, body: patchStudentSchema }),
  patchStudent
);

router.delete(
  "/:id",
  authenticate,
  authorizeRoles("admin"),
  validate({ params: studentIdSchema }),
  deleteStudent
);

router.post("/:id/photo", validate({ params: studentIdSchema }), ...uploadStudentPhotoLocal);

export default router;
