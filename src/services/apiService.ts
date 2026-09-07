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
 * Supports full-stack Express backend, Vercel Serverless Functions,
 * and peer-reviewed landmark cases.
 */
export async function analyzeMedicalConnection(
  params: AnalyzeParams
): Promise<{ data: ConnectionAnalysis; source: "server" | "curated" }> {
  // Check if this is an authentic curated landmark pair
  const curated = findCuratedSynthesis(
    params.term1,
    params.subject1,
    params.term2,
    params.subject2
  );

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

    // Try parsing structured error
    let errorDetail = "";
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) {
        errorDetail = errJson.error;
      }
    } catch {
      // Body was not JSON
    }

    // If a curated landmark case exists, fall back to it gracefully
    if (curated) {
      return { data: curated.analysis, source: "curated" };
    }

    if (!errorDetail) {
      if (res.status === 404) {
        errorDetail =
          "The API endpoint (/api/analyze-connection) returned 404 Not Found. If running on Vercel, ensure you pushed the latest vercel.json and /api directory.";
      } else if (res.status === 500) {
        errorDetail =
          "The backend server or Vercel function encountered a 500 error. Please verify GEMINI_API_KEY is configured under Project Settings > Environment Variables in Vercel.";
      } else {
        errorDetail = `Server responded with error status ${res.status}.`;
      }
    }

    throw new Error(errorDetail);
  } catch (netErr: any) {
    if (curated) {
      return { data: curated.analysis, source: "curated" };
    }
    throw new Error(
      netErr?.message ||
        "Failed to reach medical analysis engine. Please ensure your dev server or backend is running."
    );
  }
}

/**
 * Generate a board-style clinical challenge question on this connection
 */
export async function generateMedicalQuiz(
  params: QuizParams
): Promise<QuizQuestion> {
  const curated = findCuratedSynthesis(
    params.term1,
    params.subject1,
    params.term2,
    params.subject2
  );

  try {
    const res = await fetch(`${API_BASE}/api/generate-quiz`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    if (res.ok) {
      return await res.json();
    }

    let errorDetail = "";
    try {
      const errJson = await res.json();
      if (errJson && errJson.error) {
        errorDetail = errJson.error;
      }
    } catch {
      // Body not JSON
    }

    if (curated) {
      return curated.quiz;
    }

    throw new Error(errorDetail || `Quiz generation failed with status ${res.status}`);
  } catch (e: any) {
    if (curated) {
      return curated.quiz;
    }
    throw e;
  }
}
