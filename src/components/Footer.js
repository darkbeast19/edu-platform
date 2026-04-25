"use client";

import Link from "next/link";
import { BrainCircuit } from "lucide-react";

const FOOTER_LINKS = {
  Platform: [
    { label: "How It Works", href: "#" },
    { label: "Pricing", href: "#" },
    { label: "For Educators", href: "#" },
  ],
  Exams: [
    { label: "SSC CGL", href: "/exams" },
    { label: "Railway NTPC", href: "/exams" },
    { label: "Banking", href: "/exams" },
  ],
  Company: [
    { label: "About Us", href: "#" },
    { label: "Careers", href: "#" },
    { label: "Contact", href: "/support" },
  ],
};

export default function Footer() {
  return (
    <footer className="border-t border-[var(--border-subtle)] bg-[var(--bg-primary)] mt-auto font-['Plus_Jakarta_Sans']">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-6 group animate-bounce-gentle">
              <div className="p-2.5 bg-[var(--accent-pink)] rounded-2xl shadow-[0px_8px_16px_rgba(254,132,177,0.4),inset_2px_2px_4px_rgba(255,255,255,0.4)] group-hover:scale-110 transition-transform">
                <BrainCircuit className="w-6 h-6 text-white" />
              </div>
              <span className="font-extrabold text-xl text-[var(--text-primary)] group-hover:text-[var(--accent-pink-dark)] transition-colors">AuraPrep</span>
            </Link>
            <p className="text-[var(--text-secondary)] text-sm font-medium leading-relaxed max-w-xs">
              India's most engaging exam prep platform. Practice smarter, score higher.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-extrabold text-[var(--text-primary)] tracking-wider uppercase mb-6">
                {heading}
              </h4>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm font-bold text-[var(--text-secondary)] hover:text-[var(--accent-pink)] transition-colors inline-block hover:translate-x-1"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[var(--border-subtle)] flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs font-bold text-[var(--text-muted)]">
            © {new Date().getFullYear()} AuraPrep. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs font-bold text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
