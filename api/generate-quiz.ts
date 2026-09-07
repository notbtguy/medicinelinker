import { executeGenerateQuiz } from "../src/lib/geminiBackend";
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

  const { term1, subject1, term2, subject2, coreThesis } = body;

  if (!term1 || !subject1 || !term2 || !subject2) {
    return res.status(400).json({
      error: "Missing required parameters: term1, subject1, term2, and subject2 are required.",
    });
  }

  if (!process.env.GEMINI_API_KEY) {
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return res.status(200).json(curated.quiz);
    }
    return res.status(401).json({
      error:
        "GEMINI_API_KEY environment variable is not configured in your Vercel project. Please add GEMINI_API_KEY in Vercel Settings > Environment Variables.",
    });
  }

  try {
    const quiz = await executeGenerateQuiz({
      term1,
      subject1,
      term2,
      subject2,
      coreThesis: coreThesis || "",
    });
    return res.status(200).json(quiz);
  } catch (err: any) {
    console.error("[Vercel API] generate-quiz error:", err);
    const curated = findCuratedSynthesis(term1, subject1, term2, subject2);
    if (curated) {
      return res.status(200).json(curated.quiz);
    }
    return res.status(502).json({
      error: `AI Quiz Error: ${err?.message || "Failed to generate quiz"}`,
    });
  }
}
