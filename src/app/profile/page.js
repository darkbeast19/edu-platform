"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { 
  User, Mail, Flame, Trophy, Award, 
  Settings, LogOut, ChartBar, Hexagon,
  ArrowLeft, Star, Edit3
} from "lucide-react";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import { useLanguage } from "@/context/LanguageContext";

// Gamification milestones for Level Calculation (500 XP per level in MVP)
const calculateLevelProgress = (xp) => {
  const level = Math.floor(xp / 500) + 1;
  const currentLevelXp = xp % 500;
  const nextLevelXp = 500;
  const progressPercent = Math.min((currentLevelXp / nextLevelXp) * 100, 100);
  return { level, currentLevelXp, nextLevelXp, progressPercent };
};

// Available badges (Mock for UI, could be fetched from DB)
const getBadges = (lang) => [
  { id: 1, name: lang === 'en' ? "First Blood" : "फर्स्ट ब्लड", desc: lang === 'en' ? "Completed your first quiz" : "अपनी पहली क्विज़ पूरी की", icon: Star, color: "yellow", earned: true },
  { id: 2, name: lang === 'en' ? "3-Day Streak" : "3-दिन की स्ट्रीक", desc: lang === 'en' ? "Studied 3 days in a row" : "लगातार 3 दिन पढ़ाई की", icon: Flame, color: "orange", earned: true },
  { id: 3, name: lang === 'en' ? "Sharpshooter" : "शार्पशूटर", desc: lang === 'en' ? "Got 100% accuracy in a Hard quiz" : "कठिन क्विज़ में 100% सटीकता प्राप्त की", icon: Target, color: "red", earned: false },
  { id: 4, name: lang === 'en' ? "Knowledge Seeker" : "ज्ञान खोजी", desc: lang === 'en' ? "Solved 1,000 questions" : "1,000 प्रश्न हल किए", icon: BookOpen, color: "blue", earned: false },
  { id: 5, name: lang === 'en' ? "Speedster" : "स्पीडस्टर", desc: lang === 'en' ? "Finished a quiz 2x faster than average" : "औसत से दोगुने तेजी से क्विज़ पूरी की", icon: Zap, color: "emerald", earned: false },
  { id: 6, name: lang === 'en' ? "Champion" : "चैंपियन", desc: lang === 'en' ? "Reached Level 10" : "स्तर 10 तक पहुंचे", icon: Trophy, color: "purple", earned: false },
];

import { Target, BookOpen, Zap } from "lucide-react"; // Forgot these up there

// Available Avatars
const AVATARS = [
  "https://api.dicebear.com/7.x/bottts/svg?seed=Aura",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Prep",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Scholar",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Ninja",
  "https://api.dicebear.com/7.x/bottts/svg?seed=Wizard",
];

export default function ProfilePage() {
  const router = useRouter();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [selectedAvatar, setSelectedAvatar] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const { language } = useLanguage();

  useEffect(() => {
    async function loadProfile() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }

      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (data) {
        setProfile(data);
        setEditName(data.full_name || data.username || "");
        setSelectedAvatar(data.avatar_url || AVATARS[0]);
      }
      setLoading(false);
    }
    loadProfile();
  }, [router]);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  };

  const handleSaveProfile = async () => {
    if (!profile) return;
    setIsSaving(true);
    const supabase = createClient();
    
    try {
      const { error } = await supabase.from('profiles').update({
        full_name: editName,
        avatar_url: selectedAvatar
      }).eq('id', profile.id);

      if (!error) {
        setProfile(prev => ({ ...prev, full_name: editName, avatar_url: selectedAvatar }));
        setIsEditing(false);
      }
    } catch (err) {
      console.error("Failed to save profile", err);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0a0a0f] text-slate-200 flex items-center justify-center font-bold text-xl">{language === 'en' ? 'Loading Profile...' : 'प्रोफ़ाइल लोड हो रही है...'}</div>;
  }

  const { level, currentLevelXp, nextLevelXp, progressPercent } = calculateLevelProgress(profile?.xp_total || 0);

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-slate-200 font-sans selection:bg-purple-500/30 flex flex-col">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 sm:px-8 py-10 w-full flex-1">
        
        {/* Header Navigation */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/dashboard" className="text-slate-400 hover:text-white text-sm flex items-center gap-2 transition">
            <ArrowLeft className="w-4 h-4" /> {language === 'en' ? 'Back to Dashboard' : 'डैशबोर्ड पर वापस जाएं'}
          </Link>
          <button 
            onClick={handleSignOut}
            className="flex items-center gap-2 text-red-400 hover:text-red-300 bg-red-500/10 hover:bg-red-500/20 px-4 py-2 rounded-xl transition text-sm font-bold"
          >
            <LogOut className="w-4 h-4" /> {language === 'en' ? 'Sign Out' : 'साइन आउट'}
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left Column: User Card & Stats */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Identity Card */}
            <div className="bg-[#12121a] border border-white/10 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl rounded-full" />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                <div className="relative mb-5 group">
                  <div className="w-28 h-28 rounded-full bg-slate-800 border-4 border-blue-500/[0.15] p-2 overflow-hidden bg-white/5">
                    <img src={selectedAvatar} alt="Avatar" className="w-full h-full object-contain" />
                  </div>
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center pointer-events-none">
                      <Edit3 className="w-6 h-6 text-white mb-1" />
                      <span className="text-[10px] text-white font-bold uppercase">{language === 'en' ? 'Change' : 'बदलें'}</span>
                    </div>
                  )}
                </div>

                {!isEditing ? (
                  <>
                    <h1 className="text-2xl font-extrabold text-white mb-1">{profile?.full_name || profile?.username}</h1>
                    <div className="flex items-center gap-2 text-slate-500 text-sm mb-6">
                      <Mail className="w-4 h-4" /> {profile?.email}
                    </div>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-sm font-bold transition flex justify-center items-center gap-2"
                    >
                      <Settings className="w-4 h-4" /> {language === 'en' ? 'Edit Profile' : 'प्रोफ़ाइल संपादित करें'}
                    </button>
                  </>
                ) : (
                  <div className="w-full space-y-4">
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block text-left mb-2">{language === 'en' ? 'Display Name' : 'प्रदर्शन नाम'}</label>
                      <input 
                        type="text" 
                        value={editName} 
                        onChange={(e) => setEditName(e.target.value)}
                        className="w-full bg-[#0a0a0f] border border-white/10 rounded-xl px-4 py-2.5 text-white outline-none focus:border-blue-500/50"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-slate-500 font-bold uppercase tracking-wider block text-left mb-2">{language === 'en' ? 'Choose Avatar' : 'अवतार चुनें'}</label>
                      <div className="flex gap-2 justify-center">
                        {AVATARS.map((av, i) => (
                          <button 
                            key={i} onClick={() => setSelectedAvatar(av)}
                            className={`w-10 h-10 rounded-full p-1 border-2 transition ${selectedAvatar === av ? 'border-blue-500 bg-blue-500/20' : 'border-transparent hover:border-white/20'}`}
                          >
                            <img src={av} alt={`av-${i}`} className="w-full h-full" />
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex gap-2 pt-2">
                      <button 
                        onClick={() => { setIsEditing(false); setEditName(profile?.full_name || profile?.username); setSelectedAvatar(profile?.avatar_url || AVATARS[0]); }}
                        className="flex-1 py-2.5 bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl text-sm font-bold transition"
                      >
                        {language === 'en' ? 'Cancel' : 'रद्द करें'}
                      </button>
                      <button 
                        onClick={handleSaveProfile} disabled={isSaving}
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-sm font-bold transition disabled:opacity-50"
                      >
                        {isSaving ? (language === 'en' ? "Saving..." : "सहेजा जा रहा है...") : (language === 'en' ? "Save" : "सहेजें")}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 text-center">
                <Flame className="w-6 h-6 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{profile?.streak_days || 0}</div>
                <div className="text-xs text-slate-500 font-medium uppercase mt-1">{language === 'en' ? 'Day Streak' : 'दिन की स्ट्रीक'}</div>
              </div>
              <div className="bg-[#12121a] border border-white/10 rounded-2xl p-5 text-center">
                <Award className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-extrabold text-white">{profile?.coins || 0}</div>
                <div className="text-xs text-slate-500 font-medium uppercase mt-1">{language === 'en' ? 'Coins Earned' : 'अर्जित सिक्के'}</div>
              </div>
            </div>

          </div>

          {/* Right Column: Level & Badges */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Level Banner */}
            <div className="bg-gradient-to-br from-[#12121a] to-[#0a0a0f] border border-blue-500/20 rounded-3xl p-8 relative overflow-hidden">
              <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
              
              <div className="flex flex-col sm:flex-row items-center sm:items-end justify-between mb-6 gap-4 relative z-10">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <Hexagon className="w-20 h-20 text-blue-500 fill-blue-500/10" strokeWidth={1} />
                    <div className="absolute inset-0 flex items-center justify-center flex-col">
                      <span className="text-xs font-bold text-blue-400 -mb-1">LVL</span>
                      <span className="text-2xl font-extrabold text-white">{level}</span>
                    </div>
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-1">AuraRank: <span className="text-blue-400">Bronze III</span></h2>
                    <p className="text-slate-400 text-sm">{language === 'en' ? 'You are doing great! Keep practicing.' : 'आप बहुत अच्छा कर रहे हैं! अभ्यास करते रहें।'}</p>
                  </div>
                </div>
                <div className="text-center sm:text-right">
                  <div className="text-2xl font-bold text-yellow-500">{profile?.xp_total || 0} XP</div>
                  <div className="text-xs text-slate-500 font-bold uppercase tracking-wider mt-1">{language === 'en' ? 'Total Experience' : 'कुल अनुभव'}</div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="relative z-10">
                <div className="flex justify-between text-xs font-bold text-slate-400 mb-2">
                  <span>{language === 'en' ? `Level ${level}` : `स्तर ${level}`}</span>
                  <span>{currentLevelXp} / {nextLevelXp} XP {language === 'en' ? `to Level ${level + 1}` : `स्तर ${level + 1} तक`}</span>
                </div>
                <div className="h-4 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5 shadow-inner">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-1000 relative"
                    style={{ width: `${progressPercent}%` }}
                  >
                    <div className="absolute inset-0 bg-white/20 w-full animate-pulse blur-[2px]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Badges Cabinet */}
            <div className="bg-[#12121a] border border-white/10 rounded-3xl p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-xl font-bold text-white mb-1">{language === 'en' ? 'Trophy Cabinet' : 'ट्रॉफी कैबिनेट'}</h2>
                  <p className="text-slate-500 text-sm">{language === 'en' ? 'Your earned achievements and badges.' : 'आपकी अर्जित उपलब्धियां और बैज।'}</p>
                </div>
                <div className="text-sm font-bold text-slate-400 bg-white/5 px-4 py-2 rounded-xl">
                  {getBadges(language).filter(b => b.earned).length} / {getBadges(language).length} {language === 'en' ? 'Unlocked' : 'अनलॉक किया गया'}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {getBadges(language).map((badge) => {
                  const Icon = badge.icon;
                  return (
                    <div 
                      key={badge.id}
                      className={`relative p-5 rounded-2xl border transition-all ${
                        badge.earned 
                          ? `bg-${badge.color}-500/10 border-${badge.color}-500/30 cursor-pointer hover:bg-${badge.color}-500/20 hover:-translate-y-1`
                          : `bg-[#0a0a0f] border-white/5 opacity-50 grayscale`
                      }`}
                    >
                      {!badge.earned && (
                        <div className="absolute top-2 right-3 text-[10px] font-bold text-slate-500 uppercase tracking-widest">{language === 'en' ? 'Locked' : 'लॉक है'}</div>
                      )}
                      <div className={`w-12 h-12 rounded-full mb-3 flex items-center justify-center shadow-lg ${
                        badge.earned 
                          ? `bg-${badge.color}-500/20 text-${badge.color}-400 ring-2 ring-${badge.color}-500/50` 
                          : `bg-slate-800 text-slate-500`
                      }`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className={`font-bold text-sm mb-1 ${badge.earned ? 'text-white' : 'text-slate-400'}`}>
                        {badge.name}
                      </h3>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {badge.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>
      </main>
    </div>
  );
}
