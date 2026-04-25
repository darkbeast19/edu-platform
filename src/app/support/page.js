"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  HelpCircle,
  MessageSquare,
  Mail,
  Phone,
  ChevronDown,
  ChevronUp,
  Send,
  ExternalLink,
  Clock,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useLanguage } from "@/context/LanguageContext";

const FAQS = [
  {
    q: "Is AuraPrep really free?",
    a: "Yes! Our core features — unlimited MCQs, PYQs, daily challenges, and AI explanations — are completely free. We may introduce premium features like advanced analytics in the future.",
  },
  {
    q: "Which exams does AuraPrep cover?",
    a: "We currently cover SSC (CGL, CHSL, MTS), Railway (NTPC, Group D), Banking (SBI PO, IBPS Clerk), NDA, and several State Government exams. We're adding more every month.",
  },
  {
    q: "How does the AI-powered explanation work?",
    a: "When you answer a question incorrectly, our AI analyzes your chosen option and explains exactly why it's wrong, what common mistake led you there, and provides a shortcut trick to solve it faster next time.",
  },
  {
    q: "Can I practice offline?",
    a: "Currently AuraPrep requires an internet connection. However, we're working on an offline mode that will let you download question sets for practice without internet.",
  },
  {
    q: "How does the streak and XP system work?",
    a: "Every question you attempt earns you XP. Completing daily challenges and maintaining streaks gives bonus XP. XP determines your level and leaderboard rank. Streaks reset if you miss a day!",
  },
  {
    q: "Are the PYQs (Previous Year Questions) authentic?",
    a: "Absolutely. All PYQs are sourced from official question papers and are verified by our content team. We tag each question with the exact exam and year it appeared in.",
  },
  {
    q: "How do I report a wrong answer or error?",
    a: "Use the 'Report Issue' button on any question, or reach out to us via the contact form below. We review and fix reported issues within 24 hours.",
  },
];

const FAQS_HI = [
  {
    q: "क्या AuraPrep सच में मुफ़्त है?",
    a: "हाँ! हमारी मुख्य सुविधाएँ — असीमित MCQs, PYQs, दैनिक चुनौतियाँ और AI स्पष्टीकरण — पूरी तरह से मुफ़्त हैं। हम भविष्य में उन्नत विश्लेषण जैसी प्रीमियम सुविधाएँ ला सकते हैं।",
  },
  {
    q: "AuraPrep किन परीक्षाओं को कवर करता है?",
    a: "हम वर्तमान में SSC (CGL, CHSL, MTS), Railway (NTPC, Group D), Banking (SBI PO, IBPS Clerk), NDA और कई राज्य सरकार की परीक्षाओं को कवर करते हैं।",
  },
  {
    q: "AI-संचालित स्पष्टीकरण कैसे काम करता है?",
    a: "जब आप किसी प्रश्न का गलत उत्तर देते हैं, तो हमारा AI विश्लेषण करता है और बताता है कि यह गलत क्यों है, कौन सी सामान्य गलती हुई, और इसे तेजी से हल करने के लिए शॉर्टकट ट्रिक प्रदान करता है।",
  },
  {
    q: "क्या मैं ऑफ़लाइन अभ्यास कर सकता हूँ?",
    a: "वर्तमान में AuraPrep के लिए इंटरनेट कनेक्शन की आवश्यकता है। हालाँकि, हम एक ऑफ़लाइन मोड पर काम कर रहे हैं।",
  },
  {
    q: "स्ट्रीक और XP प्रणाली कैसे काम करती है?",
    a: "आपके द्वारा हल किए गए प्रत्येक प्रश्न के लिए आपको XP मिलता है। XP आपका स्तर और लीडरबोर्ड रैंक निर्धारित करता है। एक दिन चूकने पर स्ट्रीक रीसेट हो जाती है!",
  },
  {
    q: "क्या PYQs (पिछले वर्ष के प्रश्न) प्रामाणिक हैं?",
    a: "बिल्कुल। सभी PYQs आधिकारिक प्रश्न पत्रों से प्राप्त किए गए हैं।",
  },
  {
    q: "मैं गलत उत्तर की रिपोर्ट कैसे करूँ?",
    a: "किसी भी प्रश्न पर 'समस्या की रिपोर्ट करें' बटन का उपयोग करें, या नीचे दिए गए संपर्क फ़ॉर्म के माध्यम से हमसे संपर्क करें।",
  },
];

function FAQItem({ faq, index }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full text-left bg-[#12121a] border border-white/5 rounded-xl p-5 hover:border-white/10 transition-all"
      >
        <div className="flex justify-between items-center gap-4">
          <span className="font-bold text-white text-sm sm:text-base">{faq.q}</span>
          {open ? (
            <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
          )}
        </div>
        {open && (
          <p className="text-slate-400 text-sm leading-relaxed mt-3 pr-8">
            {faq.a}
          </p>
        )}
      </button>
    </motion.div>
  );
}

export default function SupportPage() {
  const { language } = useLanguage();
  const currentFAQS = language === 'hi' ? FAQS_HI : FAQS;
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    // In production, this would send to an API
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
      <Navbar />

      <section className="max-w-5xl mx-auto px-4 sm:px-8 pt-10 sm:pt-16 pb-16 sm:pb-24 flex-1">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10 sm:mb-14"
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-500/20 px-3 py-1 rounded-full mb-4">
            <HelpCircle className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-blue-300">{language === 'hi' ? 'सहायता केंद्र' : 'HELP CENTER'}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            {language === 'hi' ? 'समर्थन और सहायता' : 'Support & Help'}
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            {language === 'hi' ? 'जल्दी से उत्तर खोजें या संपर्क करें — हम आपकी सफलता में मदद करने के लिए यहाँ हैं।' : "Find answers quickly or reach out — we're here to help you succeed."}
          </p>
        </motion.div>

        {/* Quick Contact Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 sm:mb-16">
          {[
            {
              icon: MessageSquare,
              title: language === 'hi' ? "लाइव चैट" : "Live Chat",
              desc: language === 'hi' ? "हमारे साथ रियल-टाइम चैट करें" : "Chat with us in real-time",
              action: language === 'hi' ? "चैट शुरू करें" : "Start Chat",
              color: "blue",
            },
            {
              icon: Mail,
              title: language === 'hi' ? "हमें ईमेल करें" : "Email Us",
              desc: "support@auraprep.in",
              action: language === 'hi' ? "ईमेल भेजें" : "Send Email",
              color: "purple",
            },
            {
              icon: Clock,
              title: language === 'hi' ? "प्रतिक्रिया समय" : "Response Time",
              desc: language === 'hi' ? "आमतौर पर 2 घंटे के भीतर" : "Usually within 2 hours",
              action: language === 'hi' ? "स्थिति देखें" : "View Status",
              color: "emerald",
            },
          ].map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.1 }}
                className="bg-[#12121a] border border-white/5 rounded-2xl p-6 text-center hover:border-white/10 transition-all group cursor-pointer hover-lift"
              >
                <div className={`w-12 h-12 rounded-xl bg-${card.color}-500/10 flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <Icon className={`w-6 h-6 text-${card.color}-400`} />
                </div>
                <h3 className="font-bold text-white mb-1">{card.title}</h3>
                <p className="text-xs text-slate-500 mb-4">{card.desc}</p>
                <span className="text-xs font-bold text-blue-400">{card.action} →</span>
              </motion.div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 text-center">
            {language === 'hi' ? 'अक्सर पूछे जाने वाले प्रश्न' : 'Frequently Asked Questions'}
          </h2>
          <div className="space-y-3 max-w-3xl mx-auto">
            {currentFAQS.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>
        </div>

        {/* Contact Form */}
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-extrabold text-white mb-6 text-center">
            {language === 'hi' ? 'अभी भी मदद चाहिए? हमें लिखें।' : 'Still need help? Write to us.'}
          </h2>

          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl text-emerald-400 text-sm font-medium text-center flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> {language === 'hi' ? 'संदेश भेजा गया! हम जल्द ही आपसे संपर्क करेंगे।' : "Message sent! We'll get back to you soon."}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={language === 'hi' ? 'आपका नाम' : 'Your Name'}
                className="w-full px-4 py-3.5 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm font-medium"
              />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder={language === 'hi' ? 'आपका ईमेल' : 'Your Email'}
                className="w-full px-4 py-3.5 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm font-medium"
              />
            </div>
            <textarea
              required
              rows={5}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder={language === 'hi' ? 'अपनी समस्या या प्रश्न का वर्णन करें...' : 'Describe your issue or question...'}
              className="w-full px-4 py-3.5 bg-[#12121a] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all text-sm font-medium resize-none"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-base hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> {language === 'hi' ? 'संदेश भेजें' : 'Send Message'}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}
