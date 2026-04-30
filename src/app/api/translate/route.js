import { NextResponse } from "next/server";

export const maxDuration = 60; // seconds

// Helper function to translate text using Google Translate API
async function googleTranslate(text, targetLangCode) {
  if (!text) return text;
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${targetLangCode}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      return data[0].map(x => x[0]).join('');
    }
    return text;
  } catch (error) {
    console.error("Google Translate error for text:", text, error);
    return text; // Fallback to original text on error
  }
}

export async function POST(request) {
  try {
    const { questions, targetLanguage = "Hindi" } = await request.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return NextResponse.json({ error: "Invalid questions array" }, { status: 400 });
    }

    const targetLangCode = targetLanguage === "Hindi" ? "hi" : "en";
    
    // If target is English, just return original
    if (targetLangCode === "en") {
      return NextResponse.json({ translated: questions });
    }

    const translatedQuestions = [];

    for (const q of questions) {
      // Translate each string field
      const translatedQ = { ...q };
      
      if (q.text) translatedQ.text = await googleTranslate(q.text, targetLangCode);
      if (q.step_by_step) translatedQ.step_by_step = await googleTranslate(q.step_by_step, targetLangCode);
      if (q.shortcut) translatedQ.shortcut = await googleTranslate(q.shortcut, targetLangCode);
      if (q.mistake_reason) translatedQ.mistake_reason = await googleTranslate(q.mistake_reason, targetLangCode);
      if (q.topic) translatedQ.topic = await googleTranslate(q.topic, targetLangCode);
      
      if (q.options && Array.isArray(q.options)) {
        translatedQ.options = await Promise.all(
          q.options.map(opt => googleTranslate(opt, targetLangCode))
        );
      }
      
      translatedQuestions.push(translatedQ);
    }

    return NextResponse.json({ translated: translatedQuestions });

  } catch (error) {
    console.error("Fatal Translation API error:", error);
    return NextResponse.json({ translated: [] }, { status: 500 });
  }
}
