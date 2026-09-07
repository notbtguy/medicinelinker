import { getGenAi } from "../src/lib/geminiBackend";

export default async function handler(_req: any, res: any) {
  res.setHeader("Access-Control-Allow-Origin", "*");

  const hasKey = !!process.env.GEMINI_API_KEY;
  if (!hasKey) {
    return res.status(200).json({
      status: "missing_key",
      message: "GEMINI_API_KEY environment variable is not configured in Vercel Settings > Environment Variables.",
      keyConfigured: false,
    });
  }

  try {
    const ai = getGenAi();
    const testRes = await ai.models.generateContent({
      model: "gemini-3.1-flash-lite",
      contents: "Ping! Respond with only the word Pong!",
    });

    return res.status(200).json({
      status: "healthy",
      model: "gemini-3.1-flash-lite",
      keyConfigured: true,
      testResponse: testRes.text?.trim() || "OK",
    });
  } catch (err: any) {
    return res.status(500).json({
      status: "error",
      keyConfigured: true,
      error: err?.message || "Failed to reach Gemini API",
    });
  }
}
