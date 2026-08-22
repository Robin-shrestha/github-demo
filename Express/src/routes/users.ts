import { Router } from "express";
import { signupUser } from "../controllers/userSignup.ts";
import { getCurrentUser, loginUser } from "../controllers/usersController.ts";
import { authenticate } from "../middleware/authenticate.ts";
import { validate } from "../middleware/validate.ts";
import { loginSchema } from "../validation/userSchemas.ts";

const router = Router();

router.post("/signup", ...signupUser);

router.post("/login", validate({ body: loginSchema }), loginUser);

router.get("/me", authenticate, getCurrentUser);

export default router;
