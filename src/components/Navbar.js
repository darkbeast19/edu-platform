"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import {
  BrainCircuit, Menu, X, Trophy, BookOpen, Heart, HelpCircle,
  User, LogIn, LogOut, LayoutDashboard, Settings, ChevronDown, BarChart3,
} from "lucide-react";

const NAV_LINKS = [
  { label: "Exams", href: "/exams", icon: BookOpen },
  { label: "Leaderboard", href: "/leaderboard", icon: Trophy },
  { label: "Testimonials", href: "/testimonials", icon: Heart },
  { label: "Support", href: "/support", icon: HelpCircle },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    let supabase;
    let subscription;

    try {
      supabase = createClient();

      // 1. Get current session immediately (reads from localStorage)
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
      });

      // 2. Subscribe to future auth changes (login/logout events)
      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
      });
      subscription = data.subscription;
    } catch (e) {
      console.error("Navbar auth error:", e);
      setAuthReady(true); // show logged-out state gracefully
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    try {
      const supabase = createClient();
      await supabase.auth.signOut();
      setUser(null);
      setProfileOpen(false);
      router.push("/");
      router.refresh();
    } catch (e) {
      console.error("Logout error:", e);
    }
  };

  const displayName = user?.email?.split("@")[0] || "User";
  const avatarLetter = displayName[0]?.toUpperCase() || "U";

  return (
    <nav className="sticky top-0 z-50 border-b border-white/5 bg-[#0a0a0f]/80 backdrop-blur-xl">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group flex-shrink-0">
          <div className="p-2 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl shadow-[0_0_15px_rgba(59,130,246,0.5)] group-hover:shadow-[0_0_25px_rgba(59,130,246,0.7)] transition-shadow">
            <BrainCircuit className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          </div>
          <span className="font-extrabold text-xl sm:text-2xl tracking-tight text-white">AuraPrep</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Area */}
        <div className="hidden lg:flex items-center gap-3 min-w-[180px] justify-end">
          {/* Show nothing until auth is ready to avoid flash */}
          {authReady && (
            user ? (
              /* ── LOGGED IN: Profile Dropdown ── */
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white px-3 py-2 rounded-xl font-semibold text-sm transition-all group">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-xs font-bold flex-shrink-0">
                    {avatarLetter}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50">
                    <div className="px-4 py-3 border-b border-white/5">
                      <p className="text-xs text-slate-500 font-medium mb-0.5">Signed in as</p>
                      <p className="text-sm text-white font-bold truncate">{user.email}</p>
                    </div>
                    <div className="p-1.5 space-y-0.5">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                        <LayoutDashboard className="w-4 h-4 text-blue-400" /> Dashboard
                      </Link>
                      <Link href="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                        <User className="w-4 h-4 text-purple-400" /> My Profile
                      </Link>
                      <Link href="/dashboard/analytics" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-white/5 text-sm font-medium transition-all">
                        <BarChart3 className="w-4 h-4 text-emerald-400" /> Analytics
                      </Link>
                    </div>
                    <div className="p-1.5 border-t border-white/5">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 text-sm font-semibold transition-all">
                        <LogOut className="w-4 h-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* ── LOGGED OUT: Sign In Button ── */
              <Link href="/login"
                className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] transition-all">
                <LogIn className="w-4 h-4" /> Sign In
              </Link>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden p-2 text-slate-400 hover:text-white transition">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/5 bg-[#0a0a0f]/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-1">
            {NAV_LINKS.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-semibold text-sm transition-all ${
                    isActive ? "bg-white/10 text-white" : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}>
                  <Icon className="w-5 h-5" /> {link.label}
                </Link>
              );
            })}

            <div className="pt-3 border-t border-white/5 space-y-1">
              {user ? (
                <>
                  <div className="flex items-center gap-3 px-4 py-3 bg-white/5 rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center font-bold text-white">
                      {avatarLetter}
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">{displayName}</p>
                      <p className="text-slate-500 text-xs truncate max-w-[160px]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all">
                    <LayoutDashboard className="w-5 h-5 text-blue-400" /> Dashboard
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-400 hover:text-white hover:bg-white/5 font-semibold text-sm transition-all">
                    <User className="w-5 h-5 text-purple-400" /> My Profile
                  </Link>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 font-semibold text-sm transition-all">
                    <LogOut className="w-5 h-5" /> Sign Out
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold text-sm">
                  <LogIn className="w-5 h-5" /> Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
