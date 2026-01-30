import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();

// ===== Middleware =====
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ===== Gemini Setup =====
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

const MODEL = "gemini-2.5-flash";

// ===== Chat Endpoint =====
app.post("/api/chat", async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages)) {
      return res.status(400).json({
        error: "messages harus berupa array"
      });
    }

    const contents = [
      {
        role: "system",
        parts: [
          {
            text: "Kamu adalah asisten AI yang ramah dan SELALU menjawab dalam Bahasa Indonesia yang sopan dan jelas."
          }
        ]
      },
      ...messages.map(m => ({
        role: m.role,
        parts: [{ text: m.content }]
      }))
    ];

    const result = await ai.models.generateContent({
      model: MODEL,
      contents
    });

    const reply =
      result?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    res.json({ reply });

  } catch (err) {
    console.error("❌ ERROR:", err);
    res.status(500).json({
      error: "Terjadi kesalahan pada server"
    });
  }
});

// ===== Start Server =====
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server jalan di http://localhost:${PORT}`);
});
