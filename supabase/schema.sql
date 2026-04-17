-- ============================================================
-- AURAPREP - Complete Supabase Database Schema
-- Run this entire file in your Supabase SQL Editor
-- ============================================================

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS vector; -- For AI similarity search

-- ============================================================
-- 1. USERS & GAMIFICATION
-- ============================================================

-- Extends Supabase's built-in auth.users table
CREATE TABLE public.profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username        TEXT UNIQUE NOT NULL,
  full_name       TEXT,
  avatar_url      TEXT,
  email           TEXT UNIQUE NOT NULL,
  
  -- Gamification fields
  xp_total        INTEGER DEFAULT 0,
  level           INTEGER DEFAULT 1,
  coins           INTEGER DEFAULT 0,
  streak_days     INTEGER DEFAULT 0,
  last_active_at  DATE,
  
  -- Rank & Badges
  global_rank     INTEGER,
  badges          TEXT[] DEFAULT '{}',
  
  -- Premium
  is_premium      BOOLEAN DEFAULT FALSE,
  premium_until   TIMESTAMP WITH TIME ZONE,
  
  -- Meta
  target_exam     TEXT,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 2. EXAM TAXONOMY (Exams → Subjects → Topics)
-- ============================================================

CREATE TABLE public.exams (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        TEXT UNIQUE NOT NULL,         -- e.g., "SSC CGL", "Railway NTPC"
  slug        TEXT UNIQUE NOT NULL,         -- e.g., "ssc-cgl" (for SEO URLs)
  description TEXT,
  icon_url    TEXT,
  is_active   BOOLEAN DEFAULT TRUE,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.subjects (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  exam_id     UUID REFERENCES public.exams(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,               -- e.g., "Quantitative Aptitude"
  slug        TEXT NOT NULL,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE public.topics (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subject_id  UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
  name        TEXT NOT NULL,               -- e.g., "Ratio & Proportion"
  slug        TEXT NOT NULL,
  difficulty  INTEGER CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 3. THE QUESTION ENGINE (Core of the Platform)
-- ============================================================

CREATE TABLE public.questions (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  topic_id            UUID REFERENCES public.topics(id) ON DELETE SET NULL,
  exam_id             UUID REFERENCES public.exams(id) ON DELETE SET NULL,
  
  -- Content
  question_text       TEXT NOT NULL,
  option_a            TEXT NOT NULL,
  option_b            TEXT NOT NULL,
  option_c            TEXT NOT NULL,
  option_d            TEXT NOT NULL,
  correct_option      CHAR(1) NOT NULL CHECK (correct_option IN ('A', 'B', 'C', 'D')),
  
  -- Explanation (shown after answer)
  explanation         TEXT,
  shortcut_trick      TEXT,                -- Power feature: quick tricks
  concept_summary     TEXT,               -- Brief concept recap
  step_by_step        TEXT,               -- Detailed solution steps
  
  -- Metadata
  difficulty          INTEGER CHECK (difficulty BETWEEN 1 AND 5) DEFAULT 3,
  estimated_time_sec  INTEGER DEFAULT 60, -- Avg time to solve in seconds
  is_pyq              BOOLEAN DEFAULT FALSE, -- Is it a Previous Year Question?
  pyq_year            INTEGER,            -- e.g., 2022
  pyq_exam            TEXT,              -- e.g., "SSC CGL 2022"
  tags                TEXT[] DEFAULT '{}',
  
  -- AI vector for similarity search (weak topic recommendations)
  embedding           vector(1536),
  
  -- Stats (auto-updated via triggers)
  times_attempted     INTEGER DEFAULT 0,
  times_correct       INTEGER DEFAULT 0,
  
  -- Admin
  is_active           BOOLEAN DEFAULT TRUE,
  created_by          UUID REFERENCES auth.users(id),
  created_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for fast question retrieval by topic/exam
CREATE INDEX idx_questions_topic   ON public.questions(topic_id);
CREATE INDEX idx_questions_exam    ON public.questions(exam_id);
CREATE INDEX idx_questions_pyq     ON public.questions(is_pyq);
CREATE INDEX idx_questions_diff    ON public.questions(difficulty);

-- ============================================================
-- 4. QUIZ SESSIONS (Every time a student attempts a quiz)
-- ============================================================

CREATE TYPE quiz_mode AS ENUM (
  'practice', 'timed', 'pyq', 'daily_challenge', 
  'hard_mode', 'speed_quiz', 'weak_topic', 'mock_test'
);

CREATE TABLE public.quiz_sessions (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  
  -- Session config
  mode            quiz_mode NOT NULL DEFAULT 'practice',
  exam_id         UUID REFERENCES public.exams(id),
  topic_id        UUID REFERENCES public.topics(id),
  total_questions INTEGER NOT NULL,
  duration_sec    INTEGER,                  -- NULL = untimed (practice mode)
  
  -- Results (populated on submit)
  score           INTEGER DEFAULT 0,        -- Number of correct answers
  accuracy        NUMERIC(5,2),             -- Percentage
  time_taken_sec  INTEGER,                  -- Actual time taken
  xp_earned       INTEGER DEFAULT 0,
  coins_earned    INTEGER DEFAULT 0,
  rank_estimate   INTEGER,
  
  -- Status
  status          TEXT DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  started_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  completed_at    TIMESTAMP WITH TIME ZONE
);

CREATE INDEX idx_sessions_user   ON public.quiz_sessions(user_id);
CREATE INDEX idx_sessions_status ON public.quiz_sessions(status);

-- ============================================================
-- 5. USER ANSWERS (Every individual answer a student submits)
-- ============================================================

CREATE TABLE public.user_answers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id        UUID REFERENCES public.quiz_sessions(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  question_id       UUID REFERENCES public.questions(id) ON DELETE CASCADE,
  
  -- Answer detail
  selected_option   CHAR(1) CHECK (selected_option IN ('A', 'B', 'C', 'D', 'S')), -- S = Skipped
  is_correct        BOOLEAN,
  is_marked_review  BOOLEAN DEFAULT FALSE,
  time_taken_sec    INTEGER,               -- Time on this specific question
  
  -- AI-generated mistake analysis (generated on demand)
  ai_explanation    TEXT,
  
  created_at        TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_answers_session  ON public.user_answers(session_id);
CREATE INDEX idx_answers_user     ON public.user_answers(user_id);
CREATE INDEX idx_answers_question ON public.user_answers(question_id);

-- ============================================================
-- 6. WEAK TOPICS TRACKER
-- ============================================================

CREATE TABLE public.user_weak_topics (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id             UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  topic_id            UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  
  -- Calculated weakness score
  wrong_count         INTEGER DEFAULT 0,
  total_attempted     INTEGER DEFAULT 0,
  accuracy            NUMERIC(5,2) DEFAULT 0,
  weakness_score      INTEGER DEFAULT 0,  -- Higher = weaker (used for sorting)
  
  last_attempted_at   TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at          TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, topic_id)
);

-- ============================================================
-- 7. LEADERBOARD
-- ============================================================

CREATE TABLE public.leaderboard_daily (
  id        UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id   UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_today  INTEGER DEFAULT 0,
  rank      INTEGER,
  date      DATE NOT NULL DEFAULT CURRENT_DATE,
  UNIQUE(user_id, date)
);

CREATE TABLE public.leaderboard_weekly (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id    UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  xp_week    INTEGER DEFAULT 0,
  rank       INTEGER,
  week_start DATE NOT NULL,
  UNIQUE(user_id, week_start)
);

-- ============================================================
-- 8. DAILY REWARDS & STREAK TRACKING
-- ============================================================

CREATE TABLE public.daily_rewards (
  id           UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id      UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  date         DATE NOT NULL DEFAULT CURRENT_DATE,
  xp_rewarded  INTEGER DEFAULT 0,
  coins_given  INTEGER DEFAULT 0,
  claimed      BOOLEAN DEFAULT FALSE,
  UNIQUE(user_id, date)
);

-- ============================================================
-- 9. REFERRALS
-- ============================================================

CREATE TABLE public.referrals (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  referrer_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  referred_id     UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  status          TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'completed')),
  reward_given    BOOLEAN DEFAULT FALSE,
  created_at      TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================
-- 10. ROW LEVEL SECURITY (RLS) - Security Policies
-- ============================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.questions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_sessions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_answers     ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_weak_topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_rewards    ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can only read/update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Questions: Anyone authenticated can read active questions
CREATE POLICY "Anyone can read active questions"
  ON public.questions FOR SELECT USING (is_active = TRUE);

-- Quiz Sessions: Users can only see their own sessions
CREATE POLICY "Users can manage own sessions"
  ON public.quiz_sessions FOR ALL USING (auth.uid() = user_id);

-- User Answers: Users can only see their own answers
CREATE POLICY "Users can manage own answers"
  ON public.user_answers FOR ALL USING (auth.uid() = user_id);

-- Weak Topics: Users can only see their own weak topics
CREATE POLICY "Users can manage own weak topics"
  ON public.user_weak_topics FOR ALL USING (auth.uid() = user_id);

-- Daily Rewards: Users can only see their own rewards
CREATE POLICY "Users can view own rewards"
  ON public.daily_rewards FOR ALL USING (auth.uid() = user_id);

-- ============================================================
-- 11. FUNCTIONS & TRIGGERS
-- ============================================================

-- Auto-create profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, username, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    SPLIT_PART(NEW.email, '@', 1),
    NEW.raw_user_meta_data->>'full_name'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- Auto-update question stats when a user submits an answer
CREATE OR REPLACE FUNCTION public.update_question_stats()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.questions
  SET 
    times_attempted = times_attempted + 1,
    times_correct   = times_correct + (CASE WHEN NEW.is_correct THEN 1 ELSE 0 END)
  WHERE id = NEW.question_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_answer_submitted
  AFTER INSERT ON public.user_answers
  FOR EACH ROW EXECUTE PROCEDURE public.update_question_stats();

-- Auto-update updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at();

-- ============================================================
-- 12. SEED DATA - Sample Exams, Subjects & Topics
-- ============================================================

-- Exams
INSERT INTO public.exams (name, slug, description) VALUES
  ('SSC CGL', 'ssc-cgl', 'Staff Selection Commission - Combined Graduate Level'),
  ('SSC CHSL', 'ssc-chsl', 'Staff Selection Commission - Combined Higher Secondary Level'),
  ('Railway NTPC', 'railway-ntpc', 'Railway Non-Technical Popular Category'),
  ('SBI PO', 'sbi-po', 'State Bank of India - Probationary Officer'),
  ('IBPS Clerk', 'ibps-clerk', 'Institute of Banking Personnel Selection - Clerk');

-- Subjects for SSC CGL
WITH ssc AS (SELECT id FROM public.exams WHERE slug = 'ssc-cgl')
INSERT INTO public.subjects (exam_id, name, slug) VALUES
  ((SELECT id FROM ssc), 'Quantitative Aptitude', 'quant'),
  ((SELECT id FROM ssc), 'General Reasoning', 'reasoning'),
  ((SELECT id FROM ssc), 'English Language', 'english'),
  ((SELECT id FROM ssc), 'General Knowledge', 'gk');

-- Topics for Quantitative Aptitude
WITH quant AS (SELECT id FROM public.subjects WHERE slug = 'quant' LIMIT 1)
INSERT INTO public.topics (subject_id, name, slug, difficulty) VALUES
  ((SELECT id FROM quant), 'Ratio & Proportion', 'ratio-proportion', 2),
  ((SELECT id FROM quant), 'Percentage', 'percentage', 2),
  ((SELECT id FROM quant), 'Profit & Loss', 'profit-loss', 3),
  ((SELECT id FROM quant), 'Time & Work', 'time-work', 3),
  ((SELECT id FROM quant), 'Simple Interest', 'simple-interest', 2),
  ((SELECT id FROM quant), 'Compound Interest', 'compound-interest', 3),
  ((SELECT id FROM quant), 'Algebra', 'algebra', 4),
  ((SELECT id FROM quant), 'Trigonometry', 'trigonometry', 4),
  ((SELECT id FROM quant), 'Geometry', 'geometry', 4);

-- Topics for Reasoning
WITH reasoning AS (SELECT id FROM public.subjects WHERE slug = 'reasoning' LIMIT 1)
INSERT INTO public.topics (subject_id, name, slug, difficulty) VALUES
  ((SELECT id FROM reasoning), 'Blood Relations', 'blood-relations', 2),
  ((SELECT id FROM reasoning), 'Coding Decoding', 'coding-decoding', 2),
  ((SELECT id FROM reasoning), 'Syllogism', 'syllogism', 3),
  ((SELECT id FROM reasoning), 'Direction & Distance', 'direction-distance', 2),
  ((SELECT id FROM reasoning), 'Mirror Images', 'mirror-images', 3),
  ((SELECT id FROM reasoning), 'Series Completion', 'series-completion', 3);
