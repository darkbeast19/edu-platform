// Translation API Route
// Translates quiz questions from English to Hindi using Gemini AI.
// Processes questions in small batches to avoid token-limit issues.
// NOTE: Do NOT add `export const runtime = 'edge'` — sequential awaits inside
//       a for-loop time out on edge. Node.js runtime is used here.

import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; // seconds — available on Vercel Pro/Hobby with Next.js 14+

export async function POST(request) {
  try {
    const { questions, targetLanguage = "Hindi" } = await request.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: "Invalid questions array provided." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      // No API key — return original questions so UI doesn't break
      return Response.json({ translated: questions });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Process in batches of 5 to stay well within token limits and avoid timeouts
    const BATCH_SIZE = 5;
    const translatedQuestions = [];

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);

      const prompt = `Translate these exam questions into ${targetLanguage}.
Return ONLY valid JSON array — no markdown, no backticks, no extra text.

Input:
${JSON.stringify(batch)}

Rules:
- Keep the exact same JSON structure and all keys unchanged.
- Only translate these string fields: "text", "options" (array), "step_by_step", "shortcut", "mistake_reason", "topic".
- If any field is ALREADY in ${targetLanguage}, leave it exactly as-is. Do not change it.
- Keep numbers, formulas, IDs, and booleans exactly as-is.
- "options" must remain a JSON array of strings.
- Output must start with [ and end with ]`;

      try {
        const result = await model.generateContent(prompt);
        let rawText = result.response.text().trim();

        // Strip any markdown fencing
        rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

        // Extract JSON array
        const start = rawText.indexOf("[");
        const end = rawText.lastIndexOf("]");
        if (start === -1 || end === -1) throw new Error("No JSON array found in response");
        rawText = rawText.slice(start, end + 1);

        const parsed = JSON.parse(rawText);

        if (Array.isArray(parsed) && parsed.length === batch.length) {
          translatedQuestions.push(...parsed);
        } else {
          // Partial parse — push what we have, pad with originals
          const safeLength = Math.min(parsed.length, batch.length);
          translatedQuestions.push(...parsed.slice(0, safeLength));
          translatedQuestions.push(...batch.slice(safeLength));
        }
      } catch (batchError) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} translation failed:`, batchError.message);
        // Safe fallback: push original English questions for this batch
        translatedQuestions.push(...batch);
      }
    }

    return Response.json({ translated: translatedQuestions });
  } catch (error) {
    console.error("Translation API error:", error);
    // Return original questions so the UI doesn't break
    return Response.json({ translated: [] }, { status: 500 });
  }
}
