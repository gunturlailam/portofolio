"use client";
import { motion } from "framer-motion";
import { Download, ArrowRight, Code2, Palette } from "lucide-react";
import SocialIcons from "./SocialIcons";

const stats = [
  { value: "2+", label: "Tahun Belajar" },
  { value: "15+", label: "Proyek Selesai" },
  { value: "6", label: "Teknologi Dikuasai" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 md:pt-40 md:pb-28">
      {/* Ambient background: grid + glow orbs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_60%,transparent_100%)]" />
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/20 blur-[120px] dark:bg-primary/25" />
        <div className="absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-secondary/20 blur-[120px] dark:bg-secondary/20" />
      </div>

      <div className="mx-auto grid max-w-6xl items-center gap-16 px-6 md:grid-cols-2">
        {/* Kiri: teks */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
            </span>
            Tersedia untuk proyek freelance
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-2 text-sm font-semibold uppercase tracking-[0.25em] text-secondary"
          >
            Halo, saya
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-5xl font-extrabold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl"
          >
            Guntur{" "}
            <span className="bg-gradient-to-r from-primary via-violet-400 to-secondary bg-clip-text text-transparent">
              Lailam
            </span>{" "}
            Yuro
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-4 text-lg font-semibold text-gray-700 dark:text-gray-200"
          >
            Web Developer & UI/UX Enthusiast dari Padang 🇮🇩
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-4 max-w-md leading-relaxed text-gray-500 dark:text-gray-400"
          >
            Mahasiswa Teknik Informatika Universitas Jayanusa yang bersemangat
            membangun produk digital yang cepat, indah, dan fungsional dengan
            PHP, MySQL, dan ekosistem JavaScript modern.
          </motion.p>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-8 flex flex-wrap items-center gap-4"
          >
            <a
              href="/assets/cv.pdf"
              download
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40"
            >
              <Download className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              Download CV
            </a>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/20 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary"
            >
              Hubungi Saya
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </a>
          </motion.div>

          {/* Social icons */}
          <div className="mt-8">
            <SocialIcons />
          </div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mt-10 flex items-center gap-8 border-t border-gray-200 pt-6 dark:border-white/10"
          >
            {stats.map((s) => (
              <div key={s.label}>
                <p className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-3xl font-extrabold text-transparent">
                  {s.value}
                </p>
                <p className="mt-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                  {s.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Kanan: foto dengan glow */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.3 }}
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
            className="absolute -left-2 top-6 flex items-center gap-2 rounded-2xl border border-gray-200/60 bg-white/80 px-3.5 py-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10 md:-left-6"
          >
            <Code2 className="h-4 w-4 text-primary" />
            <span className="text-xs font-semibold">Web Developer</span>
          </motion.div>
          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5,
            }}
            className="absolute -right-2 bottom-8 flex items-center gap-2 rounded-2xl border border-gray-200/60 bg-white/80 px-3.5 py-2 shadow-lg backdrop-blur dark:border-white/10 dark:bg-white/10 md:-right-4"
          >
            <Palette className="h-4 w-4 text-secondary" />
            <span className="text-xs font-semibold">UI/UX Design</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
