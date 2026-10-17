export const LABD_API_URL = process.env.LABD_API_URL?.trim() || "https://agent.thedevlabs.io/v1/api/chat";
export const LABD_API_KEY = (process.env.LABD_API_KEY || "").trim();

export function hasLabdApiKey() {
  return LABD_API_KEY.length > 0;
}

export function buildLabdPrompt(file) {
  const fileName = file.originalname || "receipt";

  return [
    "Extract the receipt line items and totals from this restaurant bill.",
    "Return valid JSON only with this shape:",
    '{"items":[{"name":"string","price":number,"icon":"emoji"}],"taxRate":number,"tipRate":number}',
    `File name: ${fileName}`,
    "Use realistic item names and prices in USD.",
    "If the receipt is partially unreadable, return a sensible restaurant-bill fallback.",
  ].join("\n");
}
