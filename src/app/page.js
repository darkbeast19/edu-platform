"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Search,
  Flame,
  Trophy,
  Target,
  BookOpen,
  BrainCircuit,
  TrendingUp,
  ArrowRight,
  PlayCircle,
  Sparkles,
  Users,
  Clock,
  CheckCircle2,
  Zap,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const EXAM_CATEGORIES = [
  { name: "SSC Exams", count: "12k+ Questions", icon: Target, color: "blue", slug: "ssc" },
  { name: "Railway", count: "8k+ Questions", icon: TrendingUp, color: "purple", slug: "railway" },
  { name: "Banking", count: "15k+ Questions", icon: BookOpen, color: "indigo", slug: "banking" },
  { name: "State Govt", count: "5k+ Questions", icon: BrainCircuit, color: "emerald", slug: "state-govt" },
  { name: "Defence", count: "6k+ Questions", icon: Zap, color: "orange", slug: "defence" },
  { name: "Teaching", count: "4k+ Questions", icon: Users, color: "rose", slug: "teaching" },
];

const STATS = [
  { value: "50,000+", label: "Active Students", icon: Users },
  { value: "1,20,000+", label: "Questions", icon: BookOpen },
  { value: "98%", label: "Satisfaction", icon: CheckCircle2 },
  { value: "24/7", label: "Free Access", icon: Clock },
];

const FEATURES = [
  {
    title: "AI-Powered Weakness Detection",
    desc: "Our system learns your weak areas and auto-generates custom quizzes to turn them into strengths.",
    icon: BrainCircuit,
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    title: "Instant Shortcut Tricks",
    desc: "Every question comes with exam-winning tricks and step-by-step solutions. Never waste time again.",
    icon: Zap,
    gradient: "from-purple-500 to-pink-500",
  },
  {
    title: "Gamified Streaks & XP",
    desc: "Maintain daily streaks, earn XP, climb the leaderboard — preparation that actually feels exciting.",
    icon: Flame,
    gradient: "from-orange-500 to-red-500",
  },
  {
    title: "Real PYQ Papers",
    desc: "Practice with actual previous year questions from SSC, Railway, Banking, and more — organized topic-wise.",
    icon: Target,
    gradient: "from-emerald-500 to-teal-500",
  },
];

export default function Home() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e) => {
    e?.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/search");
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      {/* ── Hero Section ── */}
      <section className="relative overflow-hidden">
        {/* Background Glows */}
        <div className="absolute top-[-200px] left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-blue-600/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-[100px] right-[-200px] w-[500px] h-[500px] bg-purple-600/8 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-8 pt-16 sm:pt-24 pb-16 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-4xl mx-auto"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-4 py-1.5 rounded-full mb-8">
              <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
              <span className="text-xs sm:text-sm font-bold text-blue-300">
                Join 50,000+ top scorers practicing daily
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl font-extrabold text-white tracking-tight leading-[1.1] mb-6">
              Practice Any Topic{" "}
              <br className="hidden md:block" />
              <span className="gradient-text">Instantly & Free.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Unlimited MCQs, PYQs, Mock Tests and AI-powered daily challenges
              designed for competitive exam aspirants. Level up your prep like a game.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/quiz"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-[0_0_30px_rgba(59,130,246,0.4)] hover:scale-[1.02] transition-all"
              >
                Start Practice <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="flex items-center justify-center gap-2 bg-white/5 border border-white/10 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all"
              >
                <PlayCircle className="w-5 h-5 text-slate-400" /> Daily Challenge
              </Link>
            </div>
          </motion.div>

          {/* ── Search Bar ── */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-14 max-w-3xl mx-auto relative group"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-15 group-hover:opacity-25 transition-opacity rounded-3xl" />
            <form onSubmit={handleSearch} className="relative bg-[#12121a] border border-white/10 rounded-2xl sm:rounded-3xl p-2 sm:p-3 flex items-center">
              <div className="pl-3 sm:pl-4">
                <Search className="w-5 h-5 sm:w-6 sm:h-6 text-slate-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search any topic... (e.g., Ratio, Indian Polity)"
                className="w-full pl-3 sm:pl-4 pr-4 py-3 sm:py-4 text-sm sm:text-lg outline-none text-white placeholder-slate-500 bg-transparent"
              />
              <button
                type="submit"
                className="bg-white text-[#0a0a0f] px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl font-bold text-sm sm:text-base hover:bg-slate-200 transition flex-shrink-0"
              >
                Find Tests
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="border-y border-white/5 bg-white/[0.02]">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <stat.icon className="w-6 h-6 text-blue-400 mx-auto mb-2" />
                <div className="text-2xl sm:text-3xl font-extrabold text-white">
                  {stat.value}
                </div>
                <div className="text-xs sm:text-sm text-slate-500 font-medium mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Categories ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-300">POPULAR EXAMS</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
            Choose Your Exam Category
          </h2>
          <p className="text-slate-500 mt-3 max-w-lg mx-auto text-sm sm:text-base">
            We cover every major government exam. Pick one and start practicing instantly.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {EXAM_CATEGORIES.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
              >
                <Link href={`/exam/${cat.slug}`}>
                  <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6 hover:border-white/15 hover:bg-white/[0.04] transition-all cursor-pointer group hover-lift">
                    <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                      <Icon className={`w-6 h-6 text-${cat.color}-400`} />
                    </div>
                    <h3 className="font-bold text-white text-lg mb-1">{cat.name}</h3>
                    <p className="text-slate-500 text-sm">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="bg-white/[0.015] border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
          <div className="text-center mb-10 sm:mb-14">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/20 px-3 py-1 rounded-full mb-4">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <span className="text-xs font-bold text-purple-300">WHY AURAPREP</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-white">
              Built For Serious Aspirants
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
            {FEATURES.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-[#12121a] border border-white/5 rounded-2xl p-6 sm:p-8 hover:border-white/10 transition-all group"
                >
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.gradient} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-white text-lg mb-2">{feat.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{feat.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Daily Challenge Banner ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 py-16 sm:py-24">
        <Link href="/dashboard">
          <div className="bg-gradient-to-br from-[#12121a] to-[#1a1a30] rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between border border-white/10 cursor-pointer group hover:border-white/20 transition-all">
            {/* Glows */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full blur-[120px] opacity-15 animate-pulse-slow pointer-events-none" />
            <div className="absolute bottom-0 left-[20%] w-64 h-64 bg-purple-500 rounded-full blur-[120px] opacity-10 pointer-events-none" />

            <div className="relative z-10 md:w-2/3 text-left">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white text-xs font-bold px-3 py-1 rounded-full mb-4 border border-white/10">
                <Target className="w-3.5 h-3.5" /> DAILY LIVE TARGET
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-white mb-4 group-hover:scale-[1.01] transition-transform">
                Today's 10 Question Challenge
              </h2>
              <p className="text-slate-400 text-sm sm:text-base max-w-md leading-relaxed">
                Boost your XP, maintain your streak, and see how you rank among the top 100 students today.
              </p>
            </div>

            <div className="relative z-10 mt-8 md:mt-0 flex-shrink-0">
              <div className="bg-white text-[#0a0a0f] px-8 py-4 rounded-2xl font-bold text-base sm:text-lg hover:shadow-xl group-hover:scale-105 transition-all flex items-center gap-2">
                Go to Dashboard <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </Link>
      </section>

      <Footer />
    </div>
  );
}
