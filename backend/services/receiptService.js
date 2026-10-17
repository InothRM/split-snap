import { hasLabdApiKey, LABD_API_URL, buildLabdPrompt } from "../config/labd.js";

const mockAnalysis = {
  items: [
    { name: "Avocado toast", price: 14, icon: "🥑" },
    { name: "Truffle fries", price: 9.5, icon: "🍟" },
    { name: "Margherita pizza", price: 18, icon: "🍕" },
    { name: "Iced matcha latte", price: 6.5, icon: "🍵" },
  ],
  taxRate: 0.085,
  tipRate: 18,
};

function isUsableJsonResponse(value) {
  return value && typeof value === "object" && Array.isArray(value.items);
}

export async function analyzeReceipt(file) {
  if (!hasLabdApiKey()) {
    return {
      fileName: file.originalname,
      ...mockAnalysis,
      source: "mock",
    };
  }

  try {
    const response = await fetch(LABD_API_URL, {
      method: "POST",
      headers: {
        Authorization: process.env.LABD_API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messages: [
          {
            role: "user",
            content: buildLabdPrompt(file),
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Labd API error: ${response.status}`);
    }

    const payload = await response.json();
    const content = payload?.message?.content ?? payload?.content ?? payload;
    const parsed = typeof content === "string" ? JSON.parse(content) : content;

    if (!isUsableJsonResponse(parsed)) {
      throw new Error("Labd API returned an unexpected format.");
    }

    return {
      fileName: file.originalname,
      items: parsed.items.map((item) => ({
        name: item.name ?? "Unknown item",
        price: Number(item.price ?? 0),
        icon: item.icon ?? "🍽️",
      })),
      taxRate: Number(parsed.taxRate ?? 0.085),
      tipRate: Number(parsed.tipRate ?? 18),
      source: "labd",
    };
  } catch (error) {
    console.warn("Labd AI analysis failed; falling back to mock data:", error.message || error);
    return {
      fileName: file.originalname,
      ...mockAnalysis,
      source: "mock-fallback",
    };
  }
}
