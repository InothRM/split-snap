import multer from "multer";

const MAX_FILE_SIZE = 10 * 1024 * 1024;
const supportedTypes = new Set(["image/jpeg", "image/png", "application/pdf"]);

export const uploadReceipt = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_FILE_SIZE, files: 1 },
  fileFilter(_request, file, callback) {
    if (!supportedTypes.has(file.mimetype)) {
      const error = new Error("Upload a JPG, PNG, or PDF receipt.");
      error.statusCode = 400;
      callback(error);
      return;
    }
    callback(null, true);
  },
});
