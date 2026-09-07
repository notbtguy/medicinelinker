import { ConnectionAnalysis, QuizQuestion } from "../types";
import { findCuratedSynthesis } from "../data/curatedSyntheses";

interface AnalyzeParams {
  subject1: string;
  term1: string;
  subject2: string;
  term2: string;
  focusArea?: string;
}

interface QuizParams {
  term1: string;
  subject1: string;
  term2: string;
  subject2: string;
  coreThesis: string;
}

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

/**
 * Perform interdisciplinary connection analysis.
 * Uses full-stack Gemini AI service (/api/analyze-connection)
 * with authentic peer-reviewed preset matching when applicable.
 */
export async function analyzeMedicalConnection(
  params: AnalyzeParams
): Promise<{ data: ConnectionAnalysis; source: "server" | "curated" }> {
  // 1. Check if this is an exact curated landmark pair
  const curated = findCuratedSynthesis(
    params.term1,
    params.subject1,
    params.term2,
    params.subject2
  );

  // 2. Query the backend server API for live Gemini synthesis
  try {
    const res = await fetch(`${API_BASE}/api/analyze-connection`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      const data: ConnectionAnalysis = await res.json();
      return { data, source: "server" };
    }

    const errJson = await res.json().catch(() => ({}));
    if (curated) {
      return { data: curated.analysis, source: "curated" };
    }
    throw new Error(errJson.error || `Server responded with error status ${res.status}`);
  } catch (netErr: any) {
    if (curated) {
      return { data: curated.analysis, source: "curated" };
    }
    throw new Error(
      netErr?.message || "Failed to reach medical analysis engine. Please ensure your dev server or backend is running."
    );
  }
}

/**
 * Generate a board-style clinical challenge question on this connection
 */
export async function generateMedicalQuiz(
  params: QuizParams
): Promise<QuizQuestion> {
  // 1. Try server endpoint
  try {
    const res = await fetch(`${API_BASE}/api/generate-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      return await res.json();
    }
    const errJson = await res.json().catch(() => ({}));
    const curated = findCuratedSynthesis(params.term1, params.subject1, params.term2, params.subject2);
    if (curated) {
      return curated.quiz;
    }
    throw new Error(errJson.error || `Quiz generation failed with status ${res.status}`);
  } catch (e: any) {
    const curated = findCuratedSynthesis(params.term1, params.subject1, params.term2, params.subject2);
    if (curated) {
      return curated.quiz;
    }
    throw e;
  }
}
