import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { cloudinary } from "../services/cloudinaryService.js";
import { env } from "../config/env.config.js";

const isConfigured = env.cloudinary_api_key && env.cloudinary_api_key !== "your-api-key";

const storage = isConfigured ? new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "uploads",
    public_id: (req, file) => `${Date.now()}-${file.originalname}`,
  },
}) : multer.memoryStorage();

const upload = multer({ storage });

export default upload;
