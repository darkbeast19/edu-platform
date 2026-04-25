"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Search,
  ChevronRight,
  Target,
  TrendingUp,
  BrainCircuit,
  Zap,
  Users,
  Clock,
  FileText,
  ArrowRight,
  Flame,
  Filter,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const ALL_EXAMS = [
  {
    name: "SSC CGL",
    slug: "ssc-cgl",
    category: "ssc",
    description: "Staff Selection Commission — Combined Graduate Level",
    questions: "12,000+",
    subjects: ["Quant", "Reasoning", "English", "GK"],
    difficulty: "Moderate",
  },
  {
    name: "SSC CHSL",
    slug: "ssc-chsl",
    category: "ssc",
    description: "Combined Higher Secondary Level",
    questions: "8,500+",
    subjects: ["Quant", "Reasoning", "English", "GK"],
    difficulty: "Easy–Moderate",
  },
  {
    name: "Railway NTPC",
    slug: "railway-ntpc",
    category: "railway",
    description: "Non-Technical Popular Category",
    questions: "8,000+",
    subjects: ["Maths", "Reasoning", "GK & Current Affairs"],
    difficulty: "Moderate",
  },
  {
    name: "Railway Group D",
    slug: "railway-group-d",
    category: "railway",
    description: "Level 1 Posts under Railway Recruitment",
    questions: "6,000+",
    subjects: ["Maths", "Reasoning", "GK", "Science"],
    difficulty: "Easy",
  },
  {
    name: "SBI PO",
    slug: "sbi-po",
    category: "banking",
    description: "State Bank of India — Probationary Officer",
    questions: "15,000+",
    subjects: ["Quant", "Reasoning", "English", "GK"],
    difficulty: "Hard",
  },
  {
    name: "IBPS Clerk",
    slug: "ibps-clerk",
    category: "banking",
    description: "Institute of Banking Personnel Selection — Clerk",
    questions: "10,000+",
    subjects: ["Quant", "Reasoning", "English", "Computer"],
    difficulty: "Moderate",
  },
  {
    name: "SSC MTS",
    slug: "ssc-mts",
    category: "ssc",
    description: "Multi-Tasking Staff Selection",
    questions: "5,000+",
    subjects: ["Numerical Ability", "Reasoning", "English", "GK"],
    difficulty: "Easy",
  },
  {
    name: "NDA",
    slug: "nda",
    category: "defence",
    description: "National Defence Academy Entrance",
    questions: "6,000+",
    subjects: ["Maths", "GAT", "English"],
    difficulty: "Hard",
  },
];

const SUBJECTS = [
  { name: "Quantitative Aptitude", slug: "quant", topics: 24, icon: Target },
  { name: "General Reasoning", slug: "reasoning", topics: 18, icon: BrainCircuit },
  { name: "English Language", slug: "english", topics: 15, icon: FileText },
  { name: "General Knowledge", slug: "gk", topics: 30, icon: BookOpen },
  { name: "Current Affairs", slug: "current-affairs", topics: 12, icon: TrendingUp },
  { name: "Computer Awareness", slug: "computer", topics: 8, icon: Zap },
];

const TOPICS_BY_SUBJECT = {
  quant: [
    "Ratio & Proportion", "Percentage", "Profit & Loss", "Time & Work",
    "Simple Interest", "Compound Interest", "Algebra", "Trigonometry",
    "Geometry", "Mensuration", "Number System", "Average",
  ],
  reasoning: [
    "Blood Relations", "Coding Decoding", "Syllogism", "Direction & Distance",
    "Mirror Images", "Series Completion", "Analogy", "Venn Diagram",
  ],
  english: [
    "Reading Comprehension", "Fill in the Blanks", "Error Detection",
    "Sentence Improvement", "Synonyms & Antonyms", "Idioms & Phrases",
  ],
  gk: [
    "Indian History", "Indian Polity", "Indian Geography", "Economics",
    "Physics", "Chemistry", "Biology", "Static GK",
  ],
};

const DIFFICULTY_COLOR = {
  Easy: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  "Easy–Moderate": "text-blue-400 bg-blue-500/10 border-blue-500/20",
  Moderate: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Hard: "text-rose-400 bg-rose-500/10 border-rose-500/20",
};

export default function ExamsPage() {
  const [activeTab, setActiveTab] = React.useState("exams"); // "exams" or "subjects"
  const [categoryFilter, setCategoryFilter] = React.useState("all");
  const [selectedSubject, setSelectedSubject] = React.useState(null);
  const [searchQuery, setSearchQuery] = React.useState("");

  const [dbExams, setDbExams] = React.useState([]);
  const [dbSubjects, setDbSubjects] = React.useState([]);
  const [dbTopics, setDbTopics] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const { language } = useLanguage();

  React.useEffect(() => {
    async function fetchTaxonomy() {
      try {
        const { createClient } = await import('@/lib/supabase/client');
        const supabase = createClient();
        
        const [examsRes, subjectsRes, topicsRes] = await Promise.all([
          supabase.from('exams').select('*').order('name'),
          supabase.from('subjects').select('*').order('name'),
          supabase.from('topics').select('*, subjects(slug)')
        ]);

        if (examsRes.data && examsRes.data.length > 0) {
          // Map DB exams to required structure
           const mappedExams = examsRes.data.map(e => ({
             name: e.name,
             slug: e.slug,
             category: e.category,
             description: "Live Exam from Database",
             questions: "0+", 
             subjects: ["General"],
             difficulty: "Moderate"
           }));
           setDbExams(mappedExams);
        }

        if (subjectsRes.data && subjectsRes.data.length > 0) {
           const mappedSubjects = subjectsRes.data.map(s => ({
             name: s.name,
             slug: s.slug,
             topics: 0,
             icon: BookOpen
           }));
           
           // Group topics by subject slug
           const topicsBySub = {};
           if (topicsRes.data) {
             topicsRes.data.forEach(t => {
               const subSlug = t.subjects?.slug;
               if (subSlug) {
                 if (!topicsBySub[subSlug]) topicsBySub[subSlug] = [];
                 topicsBySub[subSlug].push(t.name);
                 
                 // Update topics count
                 const subject = mappedSubjects.find(sub => sub.slug === subSlug);
                 if (subject) subject.topics += 1;
               }
             });
           }
           
           setDbSubjects(mappedSubjects);
           setDbTopics(topicsBySub);
        }
      } catch (err) {
        console.error("Failed to load DB taxonomy", err);
      } finally {
        setLoading(false);
      }
    }
    fetchTaxonomy();
  }, []);

  const currentExams = dbExams.length > 0 ? dbExams : ALL_EXAMS;
  const currentSubjects = dbSubjects.length > 0 ? dbSubjects : SUBJECTS;
  const currentTopics = Object.keys(dbTopics).length > 0 ? dbTopics : TOPICS_BY_SUBJECT;

  const filteredExams = currentExams.filter((exam) => {
    const matchesCategory = categoryFilter === "all" || exam.category === categoryFilter;
    const matchesSearch =
      !searchQuery ||
      exam.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (exam.description && exam.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const categories = [
    { label: language === 'en' ? "All" : "सभी", value: "all" },
    { label: "SSC", value: "ssc" },
    { label: language === 'en' ? "Railway" : "रेलवे", value: "railway" },
    { label: language === 'en' ? "Banking" : "बैंकिंग", value: "banking" },
    { label: language === 'en' ? "Defence" : "रक्षा", value: "defence" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {language === 'en' ? 'Explore Exams & Topics' : 'परीक्षाएं और विषय एक्सप्लोर करें'}
          </h1>
          <p className="text-slate-400 max-w-xl text-sm sm:text-base mb-8">
            {language === 'en' ? 'Browse by exam or drill down into specific subjects and topics.' : 'परीक्षा के अनुसार ब्राउज़ करें या विशिष्ट विषयों और उप-विषयों में गहराई से जाएं।'}
          </p>

          {/* Search */}
          <div className="relative max-w-xl mb-8">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={language === 'en' ? "Search exams, subjects, or topics..." : "परीक्षाएं, विषय या उप-विषय खोजें..."}
              className="w-full pl-12 pr-4 py-3.5 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm"
            />
          </div>

          {/* Tab Toggle */}
          <div className="flex gap-1 bg-white/5 rounded-xl p-1 w-fit mb-8">
            {["exams", "subjects"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-5 py-2.5 rounded-lg text-sm font-bold capitalize transition-all ${
                  activeTab === tab
                    ? "bg-white/10 text-white"
                    : "text-slate-500 hover:text-slate-300"
                }`}
              >
                {tab === 'exams' ? (language === 'en' ? 'Exams' : 'परीक्षाएं') : (language === 'en' ? 'Subjects' : 'विषय')}
              </button>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 pb-16 sm:pb-24 flex-1">
        {activeTab === "exams" ? (
          <>
            {/* Category Filter Chips */}
            <div className="flex gap-2 mb-8 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  onClick={() => setCategoryFilter(cat.value)}
                  className={`px-4 py-2 rounded-xl text-sm font-bold transition-all border ${
                    categoryFilter === cat.value
                      ? "bg-blue-500/15 border-blue-500/30 text-blue-400"
                      : "bg-white/5 border-white/5 text-slate-400 hover:border-white/15 hover:text-slate-300"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Exam Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
              {filteredExams.map((exam, i) => (
                <motion.div
                  key={exam.slug}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link href={`/exam/${exam.slug}`}>
                    <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all cursor-pointer group hover-lift">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                            {exam.name}
                          </h3>
                          <p className="text-slate-500 text-xs mt-1">
                            {exam.description}
                          </p>
                        </div>
                        <span
                          className={`text-xs font-bold px-2.5 py-1 rounded-lg border ${
                            DIFFICULTY_COLOR[exam.difficulty]
                          }`}
                        >
                          {exam.difficulty}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {exam.subjects.map((s) => (
                          <span
                            key={s}
                            className="text-xs font-medium text-slate-400 bg-white/5 px-2.5 py-1 rounded-lg"
                          >
                            {s}
                          </span>
                        ))}
                      </div>

                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500 font-medium">
                          {exam.questions} {language === 'en' ? 'Questions' : 'प्रश्न'}
                        </span>
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          {language === 'en' ? 'Start Practice' : 'अभ्यास शुरू करें'} <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </>
        ) : (
          /* ── Subjects Tab ── */
          <>
            {selectedSubject ? (
              /* Topic View for Selected Subject */
              <div>
                <button
                  onClick={() => setSelectedSubject(null)}
                  className="text-sm text-slate-400 hover:text-white mb-6 flex items-center gap-1 transition-colors"
                >
                  ← {language === 'en' ? 'Back to Subjects' : 'विषयों पर वापस जाएं'}
                </button>
                <h2 className="text-2xl font-bold text-white mb-6">
                  {currentSubjects.find((s) => s.slug === selectedSubject)?.name} — {language === 'en' ? 'Topics' : 'उप-विषय'}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {(currentTopics[selectedSubject] || []).map((topic, i) => (
                    <motion.div
                      key={topic}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.04 }}
                    >
                      <Link href={`/notes/${encodeURIComponent(topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-'))}`}>
                        <div className="bg-[#12121a] border border-white/5 rounded-xl p-5 hover:border-blue-500/30 hover:bg-blue-500/5 transition-all cursor-pointer group flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-slate-400 font-mono text-xs font-bold group-hover:bg-blue-500/10 group-hover:text-blue-400 transition-colors">
                              {i + 1}
                            </div>
                            <span className="font-semibold text-slate-200 text-sm group-hover:text-white transition-colors">
                              {topic}
                            </span>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-blue-400 transition-colors" />
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>
            ) : (
              /* Subject Grid */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
                {currentSubjects.map((subject, i) => {
                  const Icon = subject.icon || BookOpen;
                  return (
                    <motion.div
                      key={subject.slug}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.08 }}
                      onClick={() => setSelectedSubject(subject.slug)}
                      className="bg-[#12121a] border border-white/5 rounded-2xl p-6 hover:border-white/15 transition-all cursor-pointer group hover-lift"
                    >
                      <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <h3 className="font-bold text-white text-lg mb-1">
                        {subject.name}
                      </h3>
                      <p className="text-slate-500 text-sm">
                        {subject.topics} {language === 'en' ? 'topics available' : 'उप-विषय उपलब्ध हैं'}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
}
