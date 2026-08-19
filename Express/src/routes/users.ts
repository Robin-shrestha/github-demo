import { Router } from "express";
import { signupUser } from "../controllers/userSignup.ts";

const router = Router();

router.post("/signup", ...signupUser);

export default router;
