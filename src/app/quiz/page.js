"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Clock, 
  Flame, 
  Trophy, 
  ChevronRight, 
  ChevronLeft, 
  Flag,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  Zap,
  Target,
  Settings
} from "lucide-react";
import Link from "next/link";

// Added AI Analysis properties (step_by_step, shortcut, mistake_reason)
const MOCK_QUESTIONS = [
  {
    id: 1,
    topic: "Ratio & Proportion",
    text: "If A:B = 2:3 and B:C = 4:5, then what is A:B:C?",
    options: ["8:12:15", "2:3:5", "8:15:12", "6:12:15"],
    correct: 0, 
    step_by_step: "To make B equal in both ratios: multiply A:B (2:3) by 4 → 8:12. Multiply B:C (4:5) by 3 → 12:15. Result: 8:12:15.",
    shortcut: "Use the reversed N trick! (A×B) : (B×B) : (B×C) → (2×4) : (3×4) : (3×5) → 8:12:15.",
    mistake_reason: "If you got 2:3:5, you incorrectly assumed ratios can be added directly without balancing the common variable (B)."
  },
  {
    id: 2,
    topic: "Ratio & Proportion",
    text: "Two numbers are in the ratio 3:5. If 9 is subtracted from each, the new numbers are in the ratio 12:23. The smaller number is:",
    options: ["27", "33", "49", "55"],
    correct: 1, 
    step_by_step: "Let numbers be 3x and 5x. Equation: (3x - 9)/(5x - 9) = 12/23. Cross multiply: 69x - 207 = 60x - 108. 9x = 99 → x = 11. Smaller number = 3(11) = 33.",
    shortcut: "Check multiples! The smaller number must be a multiple of 3. Both 27 and 33 work. Try 33: 33-9=24. If 33 is 3x, 5x is 55. 55-9=46. 24:46 = 12:23. Matches instantly!",
    mistake_reason: "If you chose 27, you likely solved for x incorrectly (9x = 81) due to a basic subtraction error during cross-multiplication."
  },
  {
    id: 3,
    topic: "Ratio & Proportion",
    text: "Rs. 1050 are divided among A, B and C in such a way that the share of A is 2/5 of the combined share of B and C. A will get:",
    options: ["Rs. 200", "Rs. 300", "Rs. 320", "Rs. 420"],
    correct: 1,
    step_by_step: "Let combined share of B & C be x. A's share = (2/5)x. Total = x + (2/5)x = (7/5)x = 1050. x = 750. A's share = 1050 - 750 = 300.",
    shortcut: "Ratio of A : (B+C) = 2 : 5. Total parts = 7. Value of 7 parts = 1050. 1 part = 150. A gets 2 parts → 2 × 150 = 300.",
    mistake_reason: "If you chose 420, you divided 1050 directly by 2.5 instead of finding the ratio components."
  }
];

export default function QuizEngine() {
  // Pre-Quiz Configuration State
  const [isStarted, setIsStarted] = useState(false);
  const [configQCount, setConfigQCount] = useState(10);
  const [configDifficulty, setConfigDifficulty] = useState("Intermediate");

  // Quiz Execution State
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [markedForReview, setMarkedForReview] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [xpEarned, setXpEarned] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    if (!isStarted || timeLeft <= 0 || isSubmitted) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, isSubmitted, isStarted]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (optIdx) => {
    if (isSubmitted) return;
    if (selectedAnswers[currentQuestionIdx] === undefined) {
      setXpEarned(prev => prev + 15);
    }
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIdx]: optIdx }));
  };

  const currentQ = MOCK_QUESTIONS[currentQuestionIdx];
  const progressPercent = ((Object.keys(selectedAnswers).length) / MOCK_QUESTIONS.length) * 100;

  // --- VIEW 1: PRE-QUIZ CONFIGURATOR ---
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-[#12121a] border border-white/10 p-8 rounded-3xl max-w-lg w-full">
          <div className="flex items-center gap-3 mb-6">
            <Settings className="w-6 h-6 text-blue-500" />
            <h1 className="text-2xl font-bold text-white">Configure Practice</h1>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="text-slate-400 text-sm font-bold tracking-wider mb-3 block">NUMBER OF QUESTIONS</label>
              <div className="grid grid-cols-4 gap-3">
                {[5, 10, 15, 30].map(num => (
                  <button 
                    key={num} 
                    onClick={() => setConfigQCount(num)}
                    className={`py-3 rounded-xl font-bold transition-all border ${configQCount === num ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-[#0a0a0f] border-white/10 text-slate-400 hover:border-slate-500'}`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-slate-400 text-sm font-bold tracking-wider mb-3 block">DIFFICULTY LEVEL</label>
              <div className="grid grid-cols-3 gap-3">
                {["Beginner", "Intermediate", "Hard Mode"].map(level => (
                  <button 
                    key={level} 
                    onClick={() => setConfigDifficulty(level)}
                    className={`py-3 rounded-xl font-bold transition-all border text-sm ${configDifficulty === level ? 'bg-purple-600/20 border-purple-500 text-purple-400' : 'bg-[#0a0a0f] border-white/10 text-slate-400 hover:border-slate-500'}`}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={() => setIsStarted(true)} 
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-4 rounded-xl mt-4 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex justify-center items-center gap-2"
            >
              Enter Arena <Target className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // --- VIEW 2: THE QUIZ ENGINE (Execution & Checking) ---
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col">
      {/* Top Bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-md border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6 w-1/3">
          <Link href="/dashboard" className="text-slate-400 hover:text-white font-bold text-lg hidden md:block">Quit</Link>
          <div className="flex flex-col w-full max-w-[200px]">
            <span className="text-xs text-slate-400 font-bold mb-1 tracking-wider">PROGRESS</span>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${progressPercent}%` }} />
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-white/5 border border-white/10 px-5 py-2 rounded-2xl">
          <Clock className="w-5 h-5 text-blue-400" />
          <span className="text-xl font-mono font-bold tracking-wider text-white">{formatTime(timeLeft)}</span>
        </div>
        <div className="flex items-center justify-end gap-3 w-1/3">
          <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-4 py-1.5 rounded-full">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-yellow-200 font-bold text-sm">+{xpEarned} XP</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row flex-1 w-full overflow-hidden">
        {/* Main Panel */}
        <div className="flex-1 p-6 flex flex-col relative overflow-y-auto w-full">
          
          <div className="mb-8 flex-1">
            <h2 className="text-2xl font-semibold text-white leading-relaxed flex gap-4">
              <span className="text-blue-500 font-mono">Q{currentQuestionIdx + 1}.</span> {currentQ.text}
            </h2>
          </div>

          <div className="space-y-4 mb-8 w-full max-w-3xl">
            {currentQ.options.map((opt, idx) => {
              const isSelected = selectedAnswers[currentQuestionIdx] === idx;
              let borderClass = "border-white/10 hover:border-blue-500/50 hover:bg-white/[0.03]";
              if (isSelected) borderClass = "border-blue-500 bg-blue-500/10";
              if (isSubmitted) {
                if (idx === currentQ.correct) borderClass = "border-emerald-500 bg-emerald-500/10";
                else if (isSelected) borderClass = "border-red-500 bg-red-500/10";
              }

              return (
                <button key={idx} onClick={() => handleSelectOption(idx)} className={`w-full text-left p-5 rounded-2xl border ${borderClass} transition-all duration-200 group flex items-center justify-between`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-bold ${isSelected ? 'border-blue-500 bg-blue-500 text-white' : 'border-slate-600 text-slate-400 group-hover:border-blue-500/50'} ${isSubmitted && idx === currentQ.correct ? 'border-emerald-500 bg-emerald-500 text-white' : ''} ${isSubmitted && isSelected && idx !== currentQ.correct ? 'border-red-500 bg-red-500 text-white' : ''}`}>
                      {String.fromCharCode(65 + idx)}
                    </div>
                    <span className="text-lg font-medium text-slate-200">{opt}</span>
                  </div>
                  {isSubmitted && idx === currentQ.correct && <CheckCircle2 className="w-6 h-6 text-emerald-500" />}
                  {isSubmitted && isSelected && idx !== currentQ.correct && <AlertCircle className="w-6 h-6 text-red-500" />}
                </button>
              );
            })}
          </div>

          {/* ADVANCED MISTAKE ANALYSIS (Shows only after submit) */}
          <AnimatePresence>
            {isSubmitted && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="w-full max-w-3xl space-y-4 mt-4">
                
                {/* Specific AI Reason for making a mistake */}
                {selectedAnswers[currentQuestionIdx] !== currentQ.correct && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><AlertCircle className="w-24 h-24 text-red-500" /></div>
                    <h3 className="font-bold text-red-400 mb-2 flex items-center gap-2"><AlertCircle className="w-5 h-5"/> AI Mistake Analysis</h3>
                    <p className="text-red-200/80 leading-relaxed text-sm relative z-10">{currentQ.mistake_reason}</p>
                  </div>
                )}

                {/* The Shortcut Trick */}
                {currentQ.shortcut && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-2xl p-6 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Zap className="w-24 h-24 text-yellow-500" /></div>
                    <h3 className="font-bold text-yellow-500 mb-2 flex items-center gap-2"><Zap className="w-5 h-5 fill-yellow-500"/> Shortcut Trick</h3>
                    <p className="text-yellow-200/90 leading-relaxed text-sm relative z-10">{currentQ.shortcut}</p>
                  </div>
                )}

                {/* Standard Step-by-Step Concept */}
                <div className="bg-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
                  <h3 className="font-bold text-blue-400 mb-2 flex items-center gap-2"><Lightbulb className="w-5 h-5"/> Step-by-Step Logic</h3>
                  <p className="text-slate-300 leading-relaxed text-sm">{currentQ.step_by_step}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <br/><br/>{/* Layout spacer padding */}

          {/* Footer Navigation */}
          <div className="sticky bottom-0 bg-[#0a0a0f] border-t border-white/10 p-4 mt-auto w-full flex flex-wrap items-center justify-between gap-4 z-40 relative">
            <button 
              onClick={() => {
                const newSet = new Set(markedForReview);
                newSet.has(currentQuestionIdx) ? newSet.delete(currentQuestionIdx) : newSet.add(currentQuestionIdx);
                setMarkedForReview(newSet);
              }}
              className={`flex items-center gap-2 px-5 py-3 rounded-xl font-bold transition-colors text-sm ${markedForReview.has(currentQuestionIdx) ? 'bg-orange-500/20 text-orange-400' : 'bg-white/5 text-slate-300 hover:bg-white/10'}`}
            >
              <Flag className={`w-4 h-4 ${markedForReview.has(currentQuestionIdx) ? 'fill-orange-400' : ''}`} /> Marked
            </button>
            <div className="flex gap-3">
              <button 
                onClick={() => setCurrentQuestionIdx(prev => prev - 1)} disabled={currentQuestionIdx === 0}
                className="flex items-center gap-2 bg-white/5 border border-white/10 text-white px-5 py-3 rounded-xl font-bold hover:bg-white/10 disabled:opacity-30 transition"
              >
                <ChevronLeft className="w-5 h-5" /> Prev
              </button>
              
              {currentQuestionIdx === MOCK_QUESTIONS.length - 1 ? (
                <button 
                  onClick={() => setIsSubmitted(true)} disabled={isSubmitted}
                  className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white px-8 py-3 rounded-xl font-bold hover:shadow-[0_0_15px_rgba(16,185,129,0.5)] transition disabled:opacity-50"
                >
                  {isSubmitted ? "Submitted" : "Submit Test"} <CheckCircle2 className="w-5 h-5" />
                </button>
              ) : (
                <button 
                  onClick={() => setCurrentQuestionIdx(prev => prev + 1)}
                  className="flex items-center gap-2 bg-blue-600 border border-blue-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-blue-500 transition"
                >
                  Next <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Question Palette */}
        <div className="w-[320px] bg-[#12121a] border-l border-white/10 p-6 flex flex-col flex-shrink-0">
          <h3 className="text-lg font-bold text-white mb-6">Question Palette</h3>
          <div className="grid grid-cols-5 gap-3">
            {MOCK_QUESTIONS.map((_, idx) => {
              const isCurrent = currentQuestionIdx === idx;
              const isAnswered = selectedAnswers[idx] !== undefined;
              const isMarked = markedForReview.has(idx);

              let boxClass = "bg-white/5 border-white/10 text-slate-400"; 
              if (isAnswered) boxClass = "bg-blue-600/20 border-blue-500/50 text-blue-400"; 
              
              if (isSubmitted) {
                // Post-submission palette coloring
                if (isAnswered) {
                  boxClass = MOCK_QUESTIONS[idx].correct === selectedAnswers[idx] 
                    ? "bg-emerald-500/20 border-emerald-500 text-emerald-400" 
                    : "bg-red-500/20 border-red-500 text-red-400";
                }
              } else {
                if (isMarked && !isAnswered) boxClass = "bg-orange-500/20 border-orange-500/50 text-orange-400"; 
                if (isMarked && isAnswered) boxClass = "bg-orange-600 border-orange-500 text-white"; 
              }
              
              if (isCurrent) boxClass += " ring-2 ring-white scale-110 shadow-lg";

              return (
                <button
                  key={idx} onClick={() => setCurrentQuestionIdx(idx)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-sm border-2 transition-all hover:scale-105 ${boxClass}`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
