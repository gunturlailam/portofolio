"use client";
import { motion, type Variants } from "framer-motion";
import { Download, ArrowRight, Code2, Palette } from "lucide-react";
import SocialIcons from "./SocialIcons";
import CountUp from "./CountUp";
import Link from "next/link";
import { useLang, Tts } from "@/lib/i18n";

const ease = [0.22, 1, 0.36, 1] as [number, number, number, number];

const container: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1, delayChildren: 0.15 } },
};

const item: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease } },
};

export default function Hero() {
  const { t } = useLang();

  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient background: grid + glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -30, 0] }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 30, 0] }}
          transition={{ duration: 16, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-[120px] dark:bg-secondary/20"
        />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        {/* Kiri: teks */}
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.div
            variants={item}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            {t("available")}
          </motion.div>

          <motion.p
            variants={item}
            className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-secondary"
          >
            {t("hello")}
          </motion.p>

          <motion.h1
            variants={item}
            className="font-display text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Guntur{" "}
            <span className="text-gradient">{t("role")}</span>
          </motion.h1>

          <motion.p
            variants={item}
            className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200"
          >
            Web Developer · UI/UX Enthusiast
          </motion.p>

          <motion.p
            variants={item}
            className="mt-4 max-w-md leading-relaxed text-gray-500 dark:text-gray-400"
          >
            <Tts
              id="Mahasiswa Sistem Informasi Universitas Jayanusa yang senang mengubah ide jadi website yang nyaman dipakai. Sehari-hari berkutat dengan PHP, MySQL, dan ekosistem JavaScript modern."
              en="Information Systems student at Jayanusa University who loves turning ideas into websites people enjoy using. Day-to-day I work with PHP, MySQL, and the modern JavaScript ecosystem."
            />
          </motion.p>

          {/* CTA */}
          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <Link
              href="/cv"
              download
              className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-secondary bg-[length:200%_auto] px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-500 hover:-translate-y-0.5 hover:bg-right hover:shadow-xl hover:shadow-primary/40"
            >
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              {t("downloadCv")}
            </Link>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/20 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary"
            >
              {t("hireMe")}
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Social icons */}
          <motion.div variants={item} className="mt-8">
            <SocialIcons />
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={item}
            className="mt-10 flex items-center gap-8 border-t border-gray-200 pt-6 dark:border-white/10"
          >
            <div>
              <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-display text-3xl font-extrabold text-transparent">
                <CountUp value={2} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {t("statYears")}
              </p>
            </div>
            <div>
              <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-display text-3xl font-extrabold text-transparent">
                <CountUp value={15} suffix="+" />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {t("statProjects")}
              </p>
            </div>
            <div>
              <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text font-display text-3xl font-extrabold text-transparent">
                <CountUp value={6} />
              </p>
              <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                {t("statStack")}
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Kanan: foto dengan glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3, ease }}
          whileHover={{ scale: 1.02 }}
          className="relative mx-auto flex items-center justify-center"
        >
          {/* Glow di belakang */}
          <div className="absolute h-56 w-56 rounded-full bg-gradient-to-tr from-primary to-secondary opacity-40 blur-[70px] md:h-72 md:w-72" />

          {/* Ring putus-putus berputar */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute h-64 w-64 rounded-full border-2 border-dashed border-primary/40 md:h-[22.5rem] md:w-[22.5rem]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 45, repeat: Infinity, ease: "linear" }}
            className="absolute h-72 w-72 rounded-full border border-secondary/25 md:h-[25rem] md:w-[25rem]"
          />

          {/* Foto profil */}
          <div className="relative h-56 w-56 overflow-hidden rounded-full bg-gradient-to-br from-primary to-secondary p-1.5 shadow-2xl shadow-primary/40 md:h-80 md:w-80">
            <img
              src="/assets/profile.jpg"
              alt="Guntur Lailam Yuro"
              className="h-full w-full rounded-full object-cover"
            />
          </div>

          {/* Floating badges */}
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="glass absolute -left-2 top-6 flex items-center gap-2 rounded-2xl px-3.5 py-2 shadow-lg dark:border-white/10 md:-left-6"
          >
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">{t("badgeWeb")}</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="glass absolute -right-2 bottom-8 flex items-center gap-2 rounded-2xl px-3.5 py-2 shadow-lg dark:border-white/10 md:-right-4"
          >
            <Palette className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold">{t("badgeDesign")}</span>
          </motion.div>
        </motion.div>
      </div>

      {/* Scroll hint */}
      <motion.a
        href="#about"
        aria-label={t("scrollDown")}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block"
      >
        <motion.span
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
          className="flex h-10 w-6 items-start justify-center rounded-full border-2 border-gray-300 p-1.5 dark:border-white/20"
        >
          <span className="h-2 w-1 rounded-full bg-primary" />
        </motion.span>
      </motion.a>
    </section>
  );
}
