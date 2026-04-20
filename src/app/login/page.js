"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BrainCircuit, Mail, Lock, Flame, ArrowRight, Loader2, AlertCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [envStatus, setEnvStatus] = useState(null);
  const router = useRouter();

  // On mount, check if env vars are available
  useEffect(() => {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!url || !key) {
      setEnvStatus("⚠️ Database not configured. Contact support.");
    } else {
      setEnvStatus(null); // all good
    }
  }, []);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    // Pre-check env vars
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      setError("Database configuration missing. Please check environment variables in Netlify dashboard.");
      setLoading(false);
      return;
    }

    try {
      const { createClient } = await import("@/lib/supabase/client");
      const supabase = createClient();

      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        if (data?.user?.identities?.length === 0) {
          setError("An account with this email already exists. Please log in instead.");
        } else {
          setSuccessMsg("Account created! Check your email for a confirmation link, or try logging in directly.");
          setIsSignUp(false);
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        if (data?.session) {
          setSuccessMsg("Login successful! Redirecting...");
          setTimeout(() => {
            router.push("/dashboard");
          }, 500);
        } else {
          setError("Login failed. No session created. Please try again.");
        }
      }
    } catch (err) {
      console.error("Auth error:", err);
      // Map common Supabase errors to user-friendly messages
      if (err.message?.includes("Invalid login credentials")) {
        setError("Wrong email or password. Please check and try again.");
      } else if (err.message?.includes("Email not confirmed")) {
        setError("Please confirm your email first. Check your inbox for a confirmation link.");
      } else if (err.message?.includes("User already registered")) {
        setError("This email is already registered. Please log in.");
        setIsSignUp(false);
      } else if (err.message?.includes("supabaseUrl") || err.message?.includes("URL")) {
        setError("Database connection failed. Please check Netlify environment variables.");
      } else {
        setError(err.message || "An unexpected error occurred. Please try again.");
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

          {/* Env var warning */}
          {envStatus && (
            <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl text-yellow-400 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              {envStatus}
            </div>
          )}

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400 text-sm font-medium flex items-start gap-2">
              <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Success message */}
          {successMsg && (
            <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-xl text-green-400 text-sm font-medium text-center">
              {successMsg}
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
                  disabled={loading}
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
                  disabled={loading}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !!envStatus}
              className="w-full relative group overflow-hidden bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-bold text-lg hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <div className="relative flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{isSignUp ? "Creating..." : "Logging in..."}</span>
                  </>
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
              onClick={() => { setIsSignUp(!isSignUp); setError(null); setSuccessMsg(null); }}
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
