import { executeAnalyzeConnection } from "../src/lib/geminiBackend";
import { findCuratedSynthesis } from "../src/data/curatedSyntheses";

export default async function handler(req: any, res: any) {
  // Enable CORS
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS,PATCH,DELETE,POST,PUT");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed. Use POST." });
  }

  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch {
      return res.status(400).json({ error: "Invalid JSON body provided." });
    }
  }
  body = body || {};

  const { subject1, term1, subject2, term2, focusArea } = body;

  if (!subject1 || !term1 || !subject2 || !term2) {
    return res.status(400).json({
      error: "Missing required parameters: subject1, term1, subject2, and term2 are required.",
    });
  }

  // Check if GEMINI_API_KEY is configured
  if (!process.env.GEMINI_API_KEY) {
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return res.status(200).json(curated.analysis);
    }
    return res.status(401).json({
      error:
        "GEMINI_API_KEY environment variable is not configured in your Vercel project. Please go to Vercel Dashboard > Project Settings > Environment Variables, add GEMINI_API_KEY, and redeploy.",
    });
  }

  try {
    const analysis = await executeAnalyzeConnection({
      subject1,
      term1,
      subject2,
      term2,
      focusArea,
    });
    return res.status(200).json(analysis);
  } catch (err: any) {
    console.error("[Vercel API] analyze-connection error:", err);
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return res.status(200).json(curated.analysis);
    }
    const message = err?.message || "Failed to analyze connection.";
    return res.status(502).json({
      error: `AI Synthesis Error: ${message}`,
    });
  }
}
