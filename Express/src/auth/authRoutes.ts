import { Router } from "express";
import { signupUser } from "./signup.ts";
import { loginUser, logoutUser, refreshAccessToken } from "./authController.ts";
import { authenticate } from "./authenticate.ts";
import { validate } from "../middleware/validate.ts";
import { loginSchema } from "./authSchemas.ts";

const router = Router();

router.post("/signup", ...signupUser);

router.post("/login", validate({ body: loginSchema }), loginUser);

router.post("/refresh", refreshAccessToken);

router.post("/logout", authenticate, logoutUser);

export default router;
