"use client";

import React from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  Flame, 
  Trophy, 
  Target, 
  BookOpen, 
  BrainCircuit, 
  TrendingUp, 
  PlayCircle,
  Activity,
  Award,
  Clock,
  ChevronRight,
  BarChart3
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-purple-500/30">
      {/* Top Navbar */}
      <nav className="border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="flex items-center justify-between px-8 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)]">
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <span className="font-bold text-2xl tracking-tight text-white">AuraPrep</span>
          </div>
          
          <div className="hidden md:flex flex-1 max-w-md mx-8 relative group">
            <div className="absolute inset-0 bg-blue-500/20 blur-md rounded-full group-focus-within:bg-blue-500/30 transition-all"></div>
            <div className="relative flex items-center w-full bg-white/5 border border-white/10 rounded-full px-4 py-2 hover:bg-white/10 transition-colors">
              <Search className="w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search topics, PYQs, Mock Tests..." 
                className="bg-transparent border-none outline-none text-sm text-white w-full pl-3 placeholder-slate-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/20 rounded-full">
              <Flame className="w-4 h-4 text-orange-500" />
              <span className="text-orange-400 font-bold text-sm">12 Day Streak</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-white">Level 18</div>
                <div className="text-xs text-blue-400 font-medium">8,450 XP</div>
              </div>
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 p-[2px]">
                <div className="w-full h-full bg-[#0a0a0f] rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">JS</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-8 py-8">
        
        {/* Welcome & Dashboard Overview */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Welcome back, Jai! 🚀</h1>
            <p className="text-slate-400">Let's hit your daily study goal. You are 150 XP away from Level 19.</p>
          </div>
          <button className="mt-4 md:mt-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-5 py-2.5 rounded-xl font-semibold flex items-center gap-2 transition-all">
            <BarChart3 className="w-4 h-4" /> Full Analytics
          </button>
        </div>

        {/* Core Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: "Questions Solved", value: "1,284", icon: <Target className="w-5 h-5 text-blue-400" />, trend: "+24 today" },
            { label: "Average Accuracy", value: "86.4%", icon: <Activity className="w-5 h-5 text-emerald-400" />, trend: "+2.1% this week" },
            { label: "Global Rank", value: "#4,892", icon: <Trophy className="w-5 h-5 text-yellow-400" />, trend: "Top 5%" },
            { label: "Time Spent", value: "48h 12m", icon: <Clock className="w-5 h-5 text-purple-400" />, trend: "1h 30m today" },
          ].map((stat, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={i} 
              className="bg-white/5 border border-white/5 p-5 rounded-2xl hover:bg-white/[0.07] transition-all group"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="p-2 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                  {stat.icon}
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-md">{stat.trend}</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{stat.value}</h3>
              <p className="text-sm font-medium text-slate-400">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Main Content Split: Daily Challenge & Progress Ring */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          
          {/* Gamified Challenge Banner (spanning 2 columns) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="lg:col-span-2 relative rounded-3xl overflow-hidden shadow-2xl border border-white/10 bg-[#12121a]"
          >
            {/* Animated Glow Elements */}
            <div className="absolute -top-[50%] -right-[20%] w-[80%] h-[150%] bg-blue-600/20 blur-[100px] rounded-full animate-pulse-slow"></div>
            <div className="absolute -bottom-[50%] -left-[20%] w-[80%] h-[150%] bg-purple-600/20 blur-[100px] rounded-full animate-pulse"></div>
            
            <div className="relative z-10 p-8 md:p-10 flex flex-col md:flex-row items-center justify-between h-full">
              <div className="text-left md:max-w-md">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/30 mb-5">
                  <Flame className="w-3.5 h-3.5" /> DAILY TARGET UNLOCKED
                </div>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-3 tracking-tight">Today's 15 Question <br/> Mega Challenge</h2>
                <p className="text-slate-300 text-sm mb-8 leading-relaxed">Complete today's adaptive challenge tailored to your weak spots in Ratio & Proportion. +500 XP reward.</p>
                
                <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-full font-bold text-sm tracking-wide hover:shadow-[0_0_20px_rgba(59,130,246,0.5)] hover:-translate-y-1 transition-all flex items-center justify-center gap-2 shadow-lg">
                  Start Challenge <PlayCircle className="w-5 h-5" />
                </button>
              </div>
              
              <div className="hidden md:flex relative w-48 h-48 justify-center items-center mt-6 md:mt-0">
                 <div className="absolute inset-0 border-[8px] border-white/5 rounded-full"></div>
                 <div className="absolute inset-0 border-[8px] border-blue-500 rounded-full border-r-transparent border-t-transparent -rotate-45"></div>
                 <div className="text-center relative z-10">
                   <Award className="w-10 h-10 text-yellow-400 mx-auto mb-1" />
                   <div className="text-2xl font-bold font-mono text-white">500</div>
                   <div className="text-xs text-blue-300 font-bold tracking-wider">XP REWARD</div>
                 </div>
              </div>
            </div>
          </motion.div>

          {/* Progress / Goal Dashboard Component */}
          <div className="bg-white/5 border border-white/5 rounded-3xl p-6 flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-lg text-white">Daily Goal</h3>
              <button className="text-slate-400 hover:text-white transition"><ChevronRight className="w-5 h-5"/></button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center items-center">
              <div className="relative w-40 h-40 flex justify-center items-center">
                <svg className="w-full h-full -rotate-90 transform" viewBox="0 0 100 100">
                   <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                   <circle cx="50" cy="50" r="40" stroke="#8b5cf6" strokeWidth="8" fill="none" strokeDasharray="251" strokeDashoffset="60" strokeLinecap="round" className="drop-shadow-[0_0_10px_rgba(139,92,246,0.6)]" />
                </svg>
                <div className="absolute flex flex-col items-center">
                  <span className="text-3xl font-extrabold text-white">75%</span>
                  <span className="text-xs text-slate-400 font-medium tracking-wide">30 / 40 Qs</span>
                </div>
              </div>
              <p className="text-center text-sm font-medium text-slate-300 mt-6 bg-white/5 py-2 px-4 rounded-xl border border-white/5 w-full">Almost there! Keep practicing.</p>
            </div>
          </div>
        </div>

        {/* Bottom Section: Continue Learning & Weak Topics */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-5 flex items-center gap-2"><BookOpen className="w-5 h-5 text-indigo-400"/> Continue Learning</h3>
            <div className="space-y-3">
              {[
                { title: "SSC CGL Tier 1 Mock", desc: "Paused at Q12 / 100", progress: "12%" },
                { title: "Percentage & Ratios", desc: "Chapter Test", progress: "85%" },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 hover:bg-white/10 rounded-xl transition border border-white/5 group cursor-pointer">
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm group-hover:text-blue-400 transition">{item.title}</h4>
                    <p className="text-xs text-slate-500 mt-1">{item.desc}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-bold text-indigo-300 bg-indigo-500/10 px-2 py-1 rounded-lg">{item.progress}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-[#12121a] border border-white/5 rounded-2xl p-6">
            <h3 className="font-bold text-lg text-white mb-5 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-rose-400"/> Recommended for Weak Areas</h3>
            <div className="flex flex-wrap gap-2">
              {['Trigonometry Forms', 'Mirror Images', 'Blood Relations', 'Indian Polity (Articles)', 'Time & Work'].map((tag, i) => (
                <span key={i} className="px-3 py-1.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-300 text-xs font-semibold rounded-lg cursor-pointer transition">
                  {tag}
                </span>
              ))}
            </div>
            <button className="w-full mt-6 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-4 py-3 rounded-xl font-bold text-sm transition text-center shadow-sm">
              Generate Adaptive Weakness Quiz
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}
