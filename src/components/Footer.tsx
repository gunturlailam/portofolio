"use client";
import Link from "next/link";
import { ArrowUp } from "lucide-react";
import SocialIcons from "./SocialIcons";

const navLinks = [
  { label: "Beranda", href: "/" },
  { label: "Work", href: "/#work" },
  { label: "About", href: "/#about" },
  { label: "Projek", href: "/projek" },
  { label: "Sertifikat", href: "/sertifikat" },
  { label: "Contact", href: "/#contact" },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-gray-200/70 bg-white/60 backdrop-blur dark:border-white/10 dark:bg-white/[0.02]">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link href="/" className="text-xl font-bold tracking-tight">
              Guntur<span className="text-primary">.</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-gray-500 dark:text-gray-400">
              Membangun produk digital yang cepat, indah, dan fungsional —
              langsung dari Padang.
            </p>
          </div>

          <div>
            <h4 className="font-mono text-xs uppercase tracking-widest text-gray-400">
              Navigasi
            </h4>
            <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 text-sm">
              {navLinks.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    className="group inline-flex items-center text-gray-600 transition-colors hover:text-primary dark:text-gray-300"
                  >
                    <span className="mr-0 h-px w-0 bg-primary transition-all duration-300 group-hover:mr-1.5 group-hover:w-3" />
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-5">
            <h4 className="font-mono text-xs uppercase tracking-widest text-gray-400">
              Terhubung
            </h4>
            <SocialIcons />
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold text-gray-600 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/15 dark:text-gray-300"
            >
              Kembali ke atas
              <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
            </button>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-gray-200/70 pt-6 font-mono text-[11px] text-gray-400 dark:border-white/10 md:flex-row">
          <p>
            © {new Date().getFullYear()} Guntur Lailam Yuro. All rights
            reserved.
          </p>
          <p>
            Built with <span className="text-primary">Next.js</span> ·{" "}
            <span className="text-secondary">Supabase</span> · Tailwind · Framer
            Motion
          </p>
        </div>
      </div>
    </footer>
  );
}
