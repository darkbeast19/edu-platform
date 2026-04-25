"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { useLanguage } from "@/context/LanguageContext";
import { t } from "@/lib/translations";
import {
  BrainCircuit, Menu, X, Trophy, BookOpen, Heart, HelpCircle,
  User, LogIn, LogOut, LayoutDashboard, BarChart3, ChevronDown,
} from "lucide-react";

const getNavLinks = (lang) => [
  { label: t('nav.exams', lang),        href: "/exams",        icon: BookOpen,  color: "blue"   },
  { label: t('nav.leaderboard', lang),  href: "/leaderboard", icon: Trophy,    color: "yellow" },
  { label: t('nav.testimonials', lang), href: "/testimonials",icon: Heart,     color: "pink"   },
  { label: t('nav.support', lang),      href: "/support",     icon: HelpCircle,color: "blue"   },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [authReady, setAuthReady] = useState(false);
  const { language, toggleLanguage } = useLanguage();
  const pathname = usePathname();
  const router = useRouter();
  const dropdownRef = useRef(null);

  useEffect(() => {
    let supabase;
    let subscription;

    try {
      supabase = createClient();
      supabase.auth.getSession().then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
      });

      const { data } = supabase.auth.onAuthStateChange((event, session) => {
        setUser(session?.user ?? null);
        setAuthReady(true);
      });
      subscription = data.subscription;
    } catch (e) {
      console.error("Navbar auth error:", e);
      setAuthReady(true);
    }

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

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
    <nav className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 backdrop-blur-xl font-['Plus_Jakarta_Sans']">
      <div className="flex items-center justify-between px-4 sm:px-8 py-4 max-w-7xl mx-auto">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group flex-shrink-0 animate-bounce-gentle">
          <div className="p-2.5 bg-[var(--accent-pink)] rounded-2xl shadow-[0px_8px_16px_rgba(254,132,177,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4)] transition-transform group-hover:scale-110">
            <BrainCircuit className="w-6 h-6 text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight text-[var(--text-primary)] group-hover:text-[var(--accent-pink-dark)] transition-colors">
            AuraPrep
          </span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden lg:flex items-center gap-2">
          {getNavLinks(language).map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link key={link.href} href={link.href}
                className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all ${
                  isActive ? "bg-[var(--bg-card)] shadow-[var(--shadow-clay-inner)] text-[var(--text-primary)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-pink-dark)] hover:bg-white/50"
                }`}>
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Area */}
        <div className="hidden lg:flex items-center gap-3 min-w-[180px] justify-end">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-card)] hover:bg-[var(--bg-elevated)] transition-colors text-sm font-bold shadow-sm"
            title="Switch Language"
          >
            <span className={language === "en" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>EN</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className={language === "hi" ? "text-[var(--text-primary)] font-extrabold" : "text-[var(--text-muted)]"}>अ</span>
          </button>

          {authReady && (
            user ? (
              <div className="relative" ref={dropdownRef}>
                <button onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-3 bg-[var(--bg-card)] border border-[var(--border-subtle)] shadow-sm text-[var(--text-primary)] px-2 py-1.5 rounded-full font-bold text-sm transition-all hover:shadow-[var(--shadow-clay-outer)]">
                  <div className="w-8 h-8 rounded-full bg-[var(--accent-blue)] flex items-center justify-center text-white text-xs font-bold flex-shrink-0 shadow-inner">
                    {avatarLetter}
                  </div>
                  <span className="max-w-[100px] truncate">{displayName}</span>
                  <ChevronDown className={`w-4 h-4 mr-2 text-[var(--text-muted)] transition-transform duration-200 ${profileOpen ? "rotate-180" : ""}`} />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-3 w-56 bg-[var(--bg-card)] border border-[var(--border-subtle)] rounded-3xl shadow-[0px_20px_40px_rgba(44,47,48,0.1)] overflow-hidden z-50 animate-pop-in origin-top-right">
                    <div className="px-5 py-4 bg-[var(--bg-elevated)]/50">
                      <p className="text-xs text-[var(--text-muted)] font-bold mb-1">{t('nav.signedInAs', language)}</p>
                      <p className="text-sm text-[var(--text-primary)] font-extrabold truncate">{user.email}</p>
                    </div>
                    <div className="p-2 space-y-1">
                      <Link href="/dashboard" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--accent-blue-dark)] hover:bg-[var(--accent-blue)]/10 text-sm font-bold transition-all">
                        <LayoutDashboard className="w-5 h-5 text-[var(--accent-blue)]" /> {t('nav.dashboard', language)}
                      </Link>
                      <Link href="/profile" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--accent-pink-dark)] hover:bg-[var(--accent-pink)]/10 text-sm font-bold transition-all">
                        <User className="w-5 h-5 text-[var(--accent-pink)]" /> {t('nav.myProfile', language)}
                      </Link>
                      <Link href="/dashboard/analytics" onClick={() => setProfileOpen(false)}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-[var(--text-secondary)] hover:text-[var(--accent-yellow-dark)] hover:bg-[var(--accent-yellow)]/10 text-sm font-bold transition-all">
                        <BarChart3 className="w-5 h-5 text-[var(--accent-yellow)]" /> {t('nav.analytics', language)}
                      </Link>
                    </div>
                    <div className="p-2 border-t border-[var(--border-subtle)]">
                      <button onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-500 hover:text-red-700 hover:bg-red-50 text-sm font-bold transition-all">
                        <LogOut className="w-5 h-5" /> {t('common.signOut', language)}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login"
                className="clay-button-pink px-6 py-2.5 text-sm">
                {t('common.signIn', language)}
              </Link>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <div className="lg:hidden flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border border-[var(--border-subtle)] bg-[var(--bg-card)] text-xs font-bold shadow-sm"
          >
            <span className={language === "en" ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"}>EN</span>
            <span className="text-[var(--border-subtle)]">/</span>
            <span className={language === "hi" ? "text-[var(--text-primary)] font-extrabold" : "text-[var(--text-muted)]"}>अ</span>
          </button>
          <button onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition">
            {mobileOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-[var(--border-subtle)] bg-[var(--bg-primary)]/95 backdrop-blur-xl absolute w-full animate-pop-in origin-top">
          <div className="px-4 py-6 space-y-2">
            {getNavLinks(language).map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href} onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-base transition-all ${
                    isActive ? "bg-[var(--bg-card)] shadow-[var(--shadow-clay-inner)] text-[var(--accent-pink-dark)]" : "text-[var(--text-secondary)] hover:text-[var(--accent-pink)] hover:bg-white/50"
                  }`}>
                  <div className={`p-2 rounded-xl bg-var(--accent-${link.color})/10 text-var(--accent-${link.color})`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-4 mt-4 border-t border-[var(--border-subtle)] space-y-2">
              {user ? (
                <>
                  <div className="flex items-center gap-4 px-5 py-4 bg-[var(--bg-card)] rounded-3xl shadow-sm mb-4 border border-[var(--border-subtle)]">
                    <div className="w-12 h-12 rounded-full bg-[var(--accent-blue)] flex items-center justify-center font-bold text-white text-lg shadow-inner">
                      {avatarLetter}
                    </div>
                    <div>
                      <p className="text-[var(--text-primary)] font-extrabold text-base">{displayName}</p>
                      <p className="text-[var(--text-muted)] font-medium text-sm truncate max-w-[200px]">{user.email}</p>
                    </div>
                  </div>
                  <Link href="/dashboard" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--accent-blue)]/10 font-bold text-base transition-all">
                    <LayoutDashboard className="w-6 h-6 text-[var(--accent-blue)]" /> {t('nav.dashboard', language)}
                  </Link>
                  <Link href="/profile" onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-4 px-5 py-4 rounded-2xl text-[var(--text-secondary)] hover:bg-[var(--accent-pink)]/10 font-bold text-base transition-all">
                    <User className="w-6 h-6 text-[var(--accent-pink)]" /> {t('nav.myProfile', language)}
                  </Link>
                  <button onClick={() => { setMobileOpen(false); handleLogout(); }}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-red-500 hover:bg-red-50 font-bold text-base transition-all">
                    <LogOut className="w-6 h-6" /> {t('common.signOut', language)}
                  </button>
                </>
              ) : (
                <Link href="/login" onClick={() => setMobileOpen(false)}
                  className="clay-button-pink w-full py-4 text-base flex justify-center mt-4">
                  {t('common.signIn', language)}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
