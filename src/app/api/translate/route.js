// Translation API Route
// Translates quiz questions from English to Hindi using Gemini AI.
// Processes questions in small batches to avoid token-limit issues.
// NOTE: Do NOT add `export const runtime = 'edge'` — sequential awaits inside
//       a for-loop time out on edge. Node.js runtime is used here.

import { GoogleGenerativeAI } from "@google/generative-ai";

export const maxDuration = 60; // seconds

export async function POST(request) {
  try {
    const { questions, targetLanguage = "Hindi" } = await request.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: "Invalid questions array" }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ translated: questions });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Process in tiny batches of 3 to prevent timeouts and JSON formatting errors
    const BATCH_SIZE = 3;
    const translatedQuestions = [];

    const isToHindi = targetLanguage === "Hindi";
    const sourceLanguage = isToHindi ? "English" : "Hindi";

    for (let i = 0; i < questions.length; i += BATCH_SIZE) {
      const batch = questions.slice(i, i + BATCH_SIZE);

      const prompt = `You are a professional translator. Translate the following exam questions from ${sourceLanguage} to ${targetLanguage}.
CRITICAL INSTRUCTIONS:
- You must reply ONLY with a valid JSON array.
- DO NOT wrap the JSON in markdown formatting (no \`\`\`json).
- Translate ONLY these string fields: "text", "options" (array), "step_by_step", "shortcut", "mistake_reason", "topic".
- KEEP all numbers, math symbols, IDs, and boolean values exactly as they are.

JSON to translate:
${JSON.stringify(batch)}`;

      try {
        const result = await model.generateContent(prompt);
        let rawText = result.response.text().trim();
        
        // Aggressively clean the AI response to ensure valid JSON
        rawText = rawText.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();
        
        const start = rawText.indexOf("[");
        const end = rawText.lastIndexOf("]");
        
        if (start === -1 || end === -1) throw new Error("No JSON array bounds found");
        rawText = rawText.slice(start, end + 1);

        const parsed = JSON.parse(rawText);
        
        if (Array.isArray(parsed) && parsed.length > 0) {
          translatedQuestions.push(...parsed);
        } else {
          translatedQuestions.push(...batch);
        }
      } catch (err) {
        console.error(`Batch ${Math.floor(i / BATCH_SIZE) + 1} translation failed:`, err.message);
        // Fallback to original text for this tiny batch if it completely fails
        translatedQuestions.push(...batch);
      }
    }

    // Ensure we return exactly the same number of questions
    const safeTranslated = translatedQuestions.slice(0, questions.length);
    return Response.json({ translated: safeTranslated });

  } catch (error) {
    console.error("Fatal Translation API error:", error);
    return Response.json({ translated: [] }, { status: 500 });
  }
}
