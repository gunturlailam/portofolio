"use client";
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X } from "lucide-react";
import Link from "next/link";

const menus = [
  { label: "Tentang", href: "#about" },
  { label: "Pendidikan", href: "#education" },
  { label: "Pengalaman", href: "#experience" },
  { label: "Projek", href: "#work" },
  { label: "Sertifikat", href: "#certificates" },
  { label: "Kontak", href: "#contact" },
];

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "border-b border-gray-200/60 bg-white/70 shadow-sm backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/70"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link
          href="/"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="group flex items-center text-lg font-extrabold tracking-tight"
        >
          Guntur
          <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-150" />
        </Link>
        {/* Desktop menu */}
        <div className="hidden items-center gap-8 md:flex">
          {menus.map((m) => (
            <a
              key={m.label}
              href={m.href}
              className="rounded-full px-3 py-1.5 text-sm font-medium text-gray-600 transition-all hover:bg-gray-900/5 hover:text-foreground dark:text-gray-300 dark:hover:bg-white/10 dark:hover:text-white"
            >
              {m.label}
            </a>
          ))}
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/60 text-gray-600 transition-all hover:scale-110 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
          </button>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-3 md:hidden">
          <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/60 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            {mounted &&
              (theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              ))}
          </button>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/60 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            {mobileOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-gray-200/60 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/90 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {menus.map((m) => (
                <a
                  key={m.label}
                  href={m.href}
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-primary/10 hover:text-primary dark:text-gray-300"
                >
                  {m.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
