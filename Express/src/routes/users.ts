import { Router } from "express";
import {
  deleteUser,
  getCurrentUser,
  getUser,
  listUsers,
  updateUser,
} from "../controllers/usersController.ts";
import { createUserByAdmin } from "../controllers/createUserByAdmin.ts";
import { authenticate } from "../auth/authenticate.ts";
import { requirePermission } from "../auth/authorize.ts";
import { validate } from "../middleware/validate.ts";
import { updateUserSchema, userIdSchema } from "../validation/userManagementSchemas.ts";

const router = Router();

router.get("/me", authenticate, getCurrentUser);

router.get("/", authenticate, requirePermission("user:read"), listUsers);

router.get(
  "/:id",
  authenticate,
  requirePermission("user:read"),
  validate({ params: userIdSchema }),
  getUser
);

router.post("/", authenticate, requirePermission("user:create"), ...createUserByAdmin);

router.patch(
  "/:id",
  authenticate,
  requirePermission("user:update"),
  validate({ params: userIdSchema, body: updateUserSchema }),
  updateUser
);

router.delete(
  "/:id",
  authenticate,
  requirePermission("user:delete"),
  validate({ params: userIdSchema }),
  deleteUser
);

export default router;
