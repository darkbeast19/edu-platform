"use client";

import React, { useState, use } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Lightbulb,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Copy,
  CheckCircle2,
  Zap,
  PlayCircle,
  FileText,
  Target,
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Topic content database (expandable)
const TOPIC_CONTENT = {
  "ratio-proportion": {
    title: "Ratio & Proportion",
    subject: "Quantitative Aptitude",
    readTime: "12 min",
    sections: [
      {
        heading: "What is Ratio?",
        content:
          "A ratio is a comparison of two quantities by division. If a and b are two quantities of the same kind, then the fraction a/b is called the ratio of a to b. It is written as a:b. The first term 'a' is called the antecedent and the second term 'b' is called the consequent.",
      },
      {
        heading: "What is Proportion?",
        content:
          "An equality of two ratios is called a proportion. If a:b = c:d, then a, b, c, d are said to be in proportion and we write a:b :: c:d. Here a and d are called extremes, while b and c are called means. In a proportion: Product of extremes = Product of means → a × d = b × c",
      },
      {
        heading: "Types of Proportion",
        content:
          "1. Direct Proportion: Two quantities are in direct proportion if an increase in one causes a proportional increase in the other.\n2. Inverse Proportion: Two quantities are in inverse proportion if an increase in one causes a proportional decrease in the other.\n3. Continued Proportion: Three quantities a, b, c are in continued proportion if a:b = b:c. Here b² = ac, and b is called the mean proportional.",
      },
    ],
    formulas: [
      { label: "Basic Ratio", formula: "a : b = a/b" },
      { label: "Proportion Rule", formula: "If a:b = c:d → a×d = b×c" },
      { label: "Componendo", formula: "(a+b)/b = (c+d)/d" },
      { label: "Dividendo", formula: "(a−b)/b = (c−d)/d" },
      { label: "Comp. & Div.", formula: "(a+b)/(a−b) = (c+d)/(c−d)" },
      { label: "Mean Proportional", formula: "If a:b :: b:c, then b = √(a×c)" },
      { label: "Duplicate Ratio", formula: "a² : b²" },
      { label: "Sub-duplicate Ratio", formula: "√a : √b" },
    ],
    tricks: [
      "When combining two ratios with a common term (e.g., A:B and B:C), make the common term equal by multiplying both sides to get a combined ratio.",
      "For 'dividing a sum' problems, always find total parts first, then individual shares.",
      "In questions about mixing or alligation, the ratio of quantities = inverse ratio of differences from mean.",
    ],
  },
  percentage: {
    title: "Percentage",
    subject: "Quantitative Aptitude",
    readTime: "10 min",
    sections: [
      {
        heading: "What is Percentage?",
        content:
          "Percentage means 'out of 100'. It is a way of expressing a number as a fraction of 100. The symbol % is used to denote percentage. For example, 25% means 25 out of 100 = 25/100 = 1/4.",
      },
      {
        heading: "Fraction to Percentage Conversion",
        content:
          "To convert a fraction to percentage, multiply by 100.\n• 1/2 = 50%\n• 1/3 = 33.33%\n• 1/4 = 25%\n• 1/5 = 20%\n• 1/6 = 16.67%\n• 1/7 = 14.28%\n• 1/8 = 12.5%",
      },
    ],
    formulas: [
      { label: "Basic Formula", formula: "% = (Part / Whole) × 100" },
      { label: "Increase %", formula: "% increase = (Increase / Original) × 100" },
      { label: "Decrease %", formula: "% decrease = (Decrease / Original) × 100" },
      { label: "Successive %", formula: "Net = a + b + (ab/100)" },
    ],
    tricks: [
      "Memorize fraction-percentage equivalents (1/3 = 33.33%, 1/7 = 14.28%, etc.) — they save massive time.",
      "For successive percentage changes, use the formula: Net % = a + b + (a×b)/100",
      "If a value increases by x% and then decreases by x%, the net effect is always a decrease of (x²/100)%.",
    ],
  },
};

// Fallback for topics not yet in the database
const DEFAULT_CONTENT = {
  title: "Study Notes",
  subject: "General",
  readTime: "8 min",
  sections: [
    {
      heading: "Coming Soon",
      content: "Detailed study notes for this topic are being prepared by our expert content team. In the meantime, you can practice questions on this topic to test your existing knowledge.",
    },
  ],
  formulas: [],
  tricks: ["Practice with mock questions to identify your knowledge gaps before the notes arrive."],
};

export default function NotesPage({ params }) {
  const resolvedParams = use(params);
  const topicSlug = resolvedParams.topic;
  const content = TOPIC_CONTENT[topicSlug] || { ...DEFAULT_CONTENT, title: topicSlug.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()) };

  const [expandedSection, setExpandedSection] = useState(0);
  const [copiedIdx, setCopiedIdx] = useState(null);

  const handleCopy = (text, idx) => {
    navigator.clipboard.writeText(text);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <section className="max-w-4xl mx-auto px-4 sm:px-8 pt-8 sm:pt-12 pb-16 sm:pb-24 flex-1">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/exams" className="hover:text-slate-300 transition">Subjects</Link>
          <span>/</span>
          <span className="text-slate-400">{content.subject}</span>
          <span>/</span>
          <span className="text-white font-medium">{content.title}</span>
        </div>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-3">
                <FileText className="w-3.5 h-3.5 text-blue-400" />
                <span className="text-xs font-bold text-blue-300">STUDY NOTES</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{content.title}</h1>
              <p className="text-slate-500 text-sm mt-1">
                {content.subject} • {content.readTime} read
              </p>
            </div>
            <Link
              href="/quiz"
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex-shrink-0 w-fit"
            >
              <PlayCircle className="w-4 h-4" /> Practice Now
            </Link>
          </div>
        </motion.div>

        {/* Notes Content */}
        <div className="space-y-4 mb-10">
          {content.sections.map((section, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.08 }}
            >
              <button
                onClick={() => setExpandedSection(expandedSection === i ? -1 : i)}
                className="w-full text-left"
              >
                <div className={`bg-[#12121a] border rounded-2xl p-5 sm:p-6 transition-all ${expandedSection === i ? "border-blue-500/20" : "border-white/5 hover:border-white/10"}`}>
                  <div className="flex justify-between items-center gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-blue-400 font-mono text-xs font-bold flex-shrink-0">
                        {i + 1}
                      </div>
                      <h3 className="font-bold text-white text-sm sm:text-base">{section.heading}</h3>
                    </div>
                    {expandedSection === i ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </div>
                  {expandedSection === i && (
                    <div className="mt-4 pl-11">
                      <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-line">
                        {section.content}
                      </p>
                    </div>
                  )}
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        {/* Formulas Box */}
        {content.formulas.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#12121a] border border-purple-500/20 rounded-2xl p-6 sm:p-7 mb-10"
          >
            <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
              <Target className="w-5 h-5 text-purple-400" /> Key Formulas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {content.formulas.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3 group"
                >
                  <div>
                    <div className="text-[11px] text-slate-500 font-bold uppercase tracking-wider mb-0.5">
                      {f.label}
                    </div>
                    <div className="text-sm font-mono text-slate-200">{f.formula}</div>
                  </div>
                  <button
                    onClick={() => handleCopy(f.formula, i)}
                    className="text-slate-600 hover:text-white transition ml-2 flex-shrink-0"
                    title="Copy formula"
                  >
                    {copiedIdx === i ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Shortcut Tricks */}
        {content.tricks.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-[#12121a] border border-yellow-500/20 rounded-2xl p-6 sm:p-7 mb-10"
          >
            <h2 className="font-bold text-white text-lg mb-5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-400 fill-yellow-400" /> Shortcut Tricks
            </h2>
            <div className="space-y-3">
              {content.tricks.map((trick, i) => (
                <div key={i} className="flex gap-3 bg-white/[0.03] border border-white/5 rounded-xl px-4 py-3">
                  <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                  <p className="text-slate-300 text-sm leading-relaxed">{trick}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* CTA */}
        <div className="bg-gradient-to-br from-[#12121a] to-[#1a1a30] border border-white/10 rounded-2xl p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-3">
            Ready to test your knowledge?
          </h2>
          <p className="text-slate-400 text-sm mb-6 max-w-md mx-auto">
            Practice MCQs specifically tailored to the concepts you just learned.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3.5 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all"
          >
            Practice Now <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}
