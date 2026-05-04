// Google Translate Free Fallback API
// Extremely fast, no API key needed, dedicated ONLY to translating Quiz Questions & Options
export const runtime = 'edge';

export async function POST(request) {
  try {
    const { questions, targetLanguage = "hi" } = await request.json();

    if (!questions || !Array.isArray(questions) || questions.length === 0) {
      return Response.json({ error: "Invalid questions array" }, { status: 400 });
    }

    const sl = targetLanguage === "hi" ? "en" : "hi";
    const tl = targetLanguage === "hi" ? "hi" : "en";

    // Translate all questions in parallel
    const translatedQuestions = await Promise.all(
      questions.map(async (q) => {
        try {
          // Extract the fields we want to translate
          const textToTranslate = [
            q.text,
            ...(q.options || [])
          ].join(" ||| ");

          const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sl}&tl=${tl}&dt=t&q=${encodeURIComponent(textToTranslate)}`;
          
          const res = await fetch(url);
          if (!res.ok) throw new Error("Google Translate API failed");
          const data = await res.json();
          
          // data[0] is an array of sentence fragments, join them all
          const translatedFullText = data[0].map(item => item[0]).join("");
          
          // Split back by our delimiter
          const parts = translatedFullText.split(/\s*\|\|\|\s*/);
          
          return {
            ...q,
            text: parts[0] || q.text,
            options: parts.slice(1, 1 + (q.options?.length || 4)).length === (q.options?.length || 4) 
                     ? parts.slice(1, 1 + (q.options?.length || 4)) 
                     : q.options // fallback to original options if split fails
          };
        } catch (err) {
          console.error("Single question translate error:", err);
          return q; // Fallback to original question if one fails
        }
      })
    );

    return Response.json({ translated: translatedQuestions });

  } catch (error) {
    console.error("Fatal Google Translate API error:", error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
