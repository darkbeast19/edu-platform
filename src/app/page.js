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
import { useLanguage } from "@/context/LanguageContext";

const getExamCategories = (lang) => [
  { name: lang === 'en' ? "SSC Exams" : "SSC परीक्षा", count: lang === 'en' ? "12k+ Questions" : "12k+ प्रश्न", icon: Target, slug: "ssc" },
  { name: lang === 'en' ? "Railway" : "रेलवे", count: lang === 'en' ? "8k+ Questions" : "8k+ प्रश्न", icon: TrendingUp, slug: "railway" },
  { name: lang === 'en' ? "Banking" : "बैंकिंग", count: lang === 'en' ? "15k+ Questions" : "15k+ प्रश्न", icon: BookOpen, slug: "banking" },
  { name: lang === 'en' ? "State Govt" : "राज्य सरकार", count: lang === 'en' ? "5k+ Questions" : "5k+ प्रश्न", icon: BrainCircuit, slug: "state-govt" },
  { name: lang === 'en' ? "Defence" : "रक्षा", count: lang === 'en' ? "6k+ Questions" : "6k+ प्रश्न", icon: Zap, slug: "defence" },
  { name: lang === 'en' ? "Teaching" : "शिक्षण", count: lang === 'en' ? "4k+ Questions" : "4k+ प्रश्न", icon: Users, slug: "teaching" },
];

const getStats = (lang) => [
  { value: "50,000+", label: lang === 'en' ? "Happy Students" : "संतुष्ट छात्र", icon: Users },
  { value: "1,20,000+", label: lang === 'en' ? "Fun Questions" : "मजेदार प्रश्न", icon: BookOpen },
  { value: "98%", label: lang === 'en' ? "Satisfaction" : "संतुष्टि", icon: CheckCircle2 },
  { value: "24/7", label: lang === 'en' ? "Free Access" : "मुफ्त पहुंच", icon: Clock },
];

const getFeatures = (lang) => [
  {
    title: lang === 'en' ? "Smart Weakness Detection" : "कमजोरी की पहचान",
    desc: lang === 'en' ? "Our AI learns your weak areas and auto-generates custom quizzes to help you grow faster!" : "हमारा AI आपकी कमजोरियों को सीखता है और आपको तेजी से बढ़ने में मदद करने के लिए कस्टम क्विज़ बनाता है!",
    icon: BrainCircuit,
  },
  {
    title: lang === 'en' ? "Instant Shortcut Tricks" : "त्वरित शॉर्टकट ट्रिक्स",
    desc: lang === 'en' ? "Every question comes with magic tricks and step-by-step solutions. Never waste time again." : "हर प्रश्न जादुई ट्रिक्स और स्टेप-बाय-स्टेप समाधान के साथ आता है। अब कभी समय बर्बाद न करें।",
    icon: Zap,
  },
  {
    title: lang === 'en' ? "Gamified Streaks & XP" : "गेमिफाइड स्ट्रीक्स और XP",
    desc: lang === 'en' ? "Maintain daily streaks, earn XP, and climb the leaderboard — learning that actually feels like play." : "दैनिक स्ट्रीक बनाए रखें, XP अर्जित करें, और लीडरबोर्ड पर चढ़ें — ऐसा सीखना जो वास्तव में खेल जैसा लगे।",
    icon: Flame,
  },
  {
    title: lang === 'en' ? "Real PYQ Papers" : "असली PYQ पेपर",
    desc: lang === 'en' ? "Practice with actual previous year questions from SSC, Railway, Banking, and more." : "SSC, रेलवे, बैंकिंग और अन्य की वास्तविक पिछले वर्ष के प्रश्नों के साथ अभ्यास करें।",
    icon: Target,
  },
];

export default function Home() {
  const router = useRouter();
  const { language } = useLanguage();
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
    <div className="min-h-screen bg-[var(--bg-primary)] flex flex-col relative overflow-hidden">
      <Navbar />

      {/* Decorative High-Quality Light Green Blobs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-5%] w-96 h-96 bg-[var(--accent-green)]/10 rounded-full blur-[100px] animate-float-gentle"></div>
        <div className="absolute top-[20%] right-[-5%] w-[30rem] h-[30rem] bg-[#a7f3d0]/20 rounded-full blur-[120px] animate-float-gentle" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* ── Hero Section ── */}
      <section className="relative z-10 pt-24 pb-20 px-4 sm:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            {/* HD Premium Badge */}
            <div className="badge-green mb-8 shadow-sm">
              <Sparkles className="w-4 h-4" />
              <span>{language === 'en' ? 'Join 50,000+ top scorers practicing daily!' : 'रोज़ाना अभ्यास करने वाले 50,000+ टॉपर्स से जुड़ें!'}</span>
            </div>

            <h1 className="heading-premium text-5xl sm:text-6xl md:text-7xl mb-6 leading-tight">
              {language === 'en' ? (
                <>Level Up Your Learning <br className="hidden md:block" />
                <span className="text-gradient-green">Instantly & Free.</span></>
              ) : (
                <>अपनी शिक्षा को बेहतर बनाएं <br className="hidden md:block" />
                <span className="text-gradient-green">तुरंत और मुफ्त।</span></>
              )}
            </h1>

            <p className="text-[var(--text-secondary)] text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed">
              {language === 'en' 
                ? 'Unlimited MCQs, PYQs, Mock Tests, and AI-powered daily challenges designed for competitive exams. Fresh, clear, and focused on your growth.'
                : 'प्रतियोगी परीक्षाओं के लिए असीमित MCQ, PYQ, मॉक टेस्ट और AI-संचालित दैनिक चुनौतियाँ। ताज़ा, स्पष्ट, और आपके विकास पर केंद्रित।'}
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/quiz"
                className="btn-green px-8 py-4 text-lg flex items-center gap-2"
              >
                {language === 'en' ? 'Start Playing' : 'शुरू करें'} <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/dashboard"
                className="btn-ghost-green px-8 py-4 text-lg flex items-center gap-2"
              >
                <PlayCircle className="w-5 h-5" /> {language === 'en' ? 'Daily Challenge' : 'दैनिक चुनौती'}
              </Link>
            </div>
          </motion.div>

          {/* ── Search Bar (HD Glass Widget) ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-16 max-w-3xl mx-auto relative group z-20"
          >
            <form onSubmit={handleSearch} className="hd-widget rounded-full p-2 sm:p-3 flex items-center bg-white/80 backdrop-blur-xl">
              <div className="pl-5">
                <Search className="w-6 h-6 text-[var(--accent-green)]" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={language === 'en' ? "Search any topic... (e.g., Ratio, Indian Polity)" : "कोई भी विषय खोजें... (जैसे, Ratio, Indian Polity)"}
                className="w-full pl-4 pr-4 py-3 sm:py-4 text-lg font-medium outline-none text-[var(--text-primary)] placeholder-[var(--text-muted)] bg-transparent"
              />
              <button
                type="submit"
                className="btn-green px-8 py-3 sm:py-4 text-base flex-shrink-0"
              >
                {language === 'en' ? 'Find Quizzes' : 'क्विज़ खोजें'}
              </button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ── Stats Strip ── */}
      <section className="relative z-10 py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-8">
          <div className="hd-widget p-8 grid grid-cols-2 lg:grid-cols-4 gap-8">
            {getStats(language).map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div className="w-14 h-14 mx-auto mb-4 bg-[var(--accent-green-light)] rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 group-hover:rotate-3">
                  <stat.icon className="w-7 h-7 text-[var(--accent-green-dark)]" />
                </div>
                <div className="text-3xl font-bold text-[var(--text-primary)] mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-[var(--text-muted)] font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Exam Categories ── */}
      <section className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-24">
        <div className="text-center mb-16">
          <div className="badge-green mb-4">
            <Trophy className="w-4 h-4" />
            <span>{language === 'en' ? 'POPULAR EXAMS' : 'लोकप्रिय परीक्षाएं'}</span>
          </div>
          <h2 className="heading-premium text-4xl sm:text-5xl">
            {language === 'en' ? 'Choose Your Path to Success' : 'सफलता का अपना मार्ग चुनें'}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {getExamCategories(language).map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
              >
                <Link href={`/exam/${cat.slug}`}>
                  <div className="hd-widget p-8 text-center group cursor-pointer h-full flex flex-col items-center justify-center border border-transparent hover:border-[var(--accent-green)]/30">
                    <div className="w-16 h-16 rounded-2xl bg-[var(--bg-elevated)] text-[var(--accent-green)] flex items-center justify-center mb-6 transition-all group-hover:scale-110 group-hover:bg-[var(--accent-green)] group-hover:text-white group-hover:shadow-lg group-hover:shadow-[var(--accent-green)]/30">
                      <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="font-bold text-[var(--text-primary)] text-xl mb-2">{cat.name}</h3>
                    <p className="text-[var(--text-muted)] text-sm">{cat.count}</p>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="relative z-10 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-premium text-4xl sm:text-5xl">
              {language === 'en' ? "Why You'll Love Learning Here" : "आपको यहाँ सीखना क्यों पसंद आएगा"}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {getFeatures(language).map((feat, i) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="hd-widget p-8 flex gap-6 items-start"
                >
                  <div className="w-14 h-14 rounded-2xl flex-shrink-0 flex items-center justify-center bg-[var(--accent-green-light)] text-[var(--accent-green-dark)]">
                    <Icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="font-bold text-[var(--text-primary)] text-xl mb-2">{feat.title}</h3>
                    <p className="text-[var(--text-secondary)] leading-relaxed">{feat.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Daily Challenge Banner ── */}
      <section className="relative z-10 max-w-5xl mx-auto px-4 sm:px-8 py-24">
        <motion.div
          whileHover={{ scale: 1.01 }}
          transition={{ duration: 0.3 }}
        >
          <Link href="/dashboard">
            <div className="hd-widget rounded-3xl p-10 md:p-14 relative overflow-hidden flex flex-col md:flex-row items-center justify-between group border-2 border-transparent hover:border-[var(--accent-green)]/20">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-green)]/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

              <div className="relative z-10 md:w-2/3 text-center md:text-left mb-8 md:mb-0">
                <div className="badge-green mb-6 shadow-sm">
                  <Target className="w-4 h-4" /> 
                  <span>{language === 'en' ? "DAILY LIVE TARGET" : "दैनिक लाइव लक्ष्य"}</span>
                </div>
                <h2 className="heading-premium text-4xl sm:text-5xl text-[var(--text-primary)] mb-4">
                  {language === 'en' ? "Today's Epic Challenge" : "आज की महाकाव्य चुनौती"}
                </h2>
                <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto md:mx-0">
                  {language === 'en' ? "Boost your XP, maintain your streak, and unlock new badges by completing today's mission!" : "आज के मिशन को पूरा करके अपना XP बढ़ाएं, अपनी स्ट्रीक बनाए रखें और नए बैज अनलॉक करें!"}
                </p>
              </div>

              <div className="relative z-10 flex-shrink-0">
                <div className="btn-green px-8 py-5 text-xl flex items-center gap-3">
                  {language === 'en' ? "Let's Go!" : "चलिए शुरू करें!"} <ArrowRight className="w-6 h-6" />
                </div>
              </div>
            </div>
          </Link>
        </motion.div>
      </section>

      <Footer />
    </div>
  );
}
