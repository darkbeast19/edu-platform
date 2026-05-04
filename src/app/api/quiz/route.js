import { NextResponse } from 'next/server';
import { createClient } from "@/lib/supabase/server";

export async function POST(request) {
  try {
    const { topic = "General Knowledge", count = 10, difficulty = "Intermediate" } = await request.json();
    const numQuestions = Math.min(Math.max(parseInt(count) || 10, 1), 50);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!topic) {
      return NextResponse.json({ questions: [] }, { status: 200 });
    }

    const requestedTopics = topic.split(",").map(s => s.trim());

    // 1. Get Subject IDs
    const { data: matchedSubjects } = await supabase
      .from("subjects")
      .select("id, name")
      .in("name", requestedTopics);

    let subjectIds = matchedSubjects ? matchedSubjects.map(s => s.id) : [];

    // 2. Get Topic IDs (either by subject or directly by topic name)
    let topicIds = [];
    let matchedTopics = [];

    if (subjectIds.length > 0) {
      const { data: topicsBySubject } = await supabase
        .from("topics")
        .select("id, name, subject_id")
        .in("subject_id", subjectIds);
      if (topicsBySubject) {
        topicIds = [...topicIds, ...topicsBySubject.map(t => t.id)];
        matchedTopics = [...matchedTopics, ...topicsBySubject];
      }
    }

    const { data: topicsByName } = await supabase
      .from("topics")
      .select("id, name, subject_id")
      .in("name", requestedTopics);

    if (topicsByName) {
      topicIds = [...topicIds, ...topicsByName.map(t => t.id)];
      matchedTopics = [...matchedTopics, ...topicsByName];
    }

    // De-duplicate topic IDs
    topicIds = [...new Set(topicIds)];

    if (topicIds.length === 0) {
       // No topics found in DB, return empty array so frontend falls back to mock
       return NextResponse.json({ questions: [] }, { status: 200 });
    }

    // 3. Get User's previously answered questions
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

    // 4. Map difficulty
    const diffMap = { "Beginner": 1, "Intermediate": 3, "Hard Mode": 5 };
    const diffLevel = diffMap[difficulty] || 3;

    // 5. Fetch questions from Database
    const { data: fetchedQuestions } = await supabase
      .from("questions")
      .select("*")
      .in("topic_id", topicIds)
      // .eq("difficulty", diffLevel) // Optional: strict difficulty filtering
      .eq("is_active", true)
      .limit(1000);

    if (!fetchedQuestions || fetchedQuestions.length === 0) {
      return NextResponse.json({ questions: [] }, { status: 200 });
    }

    // Filter out previously answered questions
    let candidateQuestions = fetchedQuestions.filter(q => !answeredIds.has(q.id));
    
    // If not enough new questions, mix in old ones to fulfill count
    if (candidateQuestions.length < numQuestions) {
        candidateQuestions = fetchedQuestions; 
    }

    // Randomize
    for (let i = candidateQuestions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [candidateQuestions[i], candidateQuestions[j]] = [candidateQuestions[j], candidateQuestions[i]];
    }

    // Select top N
    const selected = candidateQuestions.slice(0, numQuestions);

    // Format for frontend
    const dbQuestions = selected.map((q, i) => {
      const topicRef = matchedTopics.find(t => t.id === q.topic_id);
      let correctIndex = 0;
      if (q.correct_option === "A") correctIndex = 0;
      if (q.correct_option === "B") correctIndex = 1;
      if (q.correct_option === "C") correctIndex = 2;
      if (q.correct_option === "D") correctIndex = 3;

      return {
        id: q.id,
        topic: topicRef ? topicRef.name : topic,
        text: q.question_text,
        options: [q.option_a, q.option_b, q.option_c, q.option_d],
        correct: correctIndex,
        step_by_step: q.step_by_step || q.explanation || "Detailed solution is not available for this question.",
        shortcut: q.shortcut_trick || null,
        mistake_reason: null
      };
    });

    return NextResponse.json({ 
        questions: dbQuestions, 
        source: "database", 
        originalLanguage: "en" 
    }, { status: 200 });

  } catch (error) {
    console.error("Quiz DB fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch questions from DB" }, { status: 500 });
  }
}
