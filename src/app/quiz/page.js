"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock, Trophy, ChevronRight, ChevronLeft, Flag,
  CheckCircle2, AlertCircle, Lightbulb, Zap, Target, Settings, BookOpen
} from "lucide-react";
import Link from "next/link";

// Fallback questions (used when no API / no params)
const MOCK_QUESTIONS = [
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
    text: "Two numbers in ratio 3:5. If 9 subtracted from each, ratio becomes 12:23. Smaller number:",
    options: ["27", "33", "49", "55"], correct: 1,
    step_by_step: "3x and 5x. (3x-9)/(5x-9)=12/23 → x=11. Smaller=33.",
    shortcut: "33-9=24, 55-9=46. 24:46 = 12:23 ✓",
    mistake_reason: "Arithmetic error in cross-multiplication."
  },
  {
    id: 3, topic: "Ratio & Proportion",
    text: "Rs. 1050 divided; A's share = 2/5 of (B+C). A gets:",
    options: ["Rs. 200", "Rs. 300", "Rs. 320", "Rs. 420"], correct: 1,
    step_by_step: "A:(B+C)=2:5. Total 7 parts=1050. A=2×150=300.",
    shortcut: "A=(2/7)×1050=300.",
    mistake_reason: "Dividing 1050 by 2.5 instead of ratio parts."
  }
];

// ── Core Quiz Engine (uses useSearchParams so must be inside Suspense) ──────
function QuizEngineInner() {
  const searchParams = useSearchParams();

  // Read URL params (passed from /exam/[slug])
  const urlTopics   = searchParams.get("topics") || "";   // "Quant,Reasoning" etc.
  const urlTopic    = searchParams.get("topic")  || "";   // single topic from search
  const urlCount    = parseInt(searchParams.get("count")  || "10");
  const urlDifficulty = searchParams.get("difficulty") || "Intermediate";
  const urlExam     = searchParams.get("exam") || "";

  const hasUrlParams = !!(urlTopics || urlTopic);

  // ── State ──────────────────────────────────────────────────────────────────
  const [isStarted,          setIsStarted]          = useState(false);
  const [configQCount,       setConfigQCount]       = useState(urlCount);
  const [configDifficulty,   setConfigDifficulty]   = useState(urlDifficulty);
  const [userProfile,        setUserProfile]        = useState(null);
  const [questions,          setQuestions]          = useState([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers,    setSelectedAnswers]    = useState({});
  const [markedForReview,    setMarkedForReview]    = useState(new Set());
  const [timeLeft,           setTimeLeft]           = useState(0);
  const [xpEarned,           setXpEarned]           = useState(0);
  const [isSubmitted,        setIsSubmitted]        = useState(false);
  const [showScoreboard,     setShowScoreboard]     = useState(false);

  // Fetch user profile for XP saving
  useEffect(() => {
    async function fetchUser() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
          setUserProfile(data);
        }
      } catch (_) {}
    }
    fetchUser();
  }, []);

  // Timer
  useEffect(() => {
    if (!isStarted || timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isStarted]);

  // Auto-submit when time runs out
  useEffect(() => {
    if (isStarted && timeLeft === 0 && !isSubmitted && questions.length > 0) {
      handleSubmitQuiz();
    }
  }, [timeLeft]);

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2,"0")}:${String(s % 60).padStart(2,"0")}`;

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    if (selectedAnswers[currentQuestionIdx] === undefined) {
      setXpEarned(prev => prev + 15);
    }
    setSelectedAnswers(prev => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  // ── Derived values ────────────────────────────────────────────────────────
  const currentQ     = questions[currentQuestionIdx];
  const totalAnswered = Object.keys(selectedAnswers).length;
  const progressPct  = questions.length > 0 ? (totalAnswered / questions.length) * 100 : 0;
  const allAnswered  = questions.length > 0 && totalAnswered === questions.length;

  let correctCount = 0;
  if (isSubmitted) {
    questions.forEach((q, i) => { if (selectedAnswers[i] === q.correct) correctCount++; });
  }

  // ── Start Quiz ────────────────────────────────────────────────────────────
  const handleStartQuiz = async () => {
    setIsLoadingQuestions(true);
    setSelectedAnswers({});
    setMarkedForReview(new Set());
    setCurrentQuestionIdx(0);
    setXpEarned(0);
    setIsSubmitted(false);
    setShowScoreboard(false);
    setTimeLeft(configQCount * 90); // 90 sec per question

    // Determine topic string: join multiple subjects or use single topic
    const topicString = urlTopics
      ? urlTopics.split(",").join(", ")
      : urlTopic || "General Knowledge";

    try {
      const res = await fetch("/api/generate-quiz", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicString, difficulty: configDifficulty, count: configQCount })
      });
      const data = await res.json();
      if (data.questions && data.questions.length > 0) {
        setQuestions(data.questions);
      } else {
        setQuestions(MOCK_QUESTIONS.slice(0, configQCount));
      }
    } catch {
      setQuestions(MOCK_QUESTIONS.slice(0, configQCount));
    } finally {
      setIsLoadingQuestions(false);
      setIsStarted(true);
    }
  };

  // ── Submit Quiz + save XP ─────────────────────────────────────────────────
  const handleSubmitQuiz = async () => {
    if (isSubmitted) return;
    setIsSubmitted(true);
    setShowScoreboard(true);

    if (userProfile && xpEarned > 0) {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const newXp    = (userProfile.xp_total || 0) + xpEarned;
        const newLevel = Math.floor(newXp / 500) + 1;
        await supabase.from("profiles").update({
          xp_total:    newXp,
          level:       newLevel,
          streak_days: (userProfile.streak_days || 0) > 0 ? userProfile.streak_days : 1
        }).eq("id", userProfile.id);
      } catch (err) {
        console.error("XP save failed:", err);
      }
    }
  };

  // ── VIEW 1: Pre-Quiz Configurator ─────────────────────────────────────────
  if (!isStarted) {
    const subjectList = urlTopics
      ? urlTopics.split(",").map(s => s.trim())
      : urlTopic ? [urlTopic] : [];

    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.93, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#12121a] border border-white/10 p-8 rounded-3xl max-w-lg w-full shadow-2xl"
        >
          <div className="flex items-center gap-3 mb-2">
            <Settings className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Configure Practice</h1>
          </div>

          {urlExam && (
            <div className="text-xs text-slate-500 mb-6 ml-9">
              Exam: <span className="text-blue-400 font-semibold">{urlExam}</span>
            </div>
          )}

          {/* Subject badges */}
          {subjectList.length > 0 && (
            <div className="mb-6">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Selected Subjects</div>
              <div className="flex flex-wrap gap-2">
                {subjectList.map((s, i) => (
                  <span key={i} className="px-3 py-1.5 bg-blue-500/10 border border-blue-500/20 text-blue-300 text-xs font-bold rounded-lg">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* Question Count */}
            <div>
              <label className="text-slate-400 text-xs font-bold tracking-wider mb-3 block uppercase">Number of Questions</label>
              <div className="grid grid-cols-4 gap-3">
                {[10, 20, 30, 50].map(num => (
                  <button
                    key={num}
                    onClick={() => setConfigQCount(num)}
                    className={`py-3 rounded-xl font-bold transition-all border ${
                      configQCount === num
                        ? "bg-blue-600/20 border-blue-500 text-blue-400"
                        : "bg-[#0a0a0f] border-white/10 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty */}
            <div>
              <label className="text-slate-400 text-xs font-bold tracking-wider mb-3 block uppercase">Difficulty Level</label>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: "Beginner", emoji: "🟢" },
                  { label: "Intermediate", emoji: "🟡" },
                  { label: "Hard Mode", emoji: "🔴" },
                ].map(({ label, emoji }) => (
                  <button
                    key={label}
                    onClick={() => setConfigDifficulty(label)}
                    className={`py-3 rounded-xl font-bold transition-all border text-sm ${
                      configDifficulty === label
                        ? "bg-purple-600/20 border-purple-500 text-purple-400"
                        : "bg-[#0a0a0f] border-white/10 text-slate-400 hover:border-slate-500"
                    }`}
                  >
                    {emoji} {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Time estimate */}
            <div className="text-xs text-slate-500 text-center">
              ⏱ Estimated: ~{Math.ceil(configQCount * 1.5)} minutes
            </div>

            <button
              onClick={handleStartQuiz}
              disabled={isLoadingQuestions}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center gap-2 disabled:opacity-50"
            >
              {isLoadingQuestions
                ? <span className="animate-pulse">✨ Generating {configQCount} Questions...</span>
                : <><Target className="w-5 h-5" /> Enter Arena</>}
            </button>

            {!hasUrlParams && (
              <Link href="/exam/ssc-cgl" className="block text-center text-xs text-slate-500 hover:text-blue-400 transition">
                ← Select an exam to choose subjects
              </Link>
            )}
          </div>
        </motion.div>
      </div>
    );
  }

  // ── VIEW 2: The Active Quiz ───────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 w-1/3">
          <Link href="/dashboard" className="text-slate-400 hover:text-white font-bold hidden md:block">Quit</Link>
          <div className="flex flex-col w-full max-w-[200px]">
            <span className="text-xs text-slate-400 font-bold mb-1 tracking-wider">PROGRESS</span>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
          </div>
        </div>

        <div className={`flex items-center gap-3 px-5 py-2 rounded-2xl border ${timeLeft < 60 ? "bg-red-500/10 border-red-500/30" : "bg-white/5 border-white/10"}`}>
          <Clock className={`w-5 h-5 ${timeLeft < 60 ? "text-red-400 animate-pulse" : "text-blue-400"}`} />
          <span className={`text-xl font-mono font-bold tracking-wider ${timeLeft < 60 ? "text-red-300" : "text-white"}`}>
            {formatTime(timeLeft)}
          </span>
        </div>

        <div className="flex items-center justify-end gap-3 w-1/3">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-200 font-bold text-sm">+{xpEarned} XP</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row flex-1 w-full overflow-hidden relative">

        {/* Scoreboard Overlay */}
        <AnimatePresence>
          {showScoreboard && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0f]/85 backdrop-blur-sm p-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }}
                className="bg-[#12121a] border border-white/10 rounded-3xl p-8 max-w-lg w-full text-center shadow-2xl"
              >
                <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                <h2 className="text-3xl font-extrabold text-white mb-2">Quiz Completed!</h2>
                <p className="text-slate-400 mb-6">Here is your performance summary.</p>

                <div className="grid grid-cols-3 gap-4 mb-8">
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-sm font-bold text-slate-400 mb-1">SCORE</div>
                    <div className="text-2xl font-bold text-white">{correctCount} <span className="text-slate-500 text-lg">/ {questions.length}</span></div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-sm font-bold text-slate-400 mb-1">ACCURACY</div>
                    <div className="text-2xl font-bold text-blue-400">
                      {questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0}%
                    </div>
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-4">
                    <div className="text-sm font-bold text-slate-400 mb-1">XP</div>
                    <div className="text-2xl font-bold text-yellow-400">+{xpEarned}</div>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setShowScoreboard(false)}
                    className="flex-1 bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-500 transition flex justify-center items-center gap-2"
                  >
                    Review Answers <ChevronRight className="w-5 h-5" />
                  </button>
                  <Link href="/dashboard" className="flex-1 bg-white/5 border border-white/10 text-white font-bold py-3.5 rounded-xl hover:bg-white/10 transition flex justify-center items-center gap-2">
                    Dashboard
                  </Link>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Question Panel */}
        <div className="flex-1 p-6 flex flex-col overflow-y-auto w-full">
          {/* Topic badge */}
          {currentQ?.topic && (
            <div className="mb-4">
              <span className="text-xs font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full">
                {currentQ.topic}
              </span>
            </div>
          )}

          <h2 className="text-xl lg:text-2xl font-semibold text-white leading-relaxed flex gap-4 mb-8">
            <span className="text-blue-500 font-mono flex-shrink-0">Q{currentQuestionIdx + 1}.</span>
            <span>{currentQ?.text || "Loading..."}</span>
          </h2>

          {/* Options */}
          <div className="space-y-3 mb-8 w-full max-w-3xl">
            {currentQ?.options?.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              let cls = "border-white/10 hover:border-blue-500/50 hover:bg-white/[0.03]";
              if (isSelected) cls = "border-blue-500 bg-blue-500/10";
              if (isSubmitted) {
                if (idx === currentQ.correct) cls = "border-emerald-500 bg-emerald-500/10";
                else if (isSelected) cls = "border-red-500 bg-red-500/10";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-5 rounded-2xl border ${cls} transition-all duration-200 flex items-center justify-between group`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold flex-shrink-0
                      ${isSelected ? "border-blue-500 bg-blue-500 text-white" : "border-slate-600 text-slate-400"}
                      ${isSubmitted && idx === currentQ.correct ? "!border-emerald-500 !bg-emerald-500 !text-white" : ""}
                      ${isSubmitted && isSelected && idx !== currentQ.correct ? "!border-red-500 !bg-red-500 !text-white" : ""}
                    `}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-base font-medium text-slate-200">{opt}</span>
                  </div>
                  {isSubmitted && idx === currentQ.correct && <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />}
                  {isSubmitted && isSelected && idx !== currentQ.correct && <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* AI Explanations after submit */}
          <AnimatePresence>
            {isSubmitted && currentQ && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="w-full max-w-3xl space-y-4"
              >
                {selectedAnswers[currentQuestionIdx] !== currentQ.correct && currentQ.mistake_reason && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5">
                    <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><AlertCircle className="w-4 h-4" /> AI Mistake Analysis</h3>
                    <p className="text-red-200/80 text-sm leading-relaxed">{currentQ.mistake_reason}</p>
                  </div>
                )}
                {currentQ.shortcut && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-5">
                    <h3 className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><Zap className="w-4 h-4 fill-yellow-500" /> Shortcut Trick</h3>
                    <p className="text-yellow-200/90 text-sm leading-relaxed">{currentQ.shortcut}</p>
                  </div>
                )}
                {currentQ.step_by_step && (
                  <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-5">
                    <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Lightbulb className="w-4 h-4" /> Step-by-Step Logic</h3>
                    <p className="text-slate-300 text-sm leading-relaxed">{currentQ.step_by_step}</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="py-12" />

          {/* Navigation Footer */}
          <div className="sticky bottom-0 bg-[#0a0a0f] border-t border-white/10 p-4 mt-auto w-full flex flex-wrap items-center justify-between gap-4 z-40">
            <button
              onClick={() => {
                const s = new Set(markedForReview);
                s.has(currentQuestionIdx) ? s.delete(currentQuestionIdx) : s.add(currentQuestionIdx);
                setMarkedForReview(s);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-colors ${
                markedForReview.has(currentQuestionIdx)
                  ? "bg-orange-500/20 text-orange-400"
                  : "bg-white/5 text-slate-300 hover:bg-white/10"
              }`}
            >
              <Flag className={`w-4 h-4 ${markedForReview.has(currentQuestionIdx) ? "fill-orange-400" : ""}`} />
              {markedForReview.has(currentQuestionIdx) ? "Marked" : "Mark"}
            </button>

            <div className="flex gap-3 flex-wrap justify-end">
              <button
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)}
                disabled={currentQuestionIdx === 0}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>

              {currentQuestionIdx === questions.length - 1 ? (
                <button
                  onClick={handleSubmitQuiz}
                  disabled={isSubmitted}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition disabled:opacity-50"
                >
                  {isSubmitted ? "✅ Submitted" : "Submit Test"} <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="flex items-center gap-2 bg-blue-600 border border-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              )}

              {/* "Finish" shortcut when all answered but not on last Q */}
              {allAnswered && currentQuestionIdx !== questions.length - 1 && !isSubmitted && (
                <button
                  onClick={handleSubmitQuiz}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition"
                >
                  Finish <CheckCircle2 className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar — Question Palette */}
        <div className="w-full lg:w-[280px] bg-[#12121a] lg:border-l border-t lg:border-t-0 border-white/10 p-5 flex flex-col flex-shrink-0">
          <h3 className="text-base font-bold text-white mb-1">Question Palette</h3>
          <p className="text-xs text-slate-500 mb-5">{totalAnswered} / {questions.length} answered</p>
          <div className="grid grid-cols-5 sm:grid-cols-8 lg:grid-cols-5 gap-2.5">
            {questions.map((_, idx) => {
              const isCurrent  = currentQuestionIdx === idx;
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isMarked   = markedForReview.has(idx);

              let boxCls = "bg-white/5 border-white/10 text-slate-400";
              if (isAnswered) boxCls = "bg-blue-600/20 border-blue-500/50 text-blue-400";
              if (isSubmitted && isAnswered) {
                boxCls = questions[idx].correct === selectedAnswers[idx]
                  ? "bg-emerald-500/20 border-emerald-500 text-emerald-400"
                  : "bg-red-500/20 border-red-500 text-red-400";
              } else if (!isSubmitted) {
                if (isMarked && !isAnswered) boxCls = "bg-orange-500/20 border-orange-500/50 text-orange-400";
                if (isMarked && isAnswered)  boxCls = "bg-orange-600 border-orange-500 text-white";
              }
              if (isCurrent) boxCls += " ring-2 ring-white scale-110 shadow-lg";

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all hover:scale-105 ${boxCls}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-6 space-y-2 text-xs text-slate-500">
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-blue-600/20 border border-blue-500/50" /> Answered</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-orange-500/20 border border-orange-500/50" /> Marked</div>
            <div className="flex items-center gap-2"><div className="w-4 h-4 rounded bg-white/5 border border-white/10" /> Unanswered</div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Wrapper with Suspense (required for useSearchParams in Next.js) ──────────
export default function QuizPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-400 font-bold animate-pulse">
        Loading Quiz...
      </div>
    }>
      <QuizEngineInner />
    </Suspense>
  );
}
