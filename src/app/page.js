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
  ArrowRight,
  PlayCircle
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const categories = [
    { name: "SSC Exams", count: "12k+ Questions", icon: <Target className="w-6 h-6 text-blue-500" /> },
    { name: "Railway", count: "8k+ Questions", icon: <TrendingUp className="w-6 h-6 text-purple-500" /> },
    { name: "Banking", count: "15k+ Questions", icon: <BookOpen className="w-6 h-6 text-indigo-500" /> },
    { name: "State Govt", count: "5k+ Questions", icon: <BrainCircuit className="w-6 h-6 text-blue-600" /> },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar Placeholder */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-2">
          <BrainCircuit className="w-8 h-8 text-blue-600" />
          AuraPrep
        </div>
        <div className="flex gap-4 items-center font-medium">
          <a href="#" className="text-gray-600 hover:text-blue-600 transition">Exams</a>
          <a href="#" className="text-gray-600 hover:text-blue-600 transition">Leaderboard</a>
          <Link href="/dashboard" className="bg-blue-50 text-blue-700 px-5 py-2 rounded-full font-semibold hover:bg-blue-100 transition">
            Go to Dashboard
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-8 pt-16 pb-24 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-purple-50 border border-purple-100 px-4 py-1.5 rounded-full mb-8">
            <Flame className="w-4 h-4 text-orange-500 animate-pulse" />
            <span className="text-sm font-semibold text-purple-700">Join 50,000+ top scorers practicing daily</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-tight mb-6">
            Practice Any Topic <br className="hidden md:block"/>
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Instantly & Free.
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-500 mb-10 max-w-2xl mx-auto">
            Unlimited MCQs, PYQs, Mock tests and daily challenges designed for competitive exam aspirants. Level up your prep like a game.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
            <button className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-lg hover:scale-105 transition-all w-full sm:w-auto">
              Start Practice <ArrowRight className="w-5 h-5" />
            </button>
            <button className="flex items-center justify-center gap-2 bg-white border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full font-bold text-lg hover:border-gray-300 hover:bg-gray-50 transition-all w-full sm:w-auto">
              <PlayCircle className="w-5 h-5 text-gray-500" /> Daily Quiz
            </button>
          </div>
        </motion.div>

        {/* Global Search Interface */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="mt-16 max-w-3xl mx-auto relative group"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 blur-xl opacity-20 group-hover:opacity-30 transition-opacity rounded-3xl" />
          <div className="relative bg-white shadow-xl shadow-gray-200/50 rounded-3xl p-3 flex items-center border border-gray-100">
            <div className="pl-4">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <input 
              type="text" 
              placeholder="Search any topic... (e.g., Ratio, Indian Polity, Coding Decoding)"
              className="w-full pl-4 pr-6 py-4 text-lg outline-none text-gray-700 placeholder-gray-400 bg-transparent"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-2xl font-bold hover:bg-gray-800 transition">
              Find Tests
            </button>
          </div>
        </motion.div>

        {/* Categories Section */}
        <div className="mt-32">
          <div className="flex items-center gap-3 mb-8 justify-center">
            <Trophy className="w-6 h-6 text-yellow-500" />
            <h2 className="text-2xl font-bold text-gray-900">Popular Exam Categories</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {categories.map((cat, idx) => (
              <motion.div 
                whileHover={{ y: -5 }}
                key={idx}
                className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all cursor-pointer text-left group"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center mb-5 group-hover:bg-blue-50 transition-colors">
                  {cat.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-lg">{cat.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{cat.count}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Daily Challenge Banner */}
        <div className="mt-20 max-w-5xl mx-auto">
          <Link href="/dashboard">
            <div className="bg-gradient-to-r from-gray-900 to-indigo-900 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between text-left shadow-2xl cursor-pointer group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse-slow"></div>
              <div className="absolute bottom-0 right-32 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
              
              <div className="relative z-10 md:w-2/3">
                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md text-white text-sm px-3 py-1 rounded-full mb-4">
                  <Target className="w-4 h-4" /> Daily Live Target
                </div>
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 group-hover:scale-[1.02] transition-transform">Today's 10 Question Challenge</h2>
                <p className="text-gray-300 text-lg max-w-md">Boost your XP, maintain your streak, and see how you rank among the top 100 students today.</p>
              </div>
              
              <div className="relative z-10 mt-8 md:mt-0">
                <button className="bg-white text-indigo-900 px-8 py-4 rounded-2xl font-bold text-lg hover:shadow-xl group-hover:scale-105 transition-all flex items-center gap-2">
                  Go to Dashboard <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}
