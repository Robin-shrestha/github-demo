import path from "node:path";
import { randomUUID } from "node:crypto";
import multer from "multer";
import type { Request, Response } from "express";
import { BadRequest, NotFound } from "../types/httpError.ts";
import { updateStudentAvatar } from "../services/studentsService.ts";

const storage = multer.diskStorage({
  destination: "uploads/",
  filename(_req, file, cb) {
    console.log("🚀 ~ file:", file);
    cb(null, `${randomUUID()}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  fileFilter(_req, file, cb) {
    cb(null, file.mimetype.startsWith("image/"));
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

async function handler(req: Request<{ id: string }>, res: Response): Promise<void> {
  if (!req.file) {
    throw new BadRequest("No photo uploaded, or the file was not an image");
  }

  const student = await updateStudentAvatar(req.params.id, `/uploads/${req.file.filename}`);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}

export const uploadStudentPhotoLocal = [upload.single("photo"), handler];
