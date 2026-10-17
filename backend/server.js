import "dotenv/config";
import express from "express";
import { fileURLToPath } from "node:url";
import receiptRoutes from "./routes/receiptRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

const app = express();

app.use(express.json({ limit: "1mb" }));
app.use("/api", receiptRoutes);
app.use(errorHandler);

export default app;

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const port = Number(process.env.PORT) || 3001;

  app.listen(port, () => {
    console.log(`Split Snap API listening on http://localhost:${port}`);
  });
}
