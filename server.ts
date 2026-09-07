import express from "express";
import path from "path";
import dotenv from "dotenv";
import { GoogleGenAI, Type, ThinkingLevel } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { findCuratedSynthesis } from "./src/data/curatedSyntheses";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini client lazily
let genAiClient: GoogleGenAI | null = null;
function getGenAi(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment.");
  }
  if (!genAiClient) {
    genAiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return genAiClient;
}

// Resilient helper: primary gemini-3.1-flash-lite (fast, high quota, low latency), fallback to gemini-3.8-flash
async function generateContentWithFallback(params: {
  contents: string;
  config: any;
}) {
  const ai = getGenAi();
  // gemini-3.1-flash-lite provides reliable sub-4s responses and ample quota without saturation
  const models = ["gemini-3.1-flash-lite", "gemini-3.8-flash"];
  let lastErr: any = null;

  for (const model of models) {
    try {
      const res = await ai.models.generateContent({
        model,
        contents: params.contents,
        config: params.config,
      });

      if (res.text) {
        return res;
      }
    } catch (err: any) {
      console.warn(`[Gemini Engine] Model ${model} encountered an issue:`, err?.status || err?.message || err);
      lastErr = err;
      // Proceed directly to fallback model
    }
  }

  throw lastErr || new Error("Failed to generate content across available models.");
}

// Health check
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Gemini connectivity diagnostic check
app.get("/api/gemini-status", async (_req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY;
  if (!hasKey) {
    res.status(500).json({ status: "error", message: "GEMINI_API_KEY environment variable is not configured." });
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
app.post("/api/analyze-connection", async (req, res) => {
  try {
    const { subject1, term1, subject2, term2, focusArea } = req.body;

    if (!subject1 || !term1 || !subject2 || !term2) {
      res.status(400).json({
        error: "Missing required fields: subject1, term1, subject2, and term2 are required.",
      });
      return;
    }

    const ai = getGenAi();

    const systemInstruction = `You are a Professor of Medicine, Pathophysiologist, and Medical Educator specializing in interdisciplinary medical synthesis across the 19 core medical curriculum subjects:
1. Anatomy
2. Physiology
3. Biochemistry
4. Pathology
5. Pharmacology
6. Microbiology
7. Forensic Medicine & Toxicology (FMT)
8. Community Medicine (PSM)
9. Ophthalmology
10. Otorhinolaryngology (ENT)
11. General Medicine
12. General Surgery
13. Obstetrics & Gynaecology
14. Paediatrics
15. Dermatology, Venereology & Leprosy (DVL)
16. Psychiatry
17. Orthopaedics
18. Radiology
19. Anaesthesiology

Your task is to analyze how ANY TWO medical concepts/terms from two chosen subjects are interconnected through human biology, pathophysiology, anatomical relations, clinical presentation, or therapeutics.
Explain the exact biological cascade and clinical bridge. Even if the two concepts seem remote at first glance, discover the legitimate pathophysiological, anatomical, biochemical, systemic, or syndromic link that joins them (for example: infection causing immune complex deposition leading to vasculitis and joint/skin issues, or a cervical spine lesion affecting autonomic control of the heart, or a medication's adverse effect).

Ensure your analysis is:
- Scientifically accurate, rigorous, and grounded in standard medical science.
- Clear, educational, and engaging for medical students, doctors, and healthcare learners.
- Detailed in the step-by-step bridge pathway so the learner can follow the exact chain of causality from Term 1 to Term 2.`;

    const prompt = `Analyze the interdisciplinary medical connection between:
- Term 1: "${term1}" in the discipline of "${subject1}"
- Term 2: "${term2}" in the discipline of "${subject2}"
${focusArea ? `Emphasize particularly on: ${focusArea}` : ""}

Provide the output strictly in the requested JSON structure.`;

    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            term1: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                term: { type: Type.STRING },
                definition: { type: Type.STRING, description: "Clear, concise 1-2 sentence medical definition" },
              },
              required: ["subject", "term", "definition"],
            },
            term2: {
              type: Type.OBJECT,
              properties: {
                subject: { type: Type.STRING },
                term: { type: Type.STRING },
                definition: { type: Type.STRING, description: "Clear, concise 1-2 sentence medical definition" },
              },
              required: ["subject", "term", "definition"],
            },
            coreThesis: {
              type: Type.STRING,
              description: "A synthesis statement explaining precisely how and why these two concepts connect.",
            },
            connectionStrength: {
              type: Type.STRING,
              description: "Direct Causality, Systemic Cascade, Multifactorial / Syndromic, or Pharmacotherapeutic Bridge",
            },
            bridgePathway: {
              type: Type.ARRAY,
              description: "Ordered 3 to 6 step logical chain starting from Term 1, through intermediate biological/anatomical/clinical waypoints, to Term 2.",
              items: {
                type: Type.OBJECT,
                properties: {
                  stepNumber: { type: Type.INTEGER },
                  title: { type: Type.STRING, description: "Short heading of the step" },
                  subject: { type: Type.STRING, description: "Relevant medical subject for this step" },
                  mechanism: { type: Type.STRING, description: "Detailed biological mechanism or transition" },
                  anatomicalOrBiochemicalKey: { type: Type.STRING, description: "Key vessel, nerve, enzyme, cytokine, or tissue involved" },
                },
                required: ["stepNumber", "title", "subject", "mechanism", "anatomicalOrBiochemicalKey"],
              },
            },
            pathophysiologicalLink: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                keyMoleculesOrSystems: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["title", "description", "keyMoleculesOrSystems"],
            },
            anatomicalStructuralLink: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING },
                structuresInvolved: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["title", "description", "structuresInvolved"],
            },
            clinicalCorrelation: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                presentation: { type: Type.STRING, description: "How a patient with this connection presents clinically" },
                diagnosticClues: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
                riskFactorsOrComplications: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["title", "presentation", "diagnosticClues", "riskFactorsOrComplications"],
            },
            pharmacologicalTherapeuticLink: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                description: { type: Type.STRING, description: "Medications, contraindications, or therapies bridging or affected by both" },
                drugClassesOrInterventions: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                },
              },
              required: ["title", "description", "drugClassesOrInterventions"],
            },
            clinicalCaseVignette: {
              type: Type.OBJECT,
              properties: {
                title: { type: Type.STRING },
                patientAgeGender: { type: Type.STRING, description: "e.g., 46-year-old male" },
                presentingComplaint: { type: Type.STRING },
                investigationFindings: { type: Type.STRING },
                clinicalResolution: { type: Type.STRING, description: "The diagnosis and how understanding this link solved the case" },
              },
              required: ["title", "patientAgeGender", "presentingComplaint", "investigationFindings", "clinicalResolution"],
            },
            highYieldExamPearls: {
              type: Type.ARRAY,
              description: "3 to 4 high-yield academic pearls / USMLE / NEET-PG / PLAB mnemonics or board-tested facts.",
              items: { type: Type.STRING },
            },
            crossSubjectCuriosities: {
              type: Type.ARRAY,
              description: "3 related terms/topics that branching off this connection to explore next.",
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  subject: { type: Type.STRING },
                  whyExplore: { type: Type.STRING },
                },
                required: ["term", "subject", "whyExplore"],
              },
            },
          },
          required: [
            "term1",
            "term2",
            "coreThesis",
            "connectionStrength",
            "bridgePathway",
            "pathophysiologicalLink",
            "anatomicalStructuralLink",
            "clinicalCorrelation",
            "pharmacologicalTherapeuticLink",
            "clinicalCaseVignette",
            "highYieldExamPearls",
            "crossSubjectCuriosities",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response returned from Gemini API");
    }

    const data = JSON.parse(text);
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
app.post("/api/generate-quiz", async (req, res) => {
  try {
    const { term1, subject1, term2, subject2, coreThesis } = req.body;

    const response = await generateContentWithFallback({
      contents: `Create a single challenging high-yield multiple choice clinical case question testing the medical connection between "${term1}" (${subject1}) and "${term2}" (${subject2}). Context: ${coreThesis}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            vignette: { type: Type.STRING },
            question: { type: Type.STRING },
            options: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
            },
            correctAnswerIndex: { type: Type.INTEGER },
            explanation: { type: Type.STRING },
          },
          required: ["vignette", "question", "options", "correctAnswerIndex", "explanation"],
        },
      },
    });

    const data = JSON.parse(response.text || "{}");
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
  if (process.env.NODE_ENV !== "production") {
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

setupServer();
