import { Router } from "express";
import { getHealth, postAnalyzeReceipt } from "../controllers/receiptController.js";
import { uploadReceipt } from "../config/upload.js";

const router = Router();

router.get("/health", getHealth);
router.post("/analyze", uploadReceipt.single("receipt"), postAnalyzeReceipt);

export default router;
