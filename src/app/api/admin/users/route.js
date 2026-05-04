import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

// GET all users with stats
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = 15;
    const offset = (page - 1) * limit;

    const { data: users, count } = await supabase
      .from('profiles')
      .select(`
        id, username, full_name, email, xp_total, level,
        streak_days, is_premium, target_exam, created_at, last_active_at,
        coins, global_rank
      `, { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    return NextResponse.json({ users: users || [], total: count || 0, page, limit });
  } catch (err) {
    return NextResponse.json({ error: 'Failed to load users' }, { status: 500 });
  }
}

// PATCH: Toggle premium, update info
export async function PATCH(req) {
  try {
    const { id, updates } = await req.json();
    if (!id || !updates) return NextResponse.json({ error: 'Missing id or updates' }, { status: 400 });

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true, user: data });
  } catch (err) {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
