"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Mail, Lock, Flame, ArrowRight, Loader2 } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (isSignUp) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            // Need to set email confirmation to false in Supabase Dashboard -> Auth -> Providers for quick MVP flow
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Success! Check your email or try logging in if auto-confirm is enabled.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh(); // Refresh to update middleware state
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Fallback for variable issues:
      if (err.message.includes("supabaseUrl")) {
         setError("Critical API Error: Database URL is missing. Please check Netlify Environment Variables.");
      } else {
         setError(err.message || "An unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center p-4 relative overflow-hidden selection:bg-purple-500/30">
      {/* Background Gamified Glows */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse-slow"></div>
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-600/10 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="flex items-center justify-center gap-3 mb-8 cursor-pointer group">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.6)] group-hover:scale-110 transition-transform">
            <BrainCircuit className="w-8 h-8 text-white" />
          </div>
          <span className="font-extrabold text-4xl tracking-tight text-white">AuraPrep</span>
        </Link>

        <div className="bg-[#12121a] border border-white/10 p-8 rounded-3xl shadow-2xl backdrop-blur-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center gap-2 bg-blue-500/10 text-blue-400 text-xs font-bold px-3 py-1 rounded-full border border-blue-500/20 mb-4">
              <Flame className="w-4 h-4 text-orange-500" /> DAILY QUEST UNLOCKED
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">
              {isSignUp ? "Create your character" : "Enter the Arena"}
            </h1>
            <p className="text-slate-400 text-sm">
              {isSignUp ? "Join thousands of top scorers today." : "Log in to track your XP and continue your streak."}
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleAuth} className="space-y-5">
            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <div>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-3.5 bg-[#0a0a0f] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 transition-all font-medium"
                  placeholder="••••••••"
                  minLength="6"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    {isSignUp ? "Start Journey" : "Log In"} <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </div>
            </button>
          </form>

          <div className="mt-8 text-center text-sm font-medium">
            <span className="text-slate-400">
              {isSignUp ? "Already a veteran?" : "New to the arena?"}
            </span>{" "}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-blue-400 hover:text-purple-400 transition-colors cursor-pointer"
            >
              {isSignUp ? "Log In" : "Sign up here."}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
