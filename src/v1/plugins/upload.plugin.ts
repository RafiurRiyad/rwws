import multer from "multer";
import path from "path";
import fs from "fs";
import { AppConfig } from "../configs/app.config";

const uploadDirectory = path.join(__dirname, "../../../../public", "uploads");
if (!fs.existsSync(uploadDirectory)) {
  fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDirectory);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

export const Upload = multer({
  storage: storage,
  limits: { fileSize: parseInt(AppConfig.fileSize) * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const fileTypes = /jpeg|jpg|png|gif/;
    const mimetype = fileTypes.test(file.mimetype);

    if (mimetype) {
      return cb(null, true);
    } else {
      cb(
        new Error(
          "Invalid file type. Only JPG, JPEG, PNG, and GIF are allowed."
        )
      );
    }
  },
});
