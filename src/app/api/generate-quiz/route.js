// AI Question Generation API Route
// ARCHITECTURE:
//  - Hindi (hi): Skip DB entirely → Gemini generates ALL questions natively in Hindi (1 call, ~3-4s)
//  - English (en): DB first → Gemini fills gaps → static fallback
// This design eliminates translation timeouts completely.

import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { topic = "General Knowledge", difficulty = "Intermediate", count = 10, language = "en" } = await request.json();
    const numQuestions = Math.min(Math.max(parseInt(count) || 10, 1), 50);
    const isHindi = language === "hi";

    // ══════════════════════════════════════════════════════════════════════════
    // HINDI PATH: Generate ALL questions natively in Hindi via Gemini (1 call)
    // Bypasses DB entirely — no translation needed, no timeout risk.
    // ══════════════════════════════════════════════════════════════════════════
    if (isHindi) {
      if (process.env.GEMINI_API_KEY) {
        try {
          const { GoogleGenerativeAI } = await import("@google/generative-ai");
          const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
          const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

          const prompt = `आप भारतीय प्रतियोगी परीक्षाओं (SSC, Railway, Banking, UPSC) के विशेषज्ञ परीक्षा-निर्माता हैं।
विषय: "${topic}" पर कठिनाई: "${difficulty}" के अनुसार ठीक ${numQuestions} बहुविकल्पीय प्रश्न बनाएं।

महत्वपूर्ण नियम:
- सभी प्रश्न, विकल्प, स्पष्टीकरण पूरी तरह HINDI (देवनागरी लिपि) में लिखें।
- केवल संख्याएं, सूत्र, और गणितीय चिह्न अंग्रेजी में रह सकते हैं।
- ONLY a valid JSON array return करें। कोई markdown, backticks, या extra text नहीं।

प्रत्येक प्रश्न का format:
[
  {
    "id": 1,
    "topic": "${topic}",
    "text": "प्रश्न का पूरा पाठ?",
    "options": ["विकल्प A", "विकल्प B", "विकल्प C", "विकल्प D"],
    "correct": 0,
    "step_by_step": "चरण-दर-चरण हल",
    "shortcut": "त्वरित शॉर्टकट ट्रिक",
    "mistake_reason": "छात्र क्यों गलती करते हैं"
  }
]

- "correct" एक integer 0-3 होना चाहिए (options array में सही उत्तर का index)।
- सभी ${numQuestions} अद्वितीय प्रश्न बनाएं।`;

          const result = await model.generateContent(prompt);
          let rawText = result.response.text().trim()
            .replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

          const start = rawText.indexOf("[");
          const end = rawText.lastIndexOf("]");
          if (start !== -1 && end !== -1) {
            const parsed = JSON.parse(rawText.slice(start, end + 1));
            if (Array.isArray(parsed) && parsed.length > 0) {
              // Ensure we have exactly numQuestions, pad with Hindi fallback if needed
              const questions = parsed.slice(0, numQuestions).map((q, i) => ({ ...q, id: i + 1 }));
              if (questions.length >= numQuestions) {
                return Response.json({ questions, source: "ai_hindi", originalLanguage: "hi" });
              }
              // Pad with fallback if AI returned fewer than needed
              const fallback = buildFallbackQuestions(topic, numQuestions - questions.length, true);
              const combined = [...questions, ...fallback].slice(0, numQuestions).map((q, i) => ({ ...q, id: i + 1 }));
              return Response.json({ questions: combined, source: "ai_hindi_padded", originalLanguage: "hi" });
            }
          }
        } catch (aiErr) {
          console.error("Hindi AI generation failed:", aiErr.message);
        }
      }

      // Hindi AI failed → use static Hindi fallback bank
      const hindiFallback = buildFallbackQuestions(topic, numQuestions, true);
      return Response.json({ questions: hindiFallback, source: "fallback_hindi", originalLanguage: "hi" });
    }

    // ══════════════════════════════════════════════════════════════════════════
    // ENGLISH PATH: DB first → Gemini fills gaps → static fallback
    // ══════════════════════════════════════════════════════════════════════════
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    let dbQuestions = [];

    if (topic && topic.length > 0) {
      try {
        const requestedTopics = topic.split(",").map(s => s.trim());

        const { data: matchedSubjects } = await supabase
          .from("subjects")
          .select("id, name")
          .in("name", requestedTopics);

        if (matchedSubjects && matchedSubjects.length > 0) {
          const subjectIds = matchedSubjects.map(s => s.id);

          const { data: matchedTopics } = await supabase
            .from("topics")
            .select("id, name, subject_id")
            .in("subject_id", subjectIds);

          if (matchedTopics && matchedTopics.length > 0) {
            const topicIds = matchedTopics.map(t => t.id);

            let answeredIds = new Set();
            if (user) {
              const { data: pastAnswers } = await supabase
                .from("user_answers")
                .select("question_id")
                .eq("user_id", user.id);
              if (pastAnswers) {
                pastAnswers.forEach(a => answeredIds.add(a.question_id));
              }
            }

            const { data: fetchedQuestions } = await supabase
              .from("questions")
              .select("*")
              .in("topic_id", topicIds)
              .limit(1000);

            if (fetchedQuestions && fetchedQuestions.length > 0) {
              let candidateQuestions = fetchedQuestions.filter(q => !answeredIds.has(q.id));

              const seen = new Set();
              const unique = candidateQuestions.filter(q => {
                const key = q.question_text?.trim().toLowerCase();
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
              });

              for (let i = unique.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [unique[i], unique[j]] = [unique[j], unique[i]];
              }

              const selected = unique.slice(0, numQuestions);

              dbQuestions = selected.map((q, i) => {
                const topicRef = matchedTopics.find(t => t.id === q.topic_id);
                let correctIndex = 0;
                if (q.correct_option === "A") correctIndex = 0;
                if (q.correct_option === "B") correctIndex = 1;
                if (q.correct_option === "C") correctIndex = 2;
                if (q.correct_option === "D") correctIndex = 3;

                return {
                  id: q.id || i + 1,
                  topic: topicRef ? topicRef.name : topic,
                  text: q.question_text,
                  options: [q.option_a, q.option_b, q.option_c, q.option_d],
                  correct: correctIndex,
                  step_by_step: q.explanation || "Detailed solution is not available for this question.",
                  shortcut: null,
                  mistake_reason: null
                };
              });

              // If DB has exactly enough questions, return immediately
              if (dbQuestions.length >= numQuestions) {
                return Response.json({ questions: dbQuestions.slice(0, numQuestions), source: "database", originalLanguage: "en" });
              }
            }
          }
        }
      } catch (dbError) {
        console.error("Database fetch failed:", dbError);
      }
    }

    // Fill remaining with Gemini (English)
    if (process.env.GEMINI_API_KEY) {
      try {
        const { GoogleGenerativeAI } = await import("@google/generative-ai");
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        const needed = numQuestions - dbQuestions.length;
        const prompt = `You are an expert exam setter for Indian competitive exams (SSC, Railway, Banking).
Generate exactly ${needed} multiple choice questions on the topic: "${topic}" at difficulty: "${difficulty}".
Generate in English.

RULES:
- Return ONLY a JSON array. No explanations, no markdown, no triple backticks.
- Each object must match this exact structure:

[
  {
    "id": 1,
    "topic": "${topic}",
    "text": "Full question text here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0,
    "step_by_step": "Detailed step-by-step solution",
    "shortcut": "Quick trick or shortcut",
    "mistake_reason": "Why students commonly get this wrong"
  }
]

- "correct" must be an integer 0-3 (index of the correct option in the options array).
- Generate all ${needed} unique questions.`;

        const result = await model.generateContent(prompt);
        let rawText = result.response.text().trim()
          .replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "").trim();

        const arrayStart = rawText.indexOf("[");
        const arrayEnd = rawText.lastIndexOf("]");
        if (arrayStart !== -1 && arrayEnd !== -1) {
          const aiQuestions = JSON.parse(rawText.slice(arrayStart, arrayEnd + 1));
          if (Array.isArray(aiQuestions) && aiQuestions.length > 0) {
            const combined = [...dbQuestions];
            for (const aiQ of aiQuestions) {
              if (combined.length >= numQuestions) break;
              combined.push({ ...aiQ, id: combined.length + 1 });
            }
            
            // Pad if AI returned fewer than requested
            if (combined.length < numQuestions) {
              const fallbackBank = buildFallbackQuestions(topic, numQuestions - combined.length, false);
              for (const fQ of fallbackBank) {
                if (combined.length >= numQuestions) break;
                combined.push({ ...fQ, id: combined.length + 1 });
              }
              return Response.json({ questions: combined, source: "ai_padded", originalLanguage: "en" });
            }

            return Response.json({ questions: combined, source: dbQuestions.length > 0 ? "db_and_ai" : "ai", originalLanguage: "en" });
          }
        }
      } catch (aiError) {
        console.error("AI generation failed:", aiError.message);
      }
    }

    // Static fallback (English)
    const fallbackBank = buildFallbackQuestions(topic, numQuestions, false);
    const combined = [...dbQuestions];
    for (const fQ of fallbackBank) {
      if (combined.length >= numQuestions) break;
      combined.push({ ...fQ, id: combined.length + 1 });
    }
    return Response.json({ questions: combined, source: "fallback", originalLanguage: "en" });

  } catch (error) {
    console.error("Quiz generation error:", error);
    return Response.json({ error: "Failed to generate questions" }, { status: 500 });
  }
}

// ── Fallback question builder ─────────────────────────────────────────────
function buildFallbackQuestions(topic, count, isHindi = false) {
  const BANK_HI = [
    {
      id: 1, topic: "अनुपात और समानुपात",
      text: "यदि A:B = 2:3 और B:C = 4:5, तो A:B:C क्या होगा?",
      options: ["8:12:15", "2:3:5", "8:15:12", "6:12:15"], correct: 0,
      step_by_step: "A:B को 4 से गुणा करें → 8:12। B:C को 3 से गुणा करें → 12:15। संयुक्त: 8:12:15",
      shortcut: "(2×4):(3×4):(3×5) = 8:12:15",
      mistake_reason: "छात्र अनुपातों को सीधे जोड़ने की कोशिश करते हैं।"
    },
    {
      id: 2, topic: "प्रतिशत",
      text: "एक संख्या पहले 20% बढ़ाई जाती है, फिर 10% घटाई जाती है। शुद्ध परिवर्तन क्या होगा?",
      options: ["8% वृद्धि", "10% वृद्धि", "12% वृद्धि", "कोई परिवर्तन नहीं"], correct: 0,
      step_by_step: "100 → +20% → 120 → -10% → 108। शुद्ध परिवर्तन = +8%",
      shortcut: "शुद्ध% = 20 - 10 - (20×10)/100 = 8% वृद्धि",
      mistake_reason: "20% और -10% को सीधे जोड़ना गलत है।"
    },
    {
      id: 3, topic: "समय और कार्य",
      text: "A एक काम 10 दिन में, B 15 दिन में कर सकता है। दोनों मिलकर कितने दिन में करेंगे?",
      options: ["5 दिन", "6 दिन", "8 दिन", "12 दिन"], correct: 1,
      step_by_step: "(10×15)/(10+15) = 150/25 = 6 दिन",
      shortcut: "सूत्र: (a×b)/(a+b)",
      mistake_reason: "दरों को जोड़ने के बजाय दिनों को जोड़ देना।"
    },
    {
      id: 4, topic: "सामान्य ज्ञान",
      text: "भारतीय संविधान का कौन सा अनुच्छेद अस्पृश्यता को समाप्त करता है?",
      options: ["अनुच्छेद 14", "अनुच्छेद 17", "अनुच्छेद 21", "अनुच्छेद 32"], correct: 1,
      step_by_step: "अनुच्छेद 17 अस्पृश्यता को समाप्त करता है।",
      shortcut: "17 → अस्पृश्यता समाप्ति।",
      mistake_reason: "अनुच्छेद 14 (कानून के समक्ष समता) से भ्रमित होना।"
    },
    {
      id: 5, topic: "सामान्य ज्ञान",
      text: "'भारत की खोज' पुस्तक किसने लिखी?",
      options: ["महात्मा गांधी", "जवाहरलाल नेहरू", "सुभाष चंद्र बोस", "लाल बहादुर शास्त्री"], correct: 1,
      step_by_step: "जवाहरलाल नेहरू ने 1944 में 'भारत की खोज' लिखी।",
      shortcut: "नेहरू → भारत की खोज।",
      mistake_reason: "स्वतंत्रता नेताओं की पुस्तकों को ध्यान से पढ़ें।"
    },
    {
      id: 6, topic: "सरल ब्याज",
      text: "₹5000 पर 8% वार्षिक दर से 3 वर्ष का साधारण ब्याज कितना होगा?",
      options: ["₹1000", "₹1200", "₹1500", "₹1800"], correct: 1,
      step_by_step: "SI = (P×R×T)/100 = (5000×8×3)/100 = 1200",
      shortcut: "5000 × 8% × 3 = ₹1200",
      mistake_reason: "100 से भाग देना भूल जाना।"
    },
    {
      id: 7, topic: "औसत",
      text: "5 संख्याओं का औसत 18 है। एक संख्या 28 से बदलने पर औसत 20 हो जाता है। बदली गई संख्या थी:",
      options: ["8", "10", "18", "12"], correct: 2,
      step_by_step: "(90 - x + 28)/5 = 20 → x = 18",
      shortcut: "परिवर्तन = 2×5 = 10। पुरानी संख्या = 28 - 10 = 18",
      mistake_reason: "कुल परिवर्तन की गणना में त्रुटि।"
    },
    {
      id: 8, topic: "संख्या पद्धति",
      text: "वह सबसे छोटी संख्या जो 4, 6, 8, 12 से विभाजित होने पर प्रत्येक बार 2 शेष बचे:",
      options: ["24", "26", "48", "50"], correct: 1,
      step_by_step: "LCM(4,6,8,12) = 24। अभीष्ट संख्या = 24 + 2 = 26",
      shortcut: "LCM निकालें, फिर शेषफल जोड़ें।",
      mistake_reason: "LCM में शेषफल जोड़ना भूल जाना।"
    },
    {
      id: 9, topic: "लाभ और हानि",
      text: "एक व्यापारी वस्तु को लागत से 30% अधिक पर अंकित करता है और 10% छूट देता है। लाभ% है:",
      options: ["17%", "17.5%", "18%", "20%"], correct: 0,
      step_by_step: "CP=100, MP=130, SP=130×0.9=117। लाभ = 17%",
      shortcut: "(1+30/100)(1-10/100)-1 = 1.3×0.9-1 = 17%",
      mistake_reason: "30%-10%=20% सीधे जोड़ना गलत है।"
    },
    {
      id: 10, topic: "गति, समय और दूरी",
      text: "एक ट्रेन 60 km/h की गति से 120 km की दूरी तय करती है। समय होगा:",
      options: ["1 घंटा", "2 घंटे", "3 घंटे", "4 घंटे"], correct: 1,
      step_by_step: "समय = दूरी / गति = 120/60 = 2 घंटे",
      shortcut: "T = D/S",
      mistake_reason: "गति और दूरी को आपस में गुणा करना।"
    },
  ];

  const BANK = [
    {
      id: 1, topic: "Ratio & Proportion",
      text: "If A:B = 2:3 and B:C = 4:5, then what is A:B:C?",
      options: ["8:12:15", "2:3:5", "8:15:12", "6:12:15"], correct: 0,
      step_by_step: "Multiply A:B by 4 → 8:12. Multiply B:C by 3 → 12:15. Combined: 8:12:15.",
      shortcut: "(2×4):(3×4):(3×5) = 8:12:15.",
      mistake_reason: "Students try to add ratios directly instead of balancing the common term B."
    },
    {
      id: 2, topic: "Ratio & Proportion",
      text: "Two numbers in ratio 3:5. If 9 is subtracted from each, ratio becomes 12:23. The smaller number is:",
      options: ["27", "33", "49", "55"], correct: 1,
      step_by_step: "Let numbers be 3x and 5x. (3x-9)/(5x-9) = 12/23 → x=11. Smaller = 33.",
      shortcut: "Check: 33-9=24, 55-9=46. 24:46 = 12:23 ✓.",
      mistake_reason: "Arithmetic error in cross-multiplication gives x=9 instead of x=11."
    },
    {
      id: 3, topic: "Percentage",
      text: "A number is increased by 20% and then decreased by 10%. The net change is:",
      options: ["8% increase", "10% increase", "12% increase", "No change"], correct: 0,
      step_by_step: "100 → +20% → 120 → -10% → 108. Net change = +8%.",
      shortcut: "Net% = 20 - 10 - (20×10)/100 = 8% increase.",
      mistake_reason: "Adding 20% and -10% to get 10% instead of using compound formula."
    },
    {
      id: 4, topic: "Time & Work",
      text: "A can do a job in 10 days, B in 15 days. Together they finish in:",
      options: ["5 days", "6 days", "8 days", "12 days"], correct: 1,
      step_by_step: "A's rate = 1/10, B's rate = 1/15. Together = 1/10 + 1/15 = 5/30 = 1/6. So 6 days.",
      shortcut: "(10×15)/(10+15) = 150/25 = 6 days.",
      mistake_reason: "Adding days (10+15=25) instead of adding rates."
    },
    {
      id: 5, topic: "Simple Interest",
      text: "SI on Rs. 5000 at 8% per annum for 3 years is:",
      options: ["Rs. 1000", "Rs. 1200", "Rs. 1500", "Rs. 1800"], correct: 1,
      step_by_step: "SI = (P×R×T)/100 = (5000×8×3)/100 = 1200.",
      shortcut: "5000 × 8% × 3 = 1200.",
      mistake_reason: "Confusing SI formula with CI or forgetting to divide by 100."
    },
    {
      id: 6, topic: "Average",
      text: "Average of 5 numbers is 18. If one number is replaced by 28, average becomes 20. The replaced number was:",
      options: ["8", "10", "18", "12"], correct: 2,
      step_by_step: "(90 - x + 28)/5 = 20 → 118 - x = 100 → x = 18.",
      shortcut: "Change in total = 2×5 = 10. Old number = 28 - 10 = 18.",
      mistake_reason: "Forgetting to multiply average change by n to get total change."
    },
    {
      id: 7, topic: "Profit & Loss",
      text: "A trader marks goods 30% above cost and allows 10% discount. His profit %:",
      options: ["17%", "17.5%", "18%", "20%"], correct: 0,
      step_by_step: "CP = 100. MP = 130. SP = 130 × 0.9 = 117. Profit = 17%.",
      shortcut: "(1+0.3)(1-0.1) - 1 = 1.3×0.9 - 1 = 0.17 = 17%.",
      mistake_reason: "Calculating 30% - 10% = 20% profit directly, ignoring compound effect."
    },
    {
      id: 8, topic: "Number System",
      text: "What is the smallest number which when divided by 4, 6, 8, 12 leaves remainder 2 each time?",
      options: ["24", "26", "48", "50"], correct: 1,
      step_by_step: "LCM(4,6,8,12) = 24. Required number = 24 + 2 = 26.",
      shortcut: "Find LCM, then add the remainder.",
      mistake_reason: "Forgetting to add the remainder to the LCM."
    },
    {
      id: 9, topic: "General Knowledge",
      text: "Which article of the Indian Constitution abolishes untouchability?",
      options: ["Article 14", "Article 17", "Article 21", "Article 32"], correct: 1,
      step_by_step: "Article 17 abolishes untouchability and forbids its practice in any form.",
      shortcut: "17 → Untouchability abolished.",
      mistake_reason: "Confusing with Article 14 (Equality before Law) or Article 21 (Right to Life)."
    },
    {
      id: 10, topic: "General Knowledge",
      text: "The 'Discovery of India' was written by:",
      options: ["Mahatma Gandhi", "Jawaharlal Nehru", "Subhas Chandra Bose", "Lal Bahadur Shastri"], correct: 1,
      step_by_step: "Jawaharlal Nehru wrote 'Discovery of India' while imprisoned at Ahmednagar Fort (1944).",
      shortcut: "Nehru → Discovery of India. Gandhi → My Experiments with Truth.",
      mistake_reason: "Confusing books by prominent independence leaders."
    },
  ];

  const bank = isHindi ? BANK_HI : BANK;
  const topicLower = (topic || "").toLowerCase();

  let pool = bank.filter(q => q.topic.toLowerCase().includes(topicLower) || topicLower.includes(q.topic.toLowerCase().split(" ")[0]));
  
  // Pad with other questions from the bank if we don't have enough matches
  if (pool.length < count) {
    const remainingBank = bank.filter(q => !pool.includes(q));
    // Shuffle the remaining ones randomly
    for (let i = remainingBank.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [remainingBank[i], remainingBank[j]] = [remainingBank[j], remainingBank[i]];
    }
    pool = [...pool, ...remainingBank.slice(0, count - pool.length)];
  }

  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled.slice(0, Math.min(count, shuffled.length)).map((q, i) => ({ ...q, id: i + 1 }));
}
