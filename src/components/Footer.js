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
    <footer className="border-t border-white/5 bg-[#0a0a0f] mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg">
                <BrainCircuit className="w-5 h-5 text-white" />
              </div>
              <span className="font-extrabold text-lg text-white">AuraPrep</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed max-w-xs">
              India's most engaging exam prep platform. Practice smarter, score higher.
            </p>
          </div>

          {/* Link Columns */}
          {Object.entries(FOOTER_LINKS).map(([heading, links]) => (
            <div key={heading}>
              <h4 className="text-sm font-bold text-white tracking-wider uppercase mb-4">
                {heading}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-500 hover:text-slate-200 transition-colors"
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
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-600">
            © {new Date().getFullYear()} AuraPrep. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition">
              Privacy Policy
            </Link>
            <Link href="#" className="text-xs text-slate-600 hover:text-slate-400 transition">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
