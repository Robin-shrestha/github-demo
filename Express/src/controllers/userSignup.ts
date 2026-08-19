import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import type { Request, Response } from "express";
import { createUser } from "../services/usersService.ts";
import { BadRequest } from "../types/httpError.ts";
import { validate } from "../middleware/validate.ts";
import { signupSchema, type SignupInput } from "../validation/userSchemas.ts";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(_req, file, cb) {
    cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(_req, file, cb) {
    if (file.fieldname === "profilePic") {
      cb(null, file.mimetype.startsWith("image/"));
      return;
    }
    cb(null, file.mimetype.startsWith("image/") || file.mimetype === "application/pdf");
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

const uploadFields = upload.fields([
  { name: "profilePic", maxCount: 1 },
  { name: "idDocuments", maxCount: 10 },
]);

async function handler(req: Request, res: Response): Promise<void> {
  const files = req.files as
    { profilePic?: Express.Multer.File[]; idDocuments?: Express.Multer.File[] } | undefined;

  const profilePic = files?.profilePic?.[0];

  if (!profilePic) {
    throw new BadRequest("No profile picture uploaded, or the file was not an image");
  }

  const user = await createUser({
    ...req.body,
    profilePic: `/uploads/${profilePic.filename}`,
    idDocuments: files?.idDocuments?.map((file) => `/uploads/${file.filename}`),
  });

  res.status(201).json(user);
}

export const signupUser = [uploadFields, validate({ body: signupSchema }), handler];
