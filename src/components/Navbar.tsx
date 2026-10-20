"use client";
import { useEffect, useRef, useState } from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Moon, Sun, Menu, X, Globe } from "lucide-react";
import Link from "next/link";
import { useLang, type Locale } from "@/lib/i18n";

const menuKeys = [
  { key: "about", href: "#about" },
  { key: "education", href: "#education" },
  { key: "experience", href: "#experience" },
  { key: "projects", href: "#work" },
  { key: "certificates", href: "#certificates" },
  { key: "contact", href: "#contact" },
] as const;

export default function Navbar() {
  const { theme, setTheme } = useTheme();
  const { t, locale, setLocale } = useLang();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [active, setActive] = useState<string>("");
  const langBtnRef = useRef<HTMLDivElement>(null);
  const [langOpen, setLangOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight menu sesuai section yang sedang terlihat
  useEffect(() => {
    const ids = [
      "about",
      "education",
      "experience",
      "work",
      "certificates",
      "contact",
    ];
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => !!el);
    if (!els.length) return;
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(e.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  // Tutup dropdown bahasa saat klik di luar
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (langBtnRef.current && !langBtnRef.current.contains(e.target as Node))
        setLangOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const hrefToKey = (href: string) => href.replace("#", "");

  const pillClass = (href: string) =>
    `relative rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
      active === hrefToKey(href)
        ? "text-primary"
        : "text-gray-600 hover:text-foreground dark:text-gray-300 dark:hover:text-white"
    }`;

  const LangSwitcher = () => (
    <div ref={langBtnRef} className="relative">
      <button
        onClick={() => setLangOpen((v) => !v)}
        aria-label={t("changeLanguage")}
        aria-expanded={langOpen}
        className="flex h-9 items-center gap-1.5 rounded-full border border-gray-200 bg-white/60 px-2.5 text-xs font-bold uppercase tracking-wide text-gray-600 transition-all hover:scale-105 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
      >
        <Globe className="h-3.5 w-3.5" />
        {locale}
        <motion.span
          animate={{ rotate: langOpen ? 180 : 0 }}
          className="text-[9px] leading-none opacity-60"
        >
          ▾
        </motion.span>
      </button>
      <AnimatePresence>
        {langOpen && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.18 }}
            className="absolute right-0 top-full z-50 mt-2 w-44 overflow-hidden rounded-2xl border border-gray-200/70 bg-white/90 p-1.5 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-[#111113]/90"
          >
            {(
              [
                { code: "id", label: "🇮🇩 Bahasa Indonesia" },
                { code: "en", label: "🇬🇧 English" },
              ] as { code: Locale; label: string }[]
            ).map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLocale(l.code);
                  setLangOpen(false);
                }}
                className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs font-semibold transition-colors ${
                  locale === l.code
                    ? "bg-primary/10 text-primary"
                    : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/10"
                }`}
              >
                {l.label}
                {locale === l.code && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-primary" />
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  const ThemeButton = () => (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label={theme === "dark" ? t("switchToLight") : t("switchToDark")}
      className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-white/60 text-gray-600 transition-all hover:scale-110 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
    >
      <AnimatePresence mode="wait" initial={false}>
        {mounted && theme === "dark" ? (
          <motion.span
            key="sun"
            initial={{ y: 12, opacity: 0, rotate: -45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: -12, opacity: 0, rotate: 45 }}
            transition={{ duration: 0.2 }}
          >
            <Sun className="h-4 w-4" />
          </motion.span>
        ) : (
          <motion.span
            key="moon"
            initial={{ y: -12, opacity: 0, rotate: 45 }}
            animate={{ y: 0, opacity: 1, rotate: 0 }}
            exit={{ y: 12, opacity: 0, rotate: -45 }}
            transition={{ duration: 0.2 }}
          >
            <Moon className="h-4 w-4" />
          </motion.span>
        )}
      </AnimatePresence>
    </button>
  );

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
          className="group flex items-center font-display text-lg font-extrabold tracking-tight"
        >
          Guntur
          <span className="ml-0.5 inline-block h-1.5 w-1.5 rounded-full bg-gradient-to-br from-primary to-secondary transition-transform duration-300 group-hover:scale-150" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden items-center gap-1 md:flex">
          {menuKeys.map((m) => (
            <a key={m.key} href={m.href} className={pillClass(m.href)}>
              {active === hrefToKey(m.href) && (
                <motion.span
                  layoutId="nav-active-pill"
                  className="absolute inset-0 rounded-full bg-primary/10"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative">{t(m.key)}</span>
            </a>
          ))}
          <div className="ml-3 flex items-center gap-2">
            <LangSwitcher />
            <ThemeButton />
          </div>
        </div>

        {/* Mobile toggle */}
        <div className="flex items-center gap-2 md:hidden">
          <LangSwitcher />
          <ThemeButton />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? t("closeMenu") : t("openMenu")}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white/60 text-gray-600 dark:border-white/10 dark:bg-white/5 dark:text-gray-300"
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={mobileOpen ? "x" : "menu"}
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.15 }}
              >
                {mobileOpen ? (
                  <X className="h-4 w-4" />
                ) : (
                  <Menu className="h-4 w-4" />
                )}
              </motion.span>
            </AnimatePresence>
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
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="overflow-hidden border-b border-gray-200/60 bg-white/90 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/90 md:hidden"
          >
            <div className="flex flex-col gap-1 px-6 py-4">
              {menuKeys.map((m, i) => (
                <motion.a
                  key={m.key}
                  href={m.href}
                  onClick={() => setMobileOpen(false)}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 + i * 0.05 }}
                  className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-primary/10 hover:text-primary ${
                    active === hrefToKey(m.href)
                      ? "bg-primary/10 text-primary"
                      : "text-gray-600 dark:text-gray-300"
                  }`}
                >
                  {t(m.key)}
                </motion.a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
