/**
 * AuraPrep — Central Translations Dictionary
 * All static UI strings in one place. Use: t(key, language)
 *
 * Usage:
 *   import { t } from "@/lib/translations";
 *   const { language } = useLanguage();
 *   <h1>{t('dashboard.welcome', language)}</h1>
 */

const translations = {
  // ── Common ────────────────────────────────────────────────────────────────
  "common.loading": { en: "Loading...", hi: "लोड हो रहा है..." },
  "common.search": { en: "Search", hi: "खोजें" },
  "common.cancel": { en: "Cancel", hi: "रद्द करें" },
  "common.save": { en: "Save", hi: "सहेजें" },
  "common.saving": { en: "Saving...", hi: "सहेजा जा रहा है..." },
  "common.submit": { en: "Submit", hi: "सबमिट करें" },
  "common.back": { en: "Back", hi: "वापस जाएं" },
  "common.next": { en: "Next", hi: "अगला" },
  "common.prev": { en: "Prev", hi: "पिछला" },
  "common.finish": { en: "Finish", hi: "समाप्त करें" },
  "common.retry": { en: "Retry", hi: "पुनः प्रयास" },
  "common.questions": { en: "Questions", hi: "प्रश्न" },
  "common.minutes": { en: "minutes", hi: "मिनट" },
  "common.locked": { en: "Locked", hi: "लॉक है" },
  "common.unlocked": { en: "Unlocked", hi: "अनलॉक" },
  "common.student": { en: "Student", hi: "छात्र" },
  "common.accuracy": { en: "Accuracy", hi: "सटीकता" },
  "common.score": { en: "Score", hi: "स्कोर" },
  "common.trend": { en: "Trend", hi: "प्रवृत्ति" },
  "common.topics": { en: "Topics", hi: "उप-विषय" },
  "common.signIn": { en: "Sign In", hi: "साइन इन" },
  "common.signOut": { en: "Sign Out", hi: "साइन आउट" },
  "common.change": { en: "Change", hi: "बदलें" },
  "common.all": { en: "All", hi: "सभी" },

  // ── Navbar ────────────────────────────────────────────────────────────────
  "nav.exams": { en: "Exams", hi: "परीक्षाएं" },
  "nav.leaderboard": { en: "Leaderboard", hi: "लीडरबोर्ड" },
  "nav.testimonials": { en: "Testimonials", hi: "प्रशंसापत्र" },
  "nav.support": { en: "Support", hi: "सहायता" },
  "nav.dashboard": { en: "Dashboard", hi: "डैशबोर्ड" },
  "nav.myProfile": { en: "My Profile", hi: "मेरी प्रोफ़ाइल" },
  "nav.analytics": { en: "Analytics", hi: "एनालिटिक्स" },
  "nav.signedInAs": { en: "Signed in as", hi: "के रूप में साइन इन हैं" },

  // ── Dashboard ─────────────────────────────────────────────────────────────
  "dashboard.loading": { en: "Loading Arena...", hi: "लोड हो रहा है..." },
  "dashboard.welcomePrefix": { en: "What do you want to learn today,", hi: "आज आप क्या सीखना चाहते हैं," },
  "dashboard.subheading": {
    en: "Search for any topic, PYQ, or exam concept. Or dive right back into your active subjects.",
    hi: "किसी भी विषय, PYQ या परीक्षा अवधारणा की खोज करें। या अपने सक्रिय विषयों पर वापस जाएं।"
  },
  "dashboard.searchPlaceholder": {
    en: "Search topics (e.g. Ratio and Proportion)...",
    hi: "विषय खोजें (उदा. अनुपात और समानुपात)..."
  },
  "dashboard.popularExams": { en: "Popular Exam Categories", hi: "लोकप्रिय परीक्षा श्रेणियां" },
  "dashboard.continueLearning": { en: "Continue Learning", hi: "सीखना जारी रखें" },
  "dashboard.yourProgress": { en: "Your Progress", hi: "आपकी प्रगति" },
  "dashboard.dayStreak": { en: "Day Streak", hi: "दिन की स्ट्रीक" },
  "dashboard.questionsSolved": { en: "Questions Solved", hi: "हल किए गए प्रश्न" },
  "dashboard.viewAnalytics": { en: "View Detailed Analytics", hi: "विस्तृत एनालिटिक्स देखें" },

  // ── Exam Categories ───────────────────────────────────────────────────────
  "exam.ssc": { en: "SSC Exams", hi: "SSC परीक्षा" },
  "exam.railway": { en: "Railway", hi: "रेलवे" },
  "exam.banking": { en: "Banking", hi: "बैंकिंग" },
  "exam.stateGovt": { en: "State Govt", hi: "राज्य सरकार" },
  "exam.defence": { en: "Defence", hi: "रक्षा" },
  "exam.teaching": { en: "Teaching", hi: "शिक्षण" },

  // ── Quiz Page ─────────────────────────────────────────────────────────────
  "quiz.configure": { en: "Configure Practice", hi: "अभ्यास कॉन्फ़िगर करें" },
  "quiz.examLabel": { en: "Exam:", hi: "परीक्षा:" },
  "quiz.selectedSubjects": { en: "Selected Subjects", hi: "चयनित विषय" },
  "quiz.questionCount": { en: "Number of Questions", hi: "प्रश्नों की संख्या" },
  "quiz.difficulty": { en: "Difficulty Level", hi: "कठिनाई स्तर" },
  "quiz.beginner": { en: "Beginner", hi: "शुरुआती" },
  "quiz.intermediate": { en: "Intermediate", hi: "मध्यम" },
  "quiz.hard": { en: "Hard Mode", hi: "कठिन" },
  "quiz.estimated": { en: "Estimated:", hi: "अनुमानित:" },
  "quiz.enterArena": { en: "Enter Arena", hi: "प्रारंभ करें" },
  "quiz.generating": { en: "Generating Questions...", hi: "प्रश्न उत्पन्न हो रहे हैं..." },
  "quiz.selectExam": { en: "Select an exam to choose subjects", hi: "विषय चुनने के लिए परीक्षा चुनें" },
  "quiz.quit": { en: "Quit", hi: "छोड़ें" },
  "quiz.progress": { en: "PROGRESS", hi: "प्रगति" },
  "quiz.translating": { en: "Translating...", hi: "अनुवाद हो रहा है..." },
  "quiz.translateToHindi": { en: "हिंदी में देखें", hi: "English Mode" },
  "quiz.retryHindi": { en: "Retry Hindi", hi: "पुनः प्रयास" },
  "quiz.completed": { en: "Quiz Completed!", hi: "क्विज़ पूरा हुआ!" },
  "quiz.perfSummary": { en: "Here is your performance summary.", hi: "यहाँ आपका प्रदर्शन सारांश है।" },
  "quiz.reviewAnswers": { en: "Review Answers", hi: "उत्तरों की समीक्षा करें" },
  "quiz.answered": { en: "answered", hi: "उत्तर दिए गए" },
  "quiz.questionPalette": { en: "Question Palette", hi: "प्रश्न पैलेट" },
  "quiz.mark": { en: "Mark", hi: "चिह्नित करें" },
  "quiz.marked": { en: "Marked", hi: "चिह्नित" },
  "quiz.submitTest": { en: "Submit Test", hi: "टेस्ट सबमिट करें" },
  "quiz.submitted": { en: "✅ Submitted", hi: "✅ सबमिट किया गया" },
  "quiz.mistakeAnalysis": { en: "AI Mistake Analysis", hi: "AI गलती विश्लेषण" },
  "quiz.shortcutTrick": { en: "Shortcut Trick", hi: "शॉर्टकट ट्रिक" },
  "quiz.stepByStep": { en: "Step-by-Step Logic", hi: "स्टेप-बाय-स्टेप तर्क" },
  "quiz.legendAnswered": { en: "Answered", hi: "उत्तर दिया" },
  "quiz.legendMarked": { en: "Marked", hi: "चिह्नित" },
  "quiz.legendUnanswered": { en: "Unanswered", hi: "अनुत्तरित" },
  "quiz.xpLabel": { en: "XP", hi: "एक्सपी" },

  // ── Leaderboard ───────────────────────────────────────────────────────────
  "lb.loading": { en: "Loading Global Rankings...", hi: "वैश्विक रैंकिंग लोड हो रही है..." },
  "lb.globalRanking": { en: "GLOBAL RANKING", hi: "वैश्विक रैंकिंग" },
  "lb.title": { en: "Leaderboard", hi: "लीडरबोर्ड" },
  "lb.subtitle": {
    en: "Top students who are crushing it daily. Climb the ranks by maintaining your streaks and earning XP.",
    hi: "शीर्ष छात्र जो हर दिन शानदार प्रदर्शन कर रहे हैं। अपनी स्ट्रीक बनाए रखकर और XP अर्जित करके रैंक में ऊपर चढ़ें।"
  },
  "lb.champion": { en: "CHAMPION", hi: "चैंपियन" },
  "lb.elite": { en: "ELITE", hi: "विशिष्ट" },
  "lb.veteran": { en: "VETERAN", hi: "अनुभवी" },

  // ── Profile ────────────────────────────────────────────────────────────────
  "profile.loading": { en: "Loading Profile...", hi: "प्रोफ़ाइल लोड हो रही है..." },
  "profile.backToDashboard": { en: "Back to Dashboard", hi: "डैशबोर्ड पर वापस जाएं" },
  "profile.editProfile": { en: "Edit Profile", hi: "प्रोफ़ाइल संपादित करें" },
  "profile.displayName": { en: "Display Name", hi: "प्रदर्शन नाम" },
  "profile.chooseAvatar": { en: "Choose Avatar", hi: "अवतार चुनें" },
  "profile.dayStreak": { en: "Day Streak", hi: "दिन की स्ट्रीक" },
  "profile.coinsEarned": { en: "Coins Earned", hi: "अर्जित सिक्के" },
  "profile.keepPracticing": { en: "You are doing great! Keep practicing.", hi: "आप बहुत अच्छा कर रहे हैं! अभ्यास करते रहें।" },
  "profile.totalExperience": { en: "Total Experience", hi: "कुल अनुभव" },
  "profile.trophyCabinet": { en: "Trophy Cabinet", hi: "ट्रॉफी कैबिनेट" },
  "profile.achievementsBadges": { en: "Your earned achievements and badges.", hi: "आपकी अर्जित उपलब्धियां और बैज।" },

  // ── Exams Page ────────────────────────────────────────────────────────────
  "exams.title": { en: "Explore Exams & Topics", hi: "परीक्षाएं और विषय एक्सप्लोर करें" },
  "exams.subtitle": {
    en: "Browse by exam or drill down into specific subjects and topics.",
    hi: "परीक्षा के अनुसार ब्राउज़ करें या विशिष्ट विषयों और उप-विषयों में गहराई से जाएं।"
  },
  "exams.searchPlaceholder": { en: "Search exams, subjects, or topics...", hi: "परीक्षाएं, विषय या उप-विषय खोजें..." },
  "exams.tabExams": { en: "Exams", hi: "परीक्षाएं" },
  "exams.tabSubjects": { en: "Subjects", hi: "विषय" },
  "exams.backToSubjects": { en: "Back to Subjects", hi: "विषयों पर वापस जाएं" },
  "exams.topicsLabel": { en: "Topics", hi: "उप-विषय" },
  "exams.topicsAvailable": { en: "topics available", hi: "उप-विषय उपलब्ध हैं" },
  "exams.startPractice": { en: "Start Practice", hi: "अभ्यास शुरू करें" },
};

/**
 * Get translated string
 * @param {string} key - Translation key e.g. "common.loading"
 * @param {string} lang - "en" or "hi"
 * @returns {string}
 */
export function t(key, lang = "en") {
  const entry = translations[key];
  if (!entry) {
    console.warn(`[i18n] Missing translation key: "${key}"`);
    return key;
  }
  return entry[lang] || entry["en"] || key;
}

export default translations;
