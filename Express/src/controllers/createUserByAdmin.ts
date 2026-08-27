import multer from "multer";
import type { Request, Response } from "express";
import { createUser } from "../auth/authService.ts";
import { BadRequest } from "../types/httpError.ts";
import { validate } from "../middleware/validate.ts";
import { createUserByAdminSchema, type CreateUserByAdminInput } from "../validation/userManagementSchemas.ts";
import { uploadToCloudinary } from "../config/cloudinary.ts";

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
    | { profilePic?: Express.Multer.File[]; idDocuments?: Express.Multer.File[] }
    | undefined;

  const profilePicFile = files?.profilePic?.[0];

  if (!profilePicFile) {
    throw new BadRequest("No profile picture uploaded, or the file was not an image");
  }

  const [profilePicResult, ...idDocResults] = await Promise.all([
    uploadToCloudinary(profilePicFile.buffer, { folder: "users/profile-pics", resource_type: "image" }),
    ...(files?.idDocuments ?? []).map((file) =>
      uploadToCloudinary(file.buffer, { folder: "users/id-documents", resource_type: "auto" }),
    ),
  ]);

  const { role, ...input } = req.body as CreateUserByAdminInput;

  const user = await createUser(
    {
      ...input,
      profilePic: profilePicResult.secure_url,
      idDocuments: idDocResults.map((r) => r.secure_url),
    },
    role,
  );

  res.status(201).json(user);
}

export const createUserByAdmin = [uploadFields, validate({ body: createUserByAdminSchema }), handler];
