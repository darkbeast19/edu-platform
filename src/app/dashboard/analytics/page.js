"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { 
  ArrowLeft, BarChart3, Target, AlertCircle, Zap, 
  TrendingUp, Clock, Activity, CheckCircle2, BrainCircuit, Lightbulb
} from "lucide-react";
import Navbar from "@/components/Navbar";
import { createClient } from "@/lib/supabase/client";

const MOCK_WEAK_TOPICS = [
  { name: "Algebra", accuracy: 45, wrong: 12, exam: "SSC CGL" },
  { name: "Syllogism", accuracy: 52, wrong: 9, exam: "Banking" },
  { name: "Profit & Loss", accuracy: 58, wrong: 7, exam: "Railway" },
];

const RECENT_TESTS = [
  { name: "SSC CGL Tier 1 Mock", score: 85, total: 100, date: "2 days ago", improvement: "+5%" },
  { name: "Ratio & Proportion Drill", score: 18, total: 20, date: "3 days ago", improvement: "+12%" },
  { name: "English Comprehension", score: 22, total: 25, date: "5 days ago", improvement: "-2%" },
];

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState({ solved: 0, accuracy: "0.0" });

  useEffect(() => {
    async function loadData() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
        if (data) setProfile(data);

        // Fetch Real Answer Stats
        const { count: totalQuestions } = await supabase
          .from('user_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id);

        const { count: correctAnswers } = await supabase
          .from('user_answers')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('is_correct', true);

        const solved = totalQuestions || 0;
        const accuracy = solved > 0 ? ((correctAnswers / solved) * 100).toFixed(1) : "0.0";
        
        setStats({ solved, accuracy });
      }
      setLoading(false);
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex items-center justify-center">
        <div className="animate-pulse font-bold text-blue-400">Loading Analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200">
      <Navbar />
      
      <main className="max-w-6xl mx-auto px-4 sm:px-8 py-10">
        <div className="mb-10">
          <Link href="/dashboard" className="inline-flex items-center gap-2 text-slate-500 hover:text-white transition text-sm font-medium mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to Dashboard
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl">
              <BarChart3 className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <h1 className="text-3xl font-extrabold text-white">Performance Analytics</h1>
              <p className="text-slate-400 mt-1">Deep dive into your accuracy, speed, and weak areas.</p>
            </div>
          </div>
        </div>

        {/* Global Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Total XP", value: profile?.xp_total?.toLocaleString() || "0", icon: Zap, color: "yellow" },
            { label: "Overall Accuracy", value: `${stats.accuracy}%`, icon: Target, color: "emerald" },
            { label: "Avg. Time/Question", value: "42 sec", icon: Clock, color: "blue" },
            { label: "Questions Solved", value: stats.solved.toLocaleString(), icon: Activity, color: "purple" },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#12121a] border border-white/5 p-6 rounded-2xl relative overflow-hidden group hover:border-white/10 transition-colors"
              >
                <div className={`absolute -right-4 -top-4 w-24 h-24 bg-${stat.color}-500/5 rounded-full blur-2xl group-hover:bg-${stat.color}-500/10 transition-all`} />
                <div className={`w-10 h-10 rounded-xl bg-${stat.color}-500/10 flex items-center justify-center mb-4`}>
                  <Icon className={`w-5 h-5 text-${stat.color}-400`} />
                </div>
                <div className="text-3xl font-extrabold text-white mb-1">{stat.value}</div>
                <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">{stat.label}</div>
              </motion.div>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Chart Area (Mocked visually) */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}
              className="bg-[#12121a] border border-white/5 rounded-3xl p-8 shadow-xl"
            >
              <div className="flex justify-between items-center mb-8">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-indigo-400" /> Accuracy Trend
                </h2>
                <select className="bg-white/5 border border-white/10 rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-300 outline-none">
                  <option>Last 30 Days</option>
                  <option>Last 7 Days</option>
                </select>
              </div>
              
              {/* Fake Chart Visualization */}
              <div className="h-64 flex items-end justify-between gap-2 border-b border-white/10 pb-4 relative">
                <div className="absolute top-0 left-0 w-full border-t border-dashed border-white/5 h-0" />
                <div className="absolute top-1/2 left-0 w-full border-t border-dashed border-white/5 h-0" />
                
                {[60, 65, 58, 72, 75, 82, 85, 84, 88, 92].map((val, i) => (
                  <div key={i} className="w-full bg-blue-500/20 rounded-t-lg relative group transition-all hover:bg-blue-500/40" style={{ height: `${val}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-white text-[#0a0a0f] text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      {val}%
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-4 text-xs font-bold tracking-wider text-slate-600 uppercase">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Current</span>
              </div>
            </motion.div>

            {/* Recent Tests */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}
              className="bg-[#12121a] border border-white/5 rounded-3xl p-8"
            >
              <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-6">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" /> Recent Test Scores
              </h2>
              <div className="space-y-4">
                {RECENT_TESTS.map((test, i) => (
                  <div key={i} className="flex justify-between items-center p-4 bg-white/5 hover:bg-white/[0.07] border border-white/5 rounded-2xl transition">
                    <div>
                      <h3 className="font-bold text-white text-sm">{test.name}</h3>
                      <p className="text-xs text-slate-500 mt-1">{test.date}</p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-extrabold text-blue-400">{test.score}<span className="text-slate-600 text-sm">/{test.total}</span></div>
                      <div className={`text-xs font-bold ${test.improvement.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {test.improvement}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Weak Topics Action Plan */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-gradient-to-b from-rose-500/10 to-rose-900/10 border border-rose-500/20 rounded-3xl p-6 sm:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <BrainCircuit className="w-32 h-32 text-rose-500" />
              </div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2 mb-2 relative z-10">
                <AlertCircle className="w-5 h-5 text-rose-400" /> Weak Topics Tracker
              </h2>
              <p className="text-xs text-rose-200/70 mb-6 relative z-10">
                AI has identified these topics as your weakest areas based on recent mistakes. Focus your practice here.
              </p>

              <div className="space-y-4 relative z-10">
                {MOCK_WEAK_TOPICS.map((topic, i) => (
                  <div key={i} className="bg-[#0a0a0f]/80 backdrop-blur-md border border-white/10 rounded-2xl p-4">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="font-bold text-white text-sm">{topic.name}</h3>
                        <p className="text-[10px] text-slate-500 mt-0.5">{topic.exam}</p>
                      </div>
                      <span className="text-xs font-bold px-2 py-1 bg-red-500/10 text-red-400 rounded border border-red-500/20 rounded-md">
                        {topic.accuracy}% Accuracy
                      </span>
                    </div>
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden mb-3">
                      <div className="h-full bg-red-500" style={{ width: `${topic.accuracy}%` }} />
                    </div>
                    <div className="flex gap-2">
                       <Link 
                         href={`/quiz?topic=${encodeURIComponent(topic.name)}&count=10`}
                         className="flex-1 bg-white/10 hover:bg-white/15 text-white text-xs font-bold py-2 rounded-lg text-center transition"
                       >
                         Practice Now
                       </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Smart Recommendation */}
            <div className="bg-[#12121a] border border-blue-500/30 rounded-3xl p-6 relative overflow-hidden group">
              <div className="absolute inset-0 bg-blue-500/5 group-hover:bg-blue-500/10 transition-colors" />
              <Lightbulb className="w-8 h-8 text-yellow-400 mb-4 relative z-10" />
              <h3 className="font-bold text-white text-lg mb-2 relative z-10">AI Daily Recommendation</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 relative z-10">
                Your accuracy in <strong>Algebra</strong> dropped by 12% this week. I've prepared a custom 15-question concept builder test for you.
              </p>
              <Link 
                href="/quiz?topic=Algebra&difficulty=Beginner&count=15"
                className="block w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded-xl text-center relative z-10 transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)]"
              >
                Accept Challenge
              </Link>
            </div>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
