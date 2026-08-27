import multer from "multer";
import type { Request, Response } from "express";
import { uploadToCloudinary } from "../config/cloudinary.ts";
import { BadRequest, NotFound } from "../types/httpError.ts";
import { updateStudentAvatar } from "../services/studentsService.ts";

// Store the file in memory so we can stream it to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter(_req, file, cb) {
    cb(null, file.mimetype.startsWith("image/"));
  },
  limits: { fileSize: 2 * 1024 * 1024 },
});

async function handler(req: Request<{ id: string }>, res: Response): Promise<void> {
  if (!req.file) {
    throw new BadRequest("No photo uploaded, or the file was not an image");
  }

  const { secure_url } = await uploadToCloudinary(req.file.buffer, {
    folder: "students",
    resource_type: "image",
  });

  const student = await updateStudentAvatar(req.params.id, secure_url);

  if (!student) {
    throw new NotFound(`No student with id ${req.params.id}`);
  }

  res.json(student);
}

export const uploadStudentPhoto = [upload.single("photo"), handler];
