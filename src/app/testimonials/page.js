"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Star, Quote, ChevronLeft, ChevronRight, Award, GraduationCap, Sparkles } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const TESTIMONIALS = [
  {
    name: "Priya Sharma",
    exam: "SSC CGL 2025",
    result: "AIR 342",
    quote: "AuraPrep's daily challenges and shortcut tricks were game-changers. The AI mistake analysis showed me exactly where I was going wrong in Quantitative Aptitude. Cleared CGL in my first attempt!",
    rating: 5,
    streak: 96,
  },
  {
    name: "Rahul Verma",
    exam: "Railway NTPC",
    result: "Selected",
    quote: "I tried 4 platforms before AuraPrep. None of them had the depth of PYQ analysis and topic-wise practice this has. The gamification kept me hooked — I practiced every single day for 3 months straight.",
    rating: 5,
    streak: 90,
  },
  {
    name: "Sneha Gupta",
    exam: "SBI PO 2025",
    result: "AIR 156",
    quote: "The leaderboard and XP system made my boring study routine feel exciting. I was competing with friends daily. The shortcut tricks for DI and Reasoning alone saved me 15 minutes in the actual exam.",
    rating: 5,
    streak: 72,
  },
  {
    name: "Amit Patel",
    exam: "SSC CHSL",
    result: "Selected",
    quote: "Coming from a Hindi medium background, I was weak in English. AuraPrep's topic-wise English MCQs with detailed explanations helped me score 45/50 in the actual paper. Forever grateful!",
    rating: 5,
    streak: 65,
  },
  {
    name: "Kavita Singh",
    exam: "IBPS Clerk",
    result: "AIR 89",
    quote: "What sets AuraPrep apart is the quality of explanations. Every wrong answer tells you WHY you made that mistake. No other platform does this. It's not just practice — it's actual learning.",
    rating: 5,
    streak: 58,
  },
  {
    name: "Deepak Yadav",
    exam: "Railway Group D",
    result: "Selected",
    quote: "I used to score 50-55 in mocks. After 2 months on AuraPrep, consistently hitting 75+. The weak topic tracker is incredibly accurate. It knew my weaknesses better than I did.",
    rating: 4,
    streak: 44,
  },
  {
    name: "Ritu Kumari",
    exam: "SSC MTS",
    result: "Selected",
    quote: "Simple, clean, and powerful. No ads, no distractions, just pure practice. The daily 10-question challenge became my morning routine. Streak motivation is real!",
    rating: 5,
    streak: 40,
  },
  {
    name: "Arjun Roy",
    exam: "NDA 2025",
    result: "Recommended",
    quote: "The Maths practice on AuraPrep is exceptional. Step-by-step solutions for every single question. The difficulty progression from Beginner to Hard Mode prepared me perfectly for NDA-level questions.",
    rating: 5,
    streak: 55,
  },
];

function TestimonialCard({ testimonial, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.08 }}
      className="bg-[#12121a] border border-white/5 rounded-2xl p-6 sm:p-7 hover:border-white/10 transition-all group relative overflow-hidden"
    >
      {/* Subtle quote watermark */}
      <Quote className="absolute top-4 right-4 w-16 h-16 text-white/[0.03] pointer-events-none" />

      {/* Stars */}
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-slate-700"
            }`}
          />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-300 text-sm leading-relaxed mb-6 relative z-10">
        "{testimonial.quote}"
      </p>

      {/* Author */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">
              {testimonial.name.split(" ").map((n) => n[0]).join("")}
            </span>
          </div>
          <div>
            <div className="text-sm font-bold text-white">{testimonial.name}</div>
            <div className="text-[11px] text-slate-500">{testimonial.exam}</div>
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg">
          {testimonial.result}
        </span>
      </div>
    </motion.div>
  );
}

export default function TestimonialsPage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1 rounded-full mb-4">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs font-bold text-rose-300">WALL OF LOVE</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Success Stories
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-lg mx-auto">
            Real students, real results. See how AuraPrep helped them crack their dream exams.
          </p>
        </motion.div>

        {/* Highlighted Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10 sm:mb-14 max-w-2xl mx-auto">
          {[
            { value: "500+", label: "Selections", icon: GraduationCap },
            { value: "4.9★", label: "Average Rating", icon: Star },
            { value: "50k+", label: "Happy Students", icon: Sparkles },
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="bg-[#12121a] border border-white/5 rounded-2xl p-5 text-center"
            >
              <stat.icon className="w-5 h-5 text-blue-400 mx-auto mb-2" />
              <div className="text-xl sm:text-2xl font-extrabold text-white">{stat.value}</div>
              <div className="text-xs text-slate-500 font-medium mt-1">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Testimonial Grid (Masonry-like) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-4 sm:gap-5 space-y-4 sm:space-y-5">
          {TESTIMONIALS.map((t, i) => (
            <div key={i} className="break-inside-avoid">
              <TestimonialCard testimonial={t} index={i} />
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
