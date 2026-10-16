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

export function analyzeReceipt(file) {
  return {
    fileName: file.originalname,
    ...mockAnalysis,
  };
}
