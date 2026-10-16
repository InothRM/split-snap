import multer from "multer";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof multer.MulterError && error.code === "LIMIT_FILE_SIZE") {
    response.status(413).json({ error: "Receipt files must be 10 MB or smaller." });
    return;
  }
  if (error instanceof multer.MulterError || error.statusCode === 400) {
    response.status(400).json({ error: error.message });
    return;
  }

  console.error("API request failed:", error);
  response.status(500).json({ error: "The server could not process this request." });
}
