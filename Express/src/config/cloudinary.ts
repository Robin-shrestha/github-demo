import { v2 as cloudinary } from "cloudinary";
import { envConstants } from "../constants/env.ts";

cloudinary.config({
  cloud_name: envConstants.CLOUDINARY_CLOUD_NAME,
  api_key: envConstants.CLOUDINARY_API_KEY,
  api_secret: envConstants.CLOUDINARY_API_SECRET,
});

export type CloudinaryUploadResult = {
  secure_url: string;
  public_id: string;
};

/**
 * Upload a file buffer to Cloudinary.
 * Returns the secure URL and public_id of the uploaded asset.
 */
export function uploadToCloudinary(
  buffer: Buffer,
  options: { folder?: string; resource_type?: "image" | "raw" | "auto" } = {},
): Promise<CloudinaryUploadResult> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: options.folder ?? "uploads", resource_type: options.resource_type ?? "auto" },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error("Cloudinary upload returned no result"));
          return;
        }
        resolve({ secure_url: result.secure_url, public_id: result.public_id });
      },
    );

    stream.end(buffer);
  });
}

export { cloudinary };
