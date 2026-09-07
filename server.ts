import express from "express";
import path from "path";
import dotenv from "dotenv";
import {
  executeAnalyzeConnection,
  executeGenerateQuiz,
  getGenAi,
} from "./src/lib/geminiBackend";
import { findCuratedSynthesis } from "./src/data/curatedSyntheses";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Health check
app.get(["/api/health", "/health"], (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini connectivity diagnostic check
app.get(["/api/gemini-status", "/gemini-status"], async (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  if (!hasKey) {
    res.status(500).json({
      status: "error",
      message: "GEMINI_API_KEY environment variable is not configured.",
      keyConfigured: false,
    });
    return;
  }
  try {
    const ai = getGenAi();
    const testRes = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "ping",
    });
    res.json({
      status: "healthy",
      model: "gemini-3.1-flash-lite",
      keyConfigured: true,
      testResponse: testRes.text?.trim(),
    });
  } catch (err: any) {
    res.status(502).json({
      status: "degraded",
      message: err?.message || String(err),
      keyConfigured: true,
    });
  }
});

// Analyze connection between two medical terms across the 19 subjects
app.post(["/api/analyze-connection", "/analyze-connection"], async (req, res) => {
  try {
    const { subject1, term1, subject2, term2, focusArea } = req.body || {};

    if (!subject1 || !term1 || !subject2 || !term2) {
      res.status(400).json({
        error: "Missing required fields: subject1, term1, subject2, and term2 are required.",
      });
      return;
    }

    const data = await executeAnalyzeConnection({
      subject1,
      term1,
      subject2,
      term2,
      focusArea,
    });
    res.json(data);
  } catch (err: unknown) {
    console.error("[API Error] analyze-connection:", err);
    const { subject1, term1, subject2, term2 } = req.body || {};
    if (term1 && term2) {
      const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
      if (curated) {
        res.json(curated.analysis);
        return;
      }
    }
    const errorMessage = err instanceof Error ? err.message : "Failed to analyze connection";
    res.status(502).json({
      error: `Live AI connection analysis failed: ${errorMessage}. Please check your API key in Settings > Secrets and try again.`,
    });
  }
});

// Quick clinical challenge / quiz on the connection
app.post(["/api/generate-quiz", "/generate-quiz"], async (req, res) => {
  try {
    const { term1, subject1, term2, subject2, coreThesis } = req.body || {};

    if (!term1 || !subject1 || !term2 || !subject2) {
      res.status(400).json({
        error: "Missing required fields: term1, subject1, term2, and subject2 are required.",
      });
      return;
    }

    const data = await executeGenerateQuiz({
      term1,
      subject1,
      term2,
      subject2,
      coreThesis: coreThesis || "",
    });
    res.json(data);
  } catch (err: unknown) {
    console.error("[API Error] generate-quiz:", err);
    const { term1, subject1, term2, subject2 } = req.body || {};
    if (term1 && term2) {
      const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
      if (curated) {
        res.json(curated.quiz);
        return;
      }
    }
    const errorMessage = err instanceof Error ? err.message : "Failed to generate quiz";
    res.status(502).json({ error: `AI quiz generation failed: ${errorMessage}. Please try again.` });
  }
});

// Setup Vite or static serving
async function setupServer() {
  if (process.env.VERCEL) {
    return;
  }

  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Medical Connection server running at http://localhost:${PORT}`);
  });
}

if (!process.env.VERCEL) {
  setupServer();
}

export default app;
