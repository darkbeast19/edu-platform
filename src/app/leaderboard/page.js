"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Trophy,
  Flame,
  Medal,
  Crown,
  TrendingUp,
  ChevronUp,
  ChevronDown,
  Minus,
  Users,
  Target,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const LEADERBOARD_DATA = [
  { rank: 1, name: "Priya Sharma", username: "priya_cgl", xp: 48750, streak: 96, accuracy: 94.2, change: "up" },
  { rank: 2, name: "Rahul Verma", username: "rahul_v", xp: 45200, streak: 84, accuracy: 91.8, change: "up" },
  { rank: 3, name: "Anita Devi", username: "anita_ntpc", xp: 43100, streak: 72, accuracy: 89.5, change: "same" },
  { rank: 4, name: "Vikash Kumar", username: "vikash_k", xp: 41800, streak: 65, accuracy: 88.1, change: "down" },
  { rank: 5, name: "Sneha Gupta", username: "sneha_g", xp: 39400, streak: 58, accuracy: 92.3, change: "up" },
  { rank: 6, name: "Amit Patel", username: "amit_sbi", xp: 37200, streak: 52, accuracy: 87.6, change: "down" },
  { rank: 7, name: "Kavita Singh", username: "kavita_s", xp: 35900, streak: 48, accuracy: 86.9, change: "up" },
  { rank: 8, name: "Deepak Yadav", username: "deepak_y", xp: 34100, streak: 44, accuracy: 85.4, change: "same" },
  { rank: 9, name: "Ritu Kumari", username: "ritu_k", xp: 32800, streak: 40, accuracy: 90.1, change: "up" },
  { rank: 10, name: "Suresh Nair", username: "suresh_n", xp: 31500, streak: 38, accuracy: 84.7, change: "down" },
  { rank: 11, name: "Pooja Mishra", username: "pooja_m", xp: 30200, streak: 35, accuracy: 83.2, change: "up" },
  { rank: 12, name: "Arjun Roy", username: "arjun_r", xp: 28900, streak: 32, accuracy: 82.8, change: "same" },
];

const MEDAL_STYLES = {
  1: {
    bg: "bg-gradient-to-br from-yellow-500/20 to-amber-500/10",
    border: "border-yellow-500/30",
    ring: "ring-yellow-500/30",
    textColor: "text-yellow-400",
    icon: Crown,
    label: "CHAMPION",
  },
  2: {
    bg: "bg-gradient-to-br from-slate-300/15 to-gray-400/5",
    border: "border-slate-400/20",
    ring: "ring-slate-400/20",
    textColor: "text-slate-300",
    icon: Medal,
    label: "ELITE",
  },
  3: {
    bg: "bg-gradient-to-br from-amber-700/20 to-orange-800/10",
    border: "border-amber-700/30",
    ring: "ring-amber-700/20",
    textColor: "text-amber-500",
    icon: Medal,
    label: "VETERAN",
  },
};

function ChangeIndicator({ change }) {
  if (change === "up") return <ChevronUp className="w-4 h-4 text-emerald-400" />;
  if (change === "down") return <ChevronDown className="w-4 h-4 text-rose-400" />;
  return <Minus className="w-4 h-4 text-slate-600" />;
}

function TopThreeCard({ user, delay }) {
  const style = MEDAL_STYLES[user.rank];
  const Icon = style.icon;
  const sizeClass = user.rank === 1 ? "sm:col-span-1 sm:order-2" : user.rank === 2 ? "sm:order-1" : "sm:order-3";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className={`${sizeClass}`}
    >
      <div
        className={`${style.bg} border ${style.border} rounded-3xl p-6 sm:p-8 text-center relative overflow-hidden group hover-lift`}
      >
        {/* Glow */}
        {user.rank === 1 && (
          <div className="absolute inset-0 bg-yellow-500/5 animate-pulse-slow pointer-events-none" />
        )}

        <div className="relative z-10">
          {/* Badge */}
          <div className={`inline-flex items-center gap-1.5 text-xs font-bold ${style.textColor} mb-4`}>
            <Icon className="w-4 h-4" />
            {style.label}
          </div>

          {/* Avatar */}
          <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 ring-4 ${style.ring} bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center`}>
            <span className="text-white font-extrabold text-lg sm:text-xl">
              {user.name.split(" ").map((n) => n[0] || "").join("").substring(0,2).toUpperCase()}
            </span>
          </div>

          {/* Info */}
          <h3 className="font-bold text-white text-base sm:text-lg">{user.name}</h3>
          <p className="text-xs text-slate-500 mb-4">@{user.username}</p>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white">{user.xp.toLocaleString()}</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">XP</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white flex items-center justify-center gap-1">
                <Flame className="w-4 h-4 text-orange-500" />
                {user.streak}
              </div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Streak</div>
            </div>
            <div>
              <div className="text-base sm:text-lg font-extrabold text-white">{user.accuracy}%</div>
              <div className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Accuracy</div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default function LeaderboardPage() {
  const [leaderboardData, setLeaderboardData] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchLeaderboard() {
      // Dynamic import to prevent client/server mismatches during initial fast load
      const { createClient } = await import('@/lib/supabase/client');
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('xp_total', { ascending: false })
        .limit(100);

      if (data && data.length > 0) {
        setLeaderboardData(data.map((profile, index) => ({
          rank: index + 1,
          name: profile.full_name || profile.username || 'Student',
          username: profile.username || `user_${profile.id.substring(0,4)}`,
          xp: profile.xp_total || 0,
          streak: profile.streak_days || 0,
          accuracy: 90 + (index % 5), // Simulated accuracy for now
          change: index % 3 === 0 ? "up" : index % 2 === 0 ? "down" : "same"
        })));
      }
      setLoading(false);
    }
    fetchLeaderboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
            <div className="text-slate-400 font-bold animate-pulse">Loading Global Rankings...</div>
        </div>
      </div>
    );
  }

  const topThree = leaderboardData.slice(0, 3);
  const rest = leaderboardData.slice(3);

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
          <div className="inline-flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/20 px-3 py-1 rounded-full mb-4">
            <Trophy className="w-4 h-4 text-yellow-500" />
            <span className="text-xs font-bold text-yellow-300">GLOBAL RANKING</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
            Leaderboard
          </h1>
          <p className="text-slate-400 text-sm sm:text-base max-w-md mx-auto">
            Top students who are crushing it daily. Climb the ranks by maintaining your streaks and earning XP.
          </p>
        </motion.div>

        {/* Top 3 Podium */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 mb-10 sm:mb-14">
          {topThree.map((user, i) => (
            <TopThreeCard key={user.rank} user={user} delay={0.1 + i * 0.15} />
          ))}
        </div>

        {/* Leaderboard Table */}
        <div className="bg-[#12121a] border border-white/5 rounded-2xl overflow-hidden">
          {/* Header */}
          <div className="grid grid-cols-12 px-4 sm:px-6 py-3 text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-white/5">
            <div className="col-span-1 text-center">#</div>
            <div className="col-span-5 sm:col-span-4">Student</div>
            <div className="col-span-2 text-right">XP</div>
            <div className="col-span-2 text-right hidden sm:block">Streak</div>
            <div className="col-span-2 text-right hidden sm:block">Accuracy</div>
            <div className="col-span-4 sm:col-span-1 text-right">Trend</div>
          </div>

          {/* Rows */}
          {rest.map((user, i) => (
            <motion.div
              key={user.rank}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.05 }}
              className="grid grid-cols-12 px-4 sm:px-6 py-4 items-center border-b border-white/[0.03] hover:bg-white/[0.03] transition-colors"
            >
              <div className="col-span-1 text-center">
                <span className="text-sm font-bold text-slate-400">{user.rank}</span>
              </div>
              <div className="col-span-5 sm:col-span-4 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-[11px]">
                    {user.name.split(" ").map((n) => n[0]).join("")}
                  </span>
                </div>
                <div className="min-w-0">
                  <div className="text-sm font-bold text-white truncate">{user.name}</div>
                  <div className="text-[11px] text-slate-500 truncate">@{user.username}</div>
                </div>
              </div>
              <div className="col-span-2 text-right">
                <span className="text-sm font-bold text-white">{user.xp.toLocaleString()}</span>
              </div>
              <div className="col-span-2 text-right hidden sm:flex items-center justify-end gap-1">
                <Flame className="w-3.5 h-3.5 text-orange-500" />
                <span className="text-sm font-bold text-white">{user.streak}</span>
              </div>
              <div className="col-span-2 text-right hidden sm:block">
                <span className="text-sm font-bold text-blue-400">{user.accuracy}%</span>
              </div>
              <div className="col-span-4 sm:col-span-1 flex justify-end">
                <ChangeIndicator change={user.change} />
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
}
