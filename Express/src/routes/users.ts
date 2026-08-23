import { Router } from "express";
import { getCurrentUser } from "../controllers/usersController.ts";
import { authenticate } from "../auth/authenticate.ts";

const router = Router();

router.get("/me", authenticate, getCurrentUser);

export default router;
