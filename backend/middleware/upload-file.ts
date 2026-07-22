import { randomUUID } from "crypto";
import fs from "fs";
import multer, { FileFilterCallback } from "multer";
import path from "path";
import {
  archiveTypes,
  codeTypes,
  documentTypes,
  imageTypes,
} from "../config/type";

const uploadDir = "uploads/tasks";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadDir);
  },
  filename: (_req, file, cb) => {
    const storedName = `${randomUUID()}${path.extname(file.originalname)}`;
    cb(null, storedName);
  },
});

const allowTypes = [
  ...imageTypes,
  ...documentTypes,
  ...archiveTypes,
  ...codeTypes,
];

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: FileFilterCallback,
) => {
  if (allowTypes.includes(file.mimetype)) {
    cb(null, true);
    return;
  }

  cb(new Error("不支持的文件类型"));
};

export const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 },
});

export const uploadFiles = upload.array("files", 5);
