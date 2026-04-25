import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
  try {
    const { questions, targetLanguage = "Hindi" } = await request.json();

    if (!questions || !Array.isArray(questions)) {
      return Response.json({ error: "Invalid questions array provided." }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return Response.json({ error: "GEMINI_API_KEY is not configured." }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Since questions can be large, we'll give explicit format instructions
    const prompt = `You are a professional educational translator specializing in Indian Competitive Exams.
Translate the following array of JSON question objects perfectly from English into ${targetLanguage}.
Use appropriate formal academic vocabulary used in exams. Keep math formulas and numbers intact.

Here is the source JSON array:
${JSON.stringify(questions, null, 2)}

RULES:
1. Return EXACTLY the same JSON structure holding the translated content.
2. Only translate string values (text, options, step_by_step, shortcut, mistake_reason). Do not translate keys or IDs!
3. "options" is an array of strings, translate each element.
4. Output NOTHING EXCEPT the raw JSON array. No markdown, no conversational text.
`;

    const result = await model.generateContent(prompt);
    let rawText = result.response.text().trim();

    // Strip markdown code blocks if present
    rawText = rawText
      .replace(/^```(?:json)?\s*/i, "")
      .replace(/\s*```\s*$/i, "")
      .trim();

    const arrayStart = rawText.indexOf("[");
    const arrayEnd = rawText.lastIndexOf("]");
    if (arrayStart !== -1 && arrayEnd !== -1) {
      rawText = rawText.slice(arrayStart, arrayEnd + 1);
    }

    const translatedQuestions = JSON.parse(rawText);

    return Response.json({ translated: translatedQuestions });
  } catch (error) {
    console.error("Translation error:", error);
    return Response.json({ error: "Failed to translate questions." }, { status: 500 });
  }
}
