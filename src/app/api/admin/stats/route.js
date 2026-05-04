import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function GET() {
  try {
    const [
      { count: totalUsers },
      { count: totalQuestions },
      { count: liveQuestions },
      { count: totalSessions },
      { count: completedSessions },
      { data: topTopics }
    ] = await Promise.all([
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }),
      supabase.from('questions').select('*', { count: 'exact', head: true }).eq('is_active', true),
      supabase.from('quiz_sessions').select('*', { count: 'exact', head: true }),
      supabase.from('quiz_sessions').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('questions')
        .select('topic_id, topics(name), count:id')
        .limit(5)
    ]);

    // Questions by difficulty breakdown
    const { data: diffData } = await supabase
      .from('questions')
      .select('difficulty')
      .eq('is_active', true);

    const diffBreakdown = { normal: 0, intermediate: 0, hard: 0 };
    if (diffData) {
      diffData.forEach(q => {
        if (q.difficulty <= 2) diffBreakdown.normal++;
        else if (q.difficulty <= 3) diffBreakdown.intermediate++;
        else diffBreakdown.hard++;
      });
    }

    // Recent activity (last 5 quiz sessions)
    const { data: recentSessions } = await supabase
      .from('quiz_sessions')
      .select(`
        id, score, total_questions, accuracy, status, started_at,
        profiles(username, full_name)
      `)
      .order('started_at', { ascending: false })
      .limit(5);

    return NextResponse.json({
      stats: {
        totalUsers: totalUsers || 0,
        totalQuestions: totalQuestions || 0,
        liveQuestions: liveQuestions || 0,
        totalSessions: totalSessions || 0,
        completedSessions: completedSessions || 0,
      },
      diffBreakdown,
      recentSessions: recentSessions || []
    });
  } catch (err) {
    console.error('Stats error:', err);
    return NextResponse.json({ error: 'Failed to load stats' }, { status: 500 });
  }
}
