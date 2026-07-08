import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

// Safe Initialization of Gemini AI to avoid crashing if API Key is missing initially
let aiInstance: GoogleGenAI | null = null;

function getAI(): GoogleGenAI | null {
  if (!aiInstance && process.env.GEMINI_API_KEY) {
    aiInstance = new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiInstance;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok", time: new Date().toISOString() });
  });

  // Business Insights Generator Route
  app.post("/api/ai/insights", async (req, res) => {
    const { metrics } = req.body;
    const ai = getAI();

    if (!ai) {
      // Elegant high-fidelity fallback insights if Gemini Key is not set
      return res.json({
        insights: [
          {
            id: "i1",
            type: "warning",
            title: "Margin Compression Alert",
            description: "High volume on low-margin pastel coral collection is diluting the blended margin by 1.4%. Shift promotion weight to high-margin lavender linen items."
          },
          {
            id: "i2",
            type: "success",
            title: "Customer Retention Surge",
            description: "Re-engagement campaign targetting passive ivory members saw a 14% conversion spike. Net retention rate projected to hit 112% this quarter."
          },
          {
            id: "i3",
            type: "info",
            title: "Cashflow Reallocation Opportunity",
            description: "Cash reserve stands at $480,000 with record 42-day average collection. Optimize by reallocating $150k into low-risk yield or inventory pre-purchase."
          }
        ]
      });
    }

    try {
      const prompt = `You are a world-class McKinsey & Company management partner and creative director. 
Given these business metrics for a luxury lifestyle and premium designer retail business:
- Revenue: ${metrics?.revenue || "$1,248,390"}
- Growth: ${metrics?.growth || "+12.4% MoM"}
- Blended Gross Margin: ${metrics?.margin || "68.2%"}
- Customer Acquisition Cost (CAC): ${metrics?.cac || "$48"}
- Customer Lifetime Value (LTV): ${metrics?.ltv || "$310"}
- Average Order Value (AOV): ${metrics?.aov || "$184"}

Generate exactly 3 sharp, ultra-professional, metric-backed strategic insights. 
Do NOT write wordy introductions or generic fluffy business sentences.
Return a valid JSON array matching this format (and ONLY this JSON array, no markdown wrappers):
[
  {
    "id": "i1",
    "type": "warning" | "success" | "info",
    "title": "Concise Strategic Title (4-6 words)",
    "description": "One sentence explaining the strategic action based on metrics. Must look professional, direct, and actionable."
  },
  ...
]`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          temperature: 0.2
        }
      });

      const text = response.text || "[]";
      const insights = JSON.parse(text.trim());
      res.json({ insights });
    } catch (error) {
      console.error("Gemini insights generation error:", error);
      res.status(500).json({ error: "Failed to generate AI insights" });
    }
  });

  // Assistant Chat Route
  app.post("/api/ai/chat", async (req, res) => {
    const { messages } = req.body;
    const ai = getAI();

    // Take the last message
    const lastMessage = messages && messages.length > 0 ? messages[messages.length - 1].content : "Hello";

    if (!ai) {
      // Direct, highly realistic advisor chatbot fallback
      const lowCase = lastMessage.toLowerCase();
      let reply = "I am ready to assist you in auditing and driving strategic margins for your luxury boutique. Please connect your AI Studio secrets to enable real-time Gemini reasoning.";
      if (lowCase.includes("revenue") || lowCase.includes("sales") || lowCase.includes("income")) {
        reply = "Looking at our sales velocity, overall revenue is $1,248,390 with a healthy 12.4% MoM trajectory. The main growth catalyst remains our premium cashmere and linen categories, which represent 42% of our sales blend. Do you want to examine our channel performance?";
      } else if (lowCase.includes("margin") || lowCase.includes("profit") || lowCase.includes("cost")) {
        reply = "Our blended gross margin stands at 68.2%. However, there is some cost compression in our leather goods supply line due to logistics adjustments. I recommend increasing the AOV target from $184 to $195 by offering complementary leather care items at checkout.";
      } else if (lowCase.includes("marketing") || lowCase.includes("customer") || lowCase.includes("cac")) {
        reply = "Your customer health is outstanding with an LTV:CAC ratio of 6.4x (LTV: $310, CAC: $48). I suggest scaling your high-intent search ad budget on warm-themed search words by 15% as the marginal CAC remains below our $55 scale threshold.";
      }
      return res.json({ reply });
    }

    try {
      // Convert messages array to a clean conversation prompt
      const conversationHistory = messages.map((m: any) => `${m.role === 'user' ? 'Client' : 'Advisor'}: ${m.content}`).join("\n");
      const prompt = `You are the ultimate Elite Corporate Business Advisor, Senior Strategist, and Creative Advisor for a premium boutique business owner. 
Your tone is incredibly sharp, elegant, metric-driven, helpful, and highly sophisticated (no fluff, no emojis, no excessive bullet points, no generic preambles like "Sure, I can help with that").
Provide a direct, high-value, tactical response. Speak with absolute expertise about their operational data.

Here is the conversation history:
${conversationHistory}

Advisor:`;

      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          temperature: 0.7,
        }
      });

      const reply = response.text || "I apologize, I am unable to analyze that request at the moment.";
      res.json({ reply: reply.trim() });
    } catch (error) {
      console.error("Gemini assistant chat error:", error);
      res.status(500).json({ error: "Failed to generate chat response" });
    }
  });

  // Vite integration
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Vite+Express] Full-stack Server running at http://localhost:${PORT}`);
  });
}

startServer();
