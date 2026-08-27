import multer from "multer";
import type { Request, Response } from "express";
import { createUser } from "./authService.ts";
import { BadRequest } from "../types/httpError.ts";
import { validate } from "../middleware/validate.ts";
import { signupSchema } from "./authSchemas.ts";
import { uploadToCloudinary } from "../config/cloudinary.ts";

// Store all files in memory so we can stream them to Cloudinary.
const upload = multer({
  storage: multer.memoryStorage(),
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

  const profilePicFile = files?.profilePic?.[0];
  console.log("🚀 ~ handler ~ profilePicFile:", profilePicFile);

  if (!profilePicFile) {
    throw new BadRequest("No profile picture uploaded, or the file was not an image");
  }

  // Upload profile picture and all ID documents to Cloudinary in parallel.
  const [profilePicResult, ...idDocResults] = await Promise.all([
    uploadToCloudinary(profilePicFile.buffer, {
      folder: "users/profile-pics",
      resource_type: "image",
    }),
    ...(files?.idDocuments ?? []).map((file) =>
      uploadToCloudinary(file.buffer, { folder: "users/id-documents", resource_type: "auto" })
    ),
  ]);

  const user = await createUser({
    ...req.body,
    profilePic: profilePicResult.secure_url,
    idDocuments: idDocResults.map((r) => r.secure_url),
  });

  res.status(201).json(user);
}

export const signupUser = [uploadFields, validate({ body: signupSchema }), handler];
