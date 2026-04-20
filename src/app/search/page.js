"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, BookOpen, BrainCircuit, Target, TrendingUp,
  Zap, Users, FileText, Hash, ArrowRight, Clock, X
} from "lucide-react";

// Knowledge base for search — organized by topic
const SEARCH_INDEX = [
  // Mathematics / Quantitative
  { name: "Ratio & Proportion", subject: "Quantitative Aptitude", exam: "SSC, Railway, Banking" },
  { name: "Percentage", subject: "Quantitative Aptitude", exam: "SSC, Railway, Banking" },
  { name: "Profit & Loss", subject: "Quantitative Aptitude", exam: "SSC CGL, SBI PO" },
  { name: "Time & Work", subject: "Quantitative Aptitude", exam: "SSC, Railway" },
  { name: "Time, Speed & Distance", subject: "Quantitative Aptitude", exam: "SSC, Railway, Banking" },
  { name: "Simple Interest", subject: "Quantitative Aptitude", exam: "Banking, SSC" },
  { name: "Compound Interest", subject: "Quantitative Aptitude", exam: "Banking, SBI PO" },
  { name: "Algebra", subject: "Quantitative Aptitude", exam: "SSC CGL, IBPS PO" },
  { name: "Trigonometry", subject: "Quantitative Aptitude", exam: "SSC CGL" },
  { name: "Geometry", subject: "Quantitative Aptitude", exam: "SSC CGL, NDA" },
  { name: "Mensuration", subject: "Quantitative Aptitude", exam: "SSC, Railway" },
  { name: "Number System", subject: "Quantitative Aptitude", exam: "SSC, Railway, Banking" },
  { name: "Average", subject: "Quantitative Aptitude", exam: "SSC, Railway, Banking" },
  { name: "Data Interpretation", subject: "Quantitative Aptitude", exam: "SBI PO, IBPS PO" },
  { name: "Mixture & Alligation", subject: "Quantitative Aptitude", exam: "SSC, Banking" },
  { name: "Pipes & Cisterns", subject: "Quantitative Aptitude", exam: "SSC, Railway" },
  // Reasoning
  { name: "Blood Relations", subject: "General Reasoning", exam: "SSC, Railway, Banking" },
  { name: "Coding Decoding", subject: "General Reasoning", exam: "SSC, Railway, Banking" },
  { name: "Syllogism", subject: "General Reasoning", exam: "Banking, SSC" },
  { name: "Direction & Distance", subject: "General Reasoning", exam: "SSC, Railway" },
  { name: "Mirror Images", subject: "General Reasoning", exam: "SSC, Railway" },
  { name: "Series Completion", subject: "General Reasoning", exam: "SSC, Railway, Banking" },
  { name: "Analogy", subject: "General Reasoning", exam: "SSC, Railway" },
  { name: "Venn Diagram", subject: "General Reasoning", exam: "SSC, Banking" },
  { name: "Statement & Conclusion", subject: "General Reasoning", exam: "Banking" },
  { name: "Seating Arrangement", subject: "General Reasoning", exam: "SBI PO, IBPS" },
  // GK
  { name: "Indian History", subject: "General Knowledge", exam: "SSC, Railway, Banking" },
  { name: "Indian Polity", subject: "General Knowledge", exam: "SSC, Railway, Banking" },
  { name: "Indian Geography", subject: "General Knowledge", exam: "SSC, Railway" },
  { name: "Indian Economy", subject: "General Knowledge", exam: "SSC CGL, SBI PO" },
  { name: "Physics", subject: "General Science", exam: "SSC, Railway" },
  { name: "Chemistry", subject: "General Science", exam: "SSC, Railway" },
  { name: "Biology", subject: "General Science", exam: "SSC, Railway" },
  { name: "Static GK", subject: "General Knowledge", exam: "SSC, Railway, Banking" },
  { name: "Current Affairs", subject: "General Knowledge", exam: "All Exams" },
  // English
  { name: "Reading Comprehension", subject: "English Language", exam: "SSC, Banking" },
  { name: "Fill in the Blanks", subject: "English Language", exam: "All Exams" },
  { name: "Error Detection", subject: "English Language", exam: "SSC CGL, SBI PO" },
  { name: "Sentence Improvement", subject: "English Language", exam: "SSC, Banking" },
  { name: "Synonyms & Antonyms", subject: "English Language", exam: "All Exams" },
  { name: "Idioms & Phrases", subject: "English Language", exam: "SSC CGL" },
  { name: "Cloze Test", subject: "English Language", exam: "Banking" },
];

const SUBJECT_ICONS = {
  "Quantitative Aptitude": Target,
  "General Reasoning": BrainCircuit,
  "General Knowledge": BookOpen,
  "General Science": Zap,
  "English Language": FileText,
  "Computer Awareness": Hash,
};

const SUBJECT_COLORS = {
  "Quantitative Aptitude": "blue",
  "General Reasoning": "purple",
  "General Knowledge": "emerald",
  "General Science": "orange",
  "English Language": "rose",
  "Computer Awareness": "indigo",
};

export default function SearchPage({ searchParams }) {
  const router = useRouter();
  const inputRef = useRef(null);
  const [query, setQuery] = useState(searchParams?.q || "");
  const [results, setResults] = useState([]);
  const [recentSearches, setRecentSearches] = useState([
    "Ratio & Proportion", "Indian Polity", "Syllogism"
  ]);

  // Search logic
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    const q = query.toLowerCase();
    const filtered = SEARCH_INDEX.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        item.exam.toLowerCase().includes(q)
    );
    setResults(filtered);
  }, [query]);

  // Focus on mount
  useEffect(() => {
    inputRef.current?.focus();
    if (searchParams?.q) setQuery(searchParams.q);
  }, []);

  const handleSelectTopic = (topic) => {
    // Save to recent
    setRecentSearches(prev => [topic, ...prev.filter(t => t !== topic)].slice(0, 5));
    // Go to quiz with this topic
    router.push(`/quiz?topic=${encodeURIComponent(topic)}`);
  };

  // Group results by subject
  const grouped = results.reduce((acc, item) => {
    if (!acc[item.subject]) acc[item.subject] = [];
    acc[item.subject].push(item);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      {/* Top Search Header */}
      <div className="sticky top-0 z-50 bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/5 px-4 py-4">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 bg-[#12121a] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl focus-within:border-blue-500/50 transition-colors">
            <Search className="w-5 h-5 text-slate-400 flex-shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search any topic, subject, or exam..."
              className="flex-1 bg-transparent outline-none text-white text-base placeholder-slate-500"
              onKeyDown={e => {
                if (e.key === "Enter" && results.length > 0) {
                  handleSelectTopic(results[0].name);
                }
              }}
            />
            {query && (
              <button onClick={() => setQuery("")}>
                <X className="w-4 h-4 text-slate-500 hover:text-white transition" />
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* No query → show recent + popular */}
        {!query && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Recent */}
            {recentSearches.length > 0 && (
              <div className="mb-8">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                  <Clock className="w-3.5 h-3.5" /> Recent Searches
                </div>
                <div className="flex flex-wrap gap-2">
                  {recentSearches.map((s, i) => (
                    <button
                      key={i}
                      onClick={() => setQuery(s)}
                      className="px-4 py-2 bg-white/5 border border-white/5 hover:border-blue-500/30 hover:bg-blue-500/5 rounded-xl text-sm text-slate-300 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Popular topics grid */}
            <div>
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">
                🔥 Popular Topics
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {SEARCH_INDEX.slice(0, 10).map((item, i) => {
                  const Icon = SUBJECT_ICONS[item.subject] || BookOpen;
                  const color = SUBJECT_COLORS[item.subject] || "blue";
                  return (
                    <motion.button
                      key={i}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                      onClick={() => handleSelectTopic(item.name)}
                      className="flex items-center gap-4 p-4 bg-[#12121a] border border-white/5 rounded-2xl hover:border-white/15 hover:bg-white/[0.03] transition-all group text-left"
                    >
                      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform`}>
                        <Icon className={`w-5 h-5 text-${color}-400`} />
                      </div>
                      <div className="min-w-0">
                        <div className="font-bold text-white text-sm">{item.name}</div>
                        <div className="text-xs text-slate-500 mt-0.5 truncate">{item.subject} · {item.exam}</div>
                      </div>
                      <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 ml-auto flex-shrink-0 transition" />
                    </motion.button>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* Results */}
        {query && (
          <AnimatePresence mode="wait">
            {results.length === 0 ? (
              <motion.div
                key="no-results"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="text-5xl mb-4">🔍</div>
                <h2 className="text-xl font-bold text-white mb-2">No results for "{query}"</h2>
                <p className="text-slate-400 text-sm">Try searching for "Ratio", "Polity", "Coding Decoding"...</p>
              </motion.div>
            ) : (
              <motion.div key="results" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="text-xs font-bold text-slate-500 mb-5 uppercase tracking-wider">
                  {results.length} topic{results.length !== 1 ? "s" : ""} found for "{query}"
                </div>

                {Object.entries(grouped).map(([subject, items]) => {
                  const Icon = SUBJECT_ICONS[subject] || BookOpen;
                  const color = SUBJECT_COLORS[subject] || "blue";
                  return (
                    <div key={subject} className="mb-6">
                      <div className={`flex items-center gap-2 text-${color}-400 text-xs font-bold uppercase tracking-wider mb-3`}>
                        <Icon className="w-4 h-4" /> {subject}
                      </div>
                      <div className="space-y-2">
                        {items.map((item, i) => (
                          <motion.button
                            key={i}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            onClick={() => handleSelectTopic(item.name)}
                            className="w-full flex items-center gap-4 p-4 bg-[#12121a] border border-white/5 rounded-xl hover:border-blue-500/30 hover:bg-blue-500/5 transition-all group text-left"
                          >
                            <div className={`w-9 h-9 rounded-lg bg-${color}-500/10 flex items-center justify-center flex-shrink-0`}>
                              <Icon className={`w-4 h-4 text-${color}-400`} />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-white text-sm group-hover:text-blue-300 transition">{item.name}</div>
                              <div className="text-xs text-slate-500 mt-0.5">{item.exam}</div>
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0">
                              <span className="text-xs text-slate-500 hidden sm:block">Practice</span>
                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition" />
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
