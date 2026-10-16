import { analyzeReceipt } from "../services/receiptService.js";
import { hasValidSignature } from "../utils.js";

export function getHealth(_request, response) {
  response.json({ status: "ok" });
}

export function postAnalyzeReceipt(request, response) {
  if (!request.file) {
    response.status(400).json({ error: "Choose a receipt image or PDF to upload." });
    return;
  }
  if (!hasValidSignature(request.file)) {
    response.status(400).json({ error: "The uploaded file does not match a supported receipt format." });
    return;
  }

  response.json(analyzeReceipt(request.file));
}
