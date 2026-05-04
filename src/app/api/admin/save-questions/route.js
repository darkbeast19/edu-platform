import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We create a server-side Supabase client. 
// If you add NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY to .env.local, it will bypass RLS.
// Otherwise it uses the ANON key, which requires RLS to allow INSERTS.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export async function POST(req) {
  try {
    const body = await req.json();
    const { questions, exam, topic } = body;

    if (!questions || questions.length === 0) {
      return NextResponse.json({ error: 'No questions provided' }, { status: 400 });
    }

    // Step 1: Look up Exam ID
    // We try to find the exam by name. If not found, we can't link it easily without creating it.
    let examId = null;
    if (exam) {
      const { data: examData } = await supabase
        .from('exams')
        .select('id')
        .ilike('name', `%${exam}%`)
        .limit(1)
        .single();
      
      if (examData) examId = examData.id;
    }

    // Step 2: Look up Topic ID
    let topicId = null;
    if (topic) {
      const { data: topicData } = await supabase
        .from('topics')
        .select('id')
        .ilike('name', `%${topic}%`)
        .limit(1)
        .single();

      if (topicData) topicId = topicData.id;
    }

    // Step 3: Map questions to database schema
    const dbQuestions = questions.map((q) => {
      const correctChar = ['A', 'B', 'C', 'D'][q.correct] || 'A';
      
      let diffLevel = 3; // Default Intermediate
      if (q.difficulty_level) {
        const d = q.difficulty_level.toLowerCase();
        if (d.includes("normal") || d.includes("easy")) diffLevel = 1;
        if (d.includes("hard")) diffLevel = 5;
      }

      return {
        exam_id: examId,
        topic_id: topicId,
        question_text: q.text,
        option_a: q.options[0] || '',
        option_b: q.options[1] || '',
        option_c: q.options[2] || '',
        option_d: q.options[3] || '',
        correct_option: correctChar,
        step_by_step: q.step_by_step || null,
        shortcut_trick: q.shortcut || null,
        difficulty: diffLevel,
        is_active: true
      };
    });

    // Step 4: Insert into Database
    const { data, error } = await supabase
      .from('questions')
      .insert(dbQuestions)
      .select();

    if (error) {
      console.error("Supabase Insert Error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      inserted: data.length,
      message: `Successfully saved ${data.length} questions.`
    }, { status: 200 });

  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
