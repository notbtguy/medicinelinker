import { GoogleGenAI, Type } from "@google/genai";
import { findCuratedSynthesis } from "../data/curatedSyntheses";
import { ConnectionAnalysis, QuizQuestion } from "../types";

let genAiClient: GoogleGenAI | null = null;

export function getGenAi(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "GEMINI_API_KEY is not configured in the environment. If deploying to Vercel, please add GEMINI_API_KEY in Project Settings > Environment Variables."
    );
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

export async function generateContentWithFallback(params: {
  contents: string;
  config: any;
}) {
  const ai = getGenAi();
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
    }
  }

  throw lastErr || new Error("All Gemini synthesis models were unavailable.");
}

export const SYSTEM_INSTRUCTION = `You are a Professor of Medicine, Pathophysiologist, and Medical Educator specializing in interdisciplinary medical synthesis across the 19 core medical curriculum subjects:
1. Anatomy, 2. Physiology, 3. Biochemistry, 4. Pathology, 5. Pharmacology, 6. Microbiology,
7. Forensic Medicine & Toxicology (FMT), 8. Community Medicine (PSM), 9. Ophthalmology,
10. Otorhinolaryngology (ENT), 11. General Medicine, 12. General Surgery, 13. Obstetrics & Gynaecology,
14. Paediatrics, 15. Dermatology, Venereology & Leprosy (DVL), 16. Psychiatry, 17. Orthopaedics,
18. Radiology, 19. Anaesthesiology.

Your task is to analyze how ANY TWO medical concepts/terms from two chosen subjects are interconnected through human biology, pathophysiology, anatomical relations, clinical presentation, or therapeutics.
Explain the exact biological cascade and clinical bridge. Discover the legitimate pathophysiological, anatomical, biochemical, systemic, or syndromic link that joins them.

Ensure your analysis is:
- Scientifically accurate, rigorous, and grounded in standard medical science.
- Clear, educational, and engaging for medical students, doctors, and healthcare learners.
- Detailed in the step-by-step bridge pathway with real anatomical structures, enzymes, receptors, and clinical findings.`;

export const ANALYZE_RESPONSE_SCHEMA = {
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
      description: "Ordered 3 to 6 step logical chain starting from Term 1 to Term 2.",
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
};

export const QUIZ_RESPONSE_SCHEMA = {
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
};

export async function executeAnalyzeConnection(params: {
  subject1: string;
  term1: string;
  subject2: string;
  term2: string;
  focusArea?: string;
}): Promise<ConnectionAnalysis> {
  const { subject1, term1, subject2, term2, focusArea } = params;

  if (!subject1 || !term1 || !subject2 || !term2) {
    throw new Error("Missing required parameters: subject1, term1, subject2, and term2 are required.");
  }

  const prompt = `Analyze the interdisciplinary medical connection between:
- Term 1: "${term1}" in the discipline of "${subject1}"
- Term 2: "${term2}" in the discipline of "${subject2}"
${focusArea ? `Emphasize particularly on: ${focusArea}` : ""}

Provide the output strictly in the requested JSON structure.`;

  try {
    const response = await generateContentWithFallback({
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        responseMimeType: "application/json",
        responseSchema: ANALYZE_RESPONSE_SCHEMA,
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response returned from Gemini API");
    }

    return JSON.parse(text) as ConnectionAnalysis;
  } catch (err) {
    // If Gemini fails, check if an authentic curated preset exists
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return curated.analysis;
    }
    throw err;
  }
}

export async function executeGenerateQuiz(params: {
  term1: string;
  subject1: string;
  term2: string;
  subject2: string;
  coreThesis: string;
}): Promise<QuizQuestion> {
  const { term1, subject1, term2, subject2, coreThesis } = params;

  try {
    const response = await generateContentWithFallback({
      contents: `Create a single challenging high-yield multiple choice clinical case question testing the medical connection between "${term1}" (${subject1}) and "${term2}" (${subject2}). Context: ${coreThesis}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: QUIZ_RESPONSE_SCHEMA,
      },
    });

    const data = JSON.parse(response.text || "{}");
    return data as QuizQuestion;
  } catch (err) {
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return curated.quiz;
    }
    throw err;
  }
}
