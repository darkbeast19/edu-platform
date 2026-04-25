"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen, BrainCircuit, Target, TrendingUp, Zap, FileText,
  CheckCircle2, ChevronRight, ArrowLeft, PlayCircle, Hash, Users
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

// Subject name translations
const SUBJECT_NAMES_HI = {
  "Quantitative Aptitude": "मात्रात्मक योग्यता",
  "General Reasoning": "सामान्य तर्कशक्ति",
  "English Language": "अंग्रेजी भाषा",
  "General Knowledge": "सामान्य ज्ञान",
  "Numerical Ability": "संख्यात्मक योग्यता",
  "English": "अंग्रेजी",
  "Mathematics": "गणित",
  "General Intelligence": "सामान्य बुद्धिमत्ता",
  "General Awareness": "सामान्य जागरूकता",
  "General Science": "सामान्य विज्ञान",
  "Reasoning Ability": "तर्कशक्ति",
  "General/Economy/Banking Awareness": "सामान्य/अर्थव्यवस्था/बैंकिंग जागरूकता",
  "General/Financial Awareness": "सामान्य/वित्तीय जागरूकता",
  "Computer Awareness": "कंप्यूटर जागरूकता",
  "General Ability Test": "सामान्य योग्यता परीक्षा",
};

const subjectName = (name, lang) => (lang === 'hi' && SUBJECT_NAMES_HI[name]) ? SUBJECT_NAMES_HI[name] : name;

// Exam data — slug → details
const EXAM_DATA = {
  "ssc-cgl": {
    name: "SSC CGL", fullName: "Staff Selection Commission — Combined Graduate Level",
    difficulty: "Moderate–Hard", totalQuestions: "12,000+", color: "blue",
    subjects: [
      { name: "Quantitative Aptitude", slug: "quant", icon: Target, color: "blue", description: "Ratios, Algebra, Geometry, DI", topics: 24 },
      { name: "General Reasoning", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Blood Relations, Syllogism, Coding", topics: 18 },
      { name: "English Language", slug: "english", icon: FileText, color: "rose", description: "Comprehension, Grammar, Vocabulary", topics: 15 },
      { name: "General Knowledge", slug: "gk", icon: BookOpen, color: "emerald", description: "History, Polity, Geography, Science", topics: 30 },
    ]
  },
  "ssc-chsl": {
    name: "SSC CHSL", fullName: "Combined Higher Secondary Level",
    difficulty: "Easy–Moderate", totalQuestions: "8,500+", color: "blue",
    subjects: [
      { name: "Quantitative Aptitude", slug: "quant", icon: Target, color: "blue", description: "Arithmetic, Numbers, Geometry", topics: 18 },
      { name: "General Reasoning", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Directions, Series, Analogies", topics: 15 },
      { name: "English Language", slug: "english", icon: FileText, color: "rose", description: "Fill Blanks, Error Spotting", topics: 12 },
      { name: "General Knowledge", slug: "gk", icon: BookOpen, color: "emerald", description: "Static GK, Current Affairs", topics: 22 },
    ]
  },
  "ssc-mts": {
    name: "SSC MTS", fullName: "Multi-Tasking Staff",
    difficulty: "Easy", totalQuestions: "5,000+", color: "blue",
    subjects: [
      { name: "Numerical Ability", slug: "quant", icon: Target, color: "blue", description: "Basic Arithmetic, Numbers", topics: 12 },
      { name: "General Reasoning", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Pattern Recognition, Series", topics: 10 },
      { name: "English", slug: "english", icon: FileText, color: "rose", description: "Basic Grammar, Vocabulary", topics: 8 },
      { name: "General Knowledge", slug: "gk", icon: BookOpen, color: "emerald", description: "Basic GK, Current Events", topics: 15 },
    ]
  },
  "railway-ntpc": {
    name: "Railway NTPC", fullName: "Non-Technical Popular Category",
    difficulty: "Moderate", totalQuestions: "8,000+", color: "purple",
    subjects: [
      { name: "Mathematics", slug: "quant", icon: Target, color: "blue", description: "Number System, Percentage, Mensuration", topics: 20 },
      { name: "General Intelligence", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Analogies, Coding, Puzzles", topics: 16 },
      { name: "General Awareness", slug: "gk", icon: BookOpen, color: "emerald", description: "History, Geography, Current Affairs", topics: 25 },
    ]
  },
  "railway-group-d": {
    name: "Railway Group D", fullName: "Level 1 Posts - RRB",
    difficulty: "Easy", totalQuestions: "6,000+", color: "purple",
    subjects: [
      { name: "Mathematics", slug: "quant", icon: Target, color: "blue", description: "Basic Maths, BODMAS, Percentage", topics: 15 },
      { name: "General Intelligence", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Analogies, Non-Verbal", topics: 12 },
      { name: "General Science", slug: "science", icon: Zap, color: "orange", description: "Physics, Chemistry, Biology", topics: 18 },
      { name: "General Awareness", slug: "gk", icon: BookOpen, color: "emerald", description: "Current Affairs, Railway GK", topics: 20 },
    ]
  },
  "sbi-po": {
    name: "SBI PO", fullName: "State Bank of India — Probationary Officer",
    difficulty: "Hard", totalQuestions: "15,000+", color: "indigo",
    subjects: [
      { name: "Quantitative Aptitude", slug: "quant", icon: Target, color: "blue", description: "Data Interpretation, Arithmetic, Algebra", topics: 28 },
      { name: "Reasoning Ability", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Puzzles, Seating, Blood Relations", topics: 22 },
      { name: "English Language", slug: "english", icon: FileText, color: "rose", description: "Reading Comprehension, Cloze Test", topics: 18 },
      { name: "General/Economy/Banking Awareness", slug: "banking-gk", icon: BookOpen, color: "emerald", description: "Banking Terms, Economy, Current Affairs", topics: 20 },
    ]
  },
  "ibps-clerk": {
    name: "IBPS Clerk", fullName: "Institute of Banking Personnel Selection — Clerk",
    difficulty: "Moderate", totalQuestions: "10,000+", color: "indigo",
    subjects: [
      { name: "Quantitative Aptitude", slug: "quant", icon: Target, color: "blue", description: "Simplification, Number Series, DI", topics: 20 },
      { name: "Reasoning Ability", slug: "reasoning", icon: BrainCircuit, color: "purple", description: "Puzzles, Inequalities, Syllogism", topics: 18 },
      { name: "English Language", slug: "english", icon: FileText, color: "rose", description: "Grammar, Vocabulary, Comprehension", topics: 15 },
      { name: "General/Financial Awareness", slug: "banking-gk", icon: BookOpen, color: "emerald", description: "Banking GK, Static GK", topics: 16 },
      { name: "Computer Awareness", slug: "computer", icon: Hash, color: "indigo", description: "MS Office, Internet, Hardware", topics: 8 },
    ]
  },
  "nda": {
    name: "NDA", fullName: "National Defence Academy",
    difficulty: "Hard", totalQuestions: "6,000+", color: "orange",
    subjects: [
      { name: "Mathematics", slug: "quant", icon: Target, color: "blue", description: "Advanced Maths, Matrices, Calculus", topics: 25 },
      { name: "General Ability Test", slug: "gat", icon: BrainCircuit, color: "purple", description: "Physics, Chemistry, Biology, GK", topics: 30 },
      { name: "English", slug: "english", icon: FileText, color: "rose", description: "Grammar, Comprehension, Vocabulary", topics: 15 },
    ]
  },
};

// Also handle category-level slugs
const CATEGORY_TO_EXAMS = {
  "ssc": ["ssc-cgl", "ssc-chsl", "ssc-mts"],
  "railway": ["railway-ntpc", "railway-group-d"],
  "banking": ["sbi-po", "ibps-clerk"],
  "defence": ["nda"],
};

const DIFFICULTY_BADGE = {
  "Easy": "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Moderate": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  "Easy–Moderate": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  "Moderate–Hard": "text-orange-400 bg-orange-500/10 border-orange-500/20",
  "Hard": "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function ExamDetailPage({ params }) {
  const router = useRouter();
  const { language } = useLanguage();
  // Next.js 15: params is a Promise — must unwrap with React.use()
  const resolvedParams = React.use(params);
  const slug = resolvedParams.slug;

  // Check if it's a category (not a specific exam)
  const isCategoryPage = !!CATEGORY_TO_EXAMS[slug];
  const categoryExams = isCategoryPage ? CATEGORY_TO_EXAMS[slug] : null;

  const exam = EXAM_DATA[slug];

  const [selectedSubjects, setSelectedSubjects] = React.useState([]);
  const [configQCount,     setConfigQCount]     = React.useState(10);
  const [configDifficulty, setConfigDifficulty] = React.useState("Intermediate");
  const [step,             setStep]             = React.useState("select"); // "select" | "configure"

  const toggleSubject = (subjectSlug) => {
    setSelectedSubjects(prev =>
      prev.includes(subjectSlug)
        ? prev.filter(s => s !== subjectSlug)
        : [...prev, subjectSlug]
    );
  };

  const handleSelectAll = () => {
    if (!exam) return;
    if (selectedSubjects.length === exam.subjects.length) {
      setSelectedSubjects([]);
    } else {
      setSelectedSubjects(exam.subjects.map(s => s.slug));
    }
  };

  const handleStartQuiz = () => {
    if (selectedSubjects.length === 0) return;
    const topicNames = selectedSubjects.map(slug => {
      const subj = exam.subjects.find(s => s.slug === slug);
      return subj ? subj.name : slug;
    });
    const topicsParam = encodeURIComponent(topicNames.join(","));
    router.push(`/quiz?topics=${topicsParam}&count=${configQCount}&difficulty=${encodeURIComponent(configDifficulty)}&exam=${exam?.name || slug}`);
  };

  // Category page — show list of exams under that category
  if (isCategoryPage) {
    const categoryName = slug.charAt(0).toUpperCase() + slug.slice(1);
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <Link href="/exams" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition">
            <ArrowLeft className="w-4 h-4" /> {language === 'hi' ? 'सभी परीक्षाओं पर वापस' : 'Back to All Exams'}
          </Link>
          <h1 className="text-3xl font-extrabold text-white mb-2">{categoryName} Exams</h1>
          <p className="text-slate-400 mb-10">Select an exam to browse its subjects and start practice.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {categoryExams.map((examSlug, i) => {
              const e = EXAM_DATA[examSlug];
              if (!e) return null;
              return (
                <motion.div
                  key={examSlug}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }}
                >
                  <Link href={`/exam/${examSlug}`}>
                    <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:bg-white/[0.03] transition-all cursor-pointer group">
                      <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-white text-xl group-hover:text-blue-400 transition">{e.name}</h3>
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${DIFFICULTY_BADGE[e.difficulty]}`}>
                          {e.difficulty}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm mb-4">{e.fullName}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">{e.totalQuestions} Questions · {e.subjects.length} Subjects</span>
                        <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-blue-400 transition" />
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Unknown exam slug
  if (!exam) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center text-slate-400">
        <div className="text-center">
          <div className="text-6xl mb-4">🔍</div>
          <h2 className="text-2xl font-bold text-white mb-2">Exam not found</h2>
          <Link href="/exams" className="text-blue-400 hover:underline">← Back to Exams</Link>
        </div>
      </div>
    );
  }

  const allSelected = selectedSubjects.length === exam.subjects.length;
  const noneSelected = selectedSubjects.length === 0;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex flex-col">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 py-10 w-full">
        {/* Breadcrumb */}
        <Link href="/exams" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition">
          <ArrowLeft className="w-4 h-4" /> {language === 'hi' ? 'सभी परीक्षाएं' : 'All Exams'}
        </Link>

        {/* Exam Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white">{exam.name}</h1>
            <span className={`text-xs font-bold px-3 py-1 rounded-full border ${DIFFICULTY_BADGE[exam.difficulty]}`}>
              {exam.difficulty}
            </span>
          </div>
          <p className="text-slate-400 mb-2">{exam.fullName}</p>
          <p className="text-sm text-slate-500">{exam.totalQuestions} questions available</p>
        </motion.div>

        {/* Step 1: Subject Selection */}
        <AnimatePresence mode="wait">
          {step === "select" && (
            <motion.div key="select" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, x: -20 }}>
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-bold text-white">
                  {language === 'hi' ? 'विषय चुनें' : `Select Subject${selectedSubjects.length > 1 ? 's' : ''}`}
                  {selectedSubjects.length > 0 && (
                    <span className="ml-2 text-blue-400 text-sm font-medium">({selectedSubjects.length} {language === 'hi' ? 'चयनित' : 'selected'})</span>
                  )}
                </h2>
                <button
                  onClick={handleSelectAll}
                  className="text-xs font-bold text-blue-400 hover:text-blue-300 transition px-3 py-1.5 bg-blue-500/10 rounded-lg border border-blue-500/20"
                >
                  {allSelected ? (language === 'hi' ? 'सभी हटाएं' : 'Deselect All') : (language === 'hi' ? 'सभी चुनें' : 'Select All')}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {exam.subjects.map((subject, i) => {
                  const Icon = subject.icon || BookOpen;
                  const isSelected = selectedSubjects.includes(subject.slug);
                  return (
                    <motion.button
                      key={subject.slug}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                      onClick={() => toggleSubject(subject.slug)}
                      className={`relative text-left p-5 rounded-2xl border-2 transition-all group overflow-hidden ${
                        isSelected
                          ? `border-${subject.color}-500 bg-${subject.color}-500/10`
                          : "border-white/5 bg-[#12121a] hover:border-white/15"
                      }`}
                    >
                      {/* Selection tick */}
                      {isSelected && (
                        <div className="absolute top-3 right-3">
                          <CheckCircle2 className={`w-5 h-5 text-${subject.color}-400`} />
                        </div>
                      )}

                      <div className="flex items-start gap-4">
                        <div className={`w-11 h-11 rounded-xl bg-${subject.color}-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-105 transition-transform`}>
                          <Icon className={`w-5 h-5 text-${subject.color}-400`} />
                        </div>
                        <div>
                          <div className="font-bold text-white mb-1 text-sm pr-6">{subjectName(subject.name, language)}</div>
                          <div className="text-xs text-slate-400 leading-relaxed">{subject.description}</div>
                          <div className="text-xs text-slate-500 mt-2">{subject.topics} {language === 'hi' ? 'उप-विषय' : 'topics'}</div>
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Sticky bottom bar */}
              <div className={`sticky bottom-4 transition-all ${noneSelected ? "opacity-50 pointer-events-none" : "opacity-100"}`}>
                <div className="bg-[#12121a]/95 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl">
                  <div>
                    <div className="text-white font-bold text-sm">
                      {noneSelected
                        ? (language === 'hi' ? 'कम से कम 1 विषय चुनें' : 'Select at least 1 subject')
                        : `${selectedSubjects.length} ${language === 'hi' ? 'विषय चयनित' : `subject${selectedSubjects.length > 1 ? 's' : ''} selected`}`}
                    </div>
                    <div className="text-slate-400 text-xs mt-0.5">
                      {selectedSubjects.map(sl => subjectName(exam.subjects.find(s => s.slug === sl)?.name || '', language)).filter(Boolean).join(", ")}
                    </div>
                  </div>
                  <button
                    onClick={() => setStep("configure")}
                    disabled={noneSelected}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all disabled:opacity-40"
                  >
                    {language === 'hi' ? 'क्विज़ कॉन्फ़िगर करें' : 'Configure Quiz'} <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Configure */}
          {step === "configure" && (
            <motion.div key="configure" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0 }}>
              <button
                onClick={() => setStep("select")}
                className="text-slate-400 hover:text-white text-sm flex items-center gap-2 mb-8 transition"
              >
                <ArrowLeft className="w-4 h-4" /> {language === 'hi' ? 'विषय चयन पर वापस जाएं' : 'Back to Subject Selection'}
              </button>

              <h2 className="text-2xl font-bold text-white mb-2">{language === 'hi' ? 'क्विज़ कॉन्फ़िगर करें' : 'Configure Your Quiz'}</h2>
              <p className="text-slate-400 text-sm mb-8">
                {language === 'hi' ? 'इन विषयों के प्रश्न शामिल होंगे:' : 'Questions will be mixed from:'} <span className="text-blue-400 font-semibold">
                  {selectedSubjects.map(sl => subjectName(exam.subjects.find(s => s.slug === sl)?.name || '', language)).filter(Boolean).join(", ")}
                </span>
              </p>

              <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 sm:p-8 space-y-8 mb-8">
                {/* Topic summary badges */}
                <div className="flex flex-wrap gap-2">
                  {selectedSubjects.map(sl => {
                    const subj = exam.subjects.find(s => s.slug === sl);
                    if (!subj) return null;
                    const Icon = subj.icon || BookOpen;
                    return (
                      <div key={sl} className={`flex items-center gap-2 px-3 py-1.5 bg-${subj.color}-500/10 border border-${subj.color}-500/20 rounded-lg`}>
                        <Icon className={`w-3.5 h-3.5 text-${subj.color}-400`} />
                        <span className={`text-xs font-bold text-${subj.color}-400`}>{subj.name}</span>
                      </div>
                    );
                  })}
                </div>

                {/* Question Count */}
                <div>
                  <label className="text-slate-400 text-xs font-bold tracking-wider mb-4 block uppercase">{language === 'hi' ? 'प्रश्नों की संख्या' : 'Number of Questions'}</label>
                  <div className="grid grid-cols-4 gap-3">
                    {[10, 20, 30, 50].map(num => (
                      <button
                        key={num}
                        onClick={() => setConfigQCount(num)}
                        className={`py-3 rounded-xl font-bold transition-all border text-sm ${
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
                  <label className="text-slate-400 text-xs font-bold tracking-wider mb-4 block uppercase">{language === 'hi' ? 'कठिनाई स्तर' : 'Difficulty Level'}</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "Beginner",     labelHi: "शुरुआती", emoji: "🟢" },
                      { label: "Intermediate", labelHi: "मध्यम",   emoji: "🟡" },
                      { label: "Hard Mode",    labelHi: "कठिन",    emoji: "🔴" },
                    ].map(({ label, labelHi, emoji }) => (
                      <button
                        key={label}
                        onClick={() => setConfigDifficulty(label)}
                        className={`py-3 rounded-xl font-bold transition-all border text-sm ${
                          configDifficulty === label
                            ? "bg-purple-600/20 border-purple-500 text-purple-400"
                            : "bg-[#0a0a0f] border-white/10 text-slate-400 hover:border-slate-500"
                        }`}
                      >
                        {emoji} {language === 'hi' ? labelHi : label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time estimate */}
                <div className="flex items-center gap-3 p-4 bg-white/5 rounded-xl border border-white/5 text-sm text-slate-400">
                  <Users className="w-4 h-4 text-blue-400 flex-shrink-0" />
                  Estimated time: ~{Math.ceil(configQCount * 1.5)} minutes · {configQCount} AI-generated questions
                </div>
              </div>

              {/* Start Button */}
              <button
                onClick={handleStartQuiz}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg flex justify-center items-center gap-3 hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:-translate-y-0.5 transition-all"
              >
                <PlayCircle className="w-6 h-6" />
                {language === 'hi' ? 'अभ्यास शुरू करें' : 'Enter Arena — Start Quiz'}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
