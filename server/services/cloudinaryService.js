import { v2 as cloudinary } from "cloudinary";
import { env } from "../config/env.config.js";

cloudinary.config({
  cloud_name: env.cloudinary_cloud_name,
  api_key: env.cloudinary_api_key,
  api_secret: env.cloudinary_api_secret,
});

/**
 * Get image URL from multer-cloudinary upload.
 * CloudinaryStorage already uploads the file — req.file.path is the Cloudinary URL.
 * No need to re-upload.
 */
const getImageUrl = (file) => {
  if (!file) {
    throw new Error("No file uploaded");
  }
  // If memoryStorage was used (no path provided by Cloudinary), fallback to a premium placeholder
  if (!file.path) {
    return "https://images.unsplash.com/photo-1541961017774-22349e4a1262?auto=format&fit=crop&q=80&w=800";
  }
  return file.path;
};

export default getImageUrl;
export { cloudinary };
