"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { 
  Search, 
  Flame, 
  Target, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  Zap,
  Users,
  BarChart3,
  ChevronRight
} from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";

const getExamCategories = (lang) => [
  { name: t('exam.ssc', lang),      count: lang === 'en' ? "12k+ Questions" : "12k+ प्रश्न", icon: Target,      color: "blue",    slug: "ssc"       },
  { name: t('exam.railway', lang),  count: lang === 'en' ? "8k+ Questions"  : "8k+ प्रश्न",  icon: TrendingUp,  color: "purple",  slug: "railway"   },
  { name: t('exam.banking', lang),  count: lang === 'en' ? "15k+ Questions" : "15k+ प्रश्न", icon: BookOpen,    color: "indigo",  slug: "banking"   },
  { name: t('exam.stateGovt', lang),count: lang === 'en' ? "5k+ Questions"  : "5k+ प्रश्न",  icon: BrainCircuit,color: "emerald", slug: "state-govt" },
  { name: t('exam.defence', lang),  count: lang === 'en' ? "6k+ Questions"  : "6k+ प्रश्न",  icon: Zap,         color: "orange",  slug: "defence"   },
  { name: t('exam.teaching', lang), count: lang === 'en' ? "4k+ Questions"  : "4k+ प्रश्न",  icon: Users,       color: "rose",    slug: "teaching"  },
];

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [solvedCount, setSolvedCount] = useState(0);
  const { language } = useLanguage();

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUser(user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        if (profile) setProfile(profile);

        // Fetch Real Answer Stats
        const { count: totalQuestions } = await supabase
          .from('user_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);
        if (totalQuestions !== null) setSolvedCount(totalQuestions);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex items-center justify-center font-bold text-xl">{t('dashboard.loading', language)}</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-purple-500/30">
      <Navbar />

      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-4">
            {t('dashboard.welcomePrefix', language)} {profile?.full_name?.split(' ')[0] || profile?.username || t('common.student', language)}?
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            {t('dashboard.subheading', language)}
          </p>
        </div>

        {/* Big Search Bar */}
        <div className="max-w-3xl mx-auto mb-16 relative">
          {/* Background Glow */}
          <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
          
          <form onSubmit={handleSearch} className="relative flex items-center bg-[#12121a] border border-white/10 rounded-2xl p-2 shadow-2xl">
            <div className="pl-4 pr-2">
              <Search className="w-6 h-6 text-slate-400" />
            </div>
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('dashboard.searchPlaceholder', language)}
              className="bg-transparent border-none outline-none text-base sm:text-lg text-white w-full py-4 px-2 placeholder-slate-500"
            />
            <button type="submit" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-bold text-sm tracking-wide hidden sm:block hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
              {t('common.search', language)}
            </button>
          </form>
        </div>

        {/* Quick Exam Categories */}
        <div className="mb-16">
          <h2 className="text-xl font-bold text-white mb-6">{t('dashboard.popularExams', language)}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {getExamCategories(language).map((cat, i) => {
              const Icon = cat.icon;
              return (
                <Link key={i} href={`/exam/${cat.slug}`}>
                  <div className="bg-[#12121a] border border-white/5 rounded-2xl p-5 hover:bg-white/[0.04] hover:border-white/10 transition-all text-center group h-full flex flex-col items-center justify-center cursor-pointer">
                    <div className={`w-12 h-12 rounded-xl bg-${cat.color}-500/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 text-${cat.color}-400`} />
                    </div>
                    <h3 className="font-bold text-white text-sm mb-1">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.count}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Continue Learning / Mini Stats Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-5">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-400"/> {t('dashboard.continueLearning', language)}
              </h3>
            </div>
            <div className="space-y-3">
              {[
                { title: language === 'en' ? "SSC CGL Tier 1 Mock" : "SSC CGL टियर 1 मॉक", desc: language === 'en' ? "Paused at Q12 / 100" : "Q12 / 100 पर रोका गया", progress: "12%" },
                { title: language === 'en' ? "Percentage & Ratios" : "प्रतिशत और अनुपात", desc: language === 'en' ? "Chapter Test" : "अध्याय टेस्ट", progress: "85%" },
              ].map((item, i) => (
                <Link href="/quiz" key={i}>
                  <div className="flex items-center justify-between p-4 bg-white/5 shadow-sm hover:bg-white/10 rounded-xl transition border border-white/5 group cursor-pointer mb-3">
                    <div>
                      <h4 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition">{item.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                    </div>
                    <div className="text-right">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg">{item.progress}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center mb-5">
                <h3 className="font-bold text-lg text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-emerald-400"/> {t('dashboard.yourProgress', language)}
                </h3>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <Flame className="w-5 h-5 text-orange-500 mb-2" />
                  <div className="text-2xl font-bold text-white leading-none">{profile?.streak_days || 0}</div>
                  <div className="text-xs text-slate-400 mt-1">{t('dashboard.dayStreak', language)}</div>
                </div>
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                  <BookOpen className="w-5 h-5 text-blue-400 mb-2" />
                  <div className="text-2xl font-bold text-white leading-none">{solvedCount.toLocaleString()}</div>
                  <div className="text-xs text-slate-400 mt-1">{t('dashboard.questionsSolved', language)}</div>
                </div>
              </div>
            </div>
            
            <Link href="/dashboard/analytics" className="w-full bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-sm transition text-center flex items-center justify-center gap-2">
              {t('dashboard.viewAnalytics', language)} <ChevronRight className="w-4 h-4" />
            </Link>

          </div>
        </div>

      </main>
    </div>
  );
}
