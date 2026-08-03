"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, FolderKanban, Terminal } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function NotFound() {
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />

      <section className="relative flex flex-1 items-center justify-center overflow-hidden px-6 pb-24 pt-36">
        {/* ambient */}
        <div className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_40%,transparent_100%)]" />
          <div className="absolute -top-24 left-1/4 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
          <div className="absolute -bottom-24 right-1/4 h-96 w-96 rounded-full bg-secondary/15 blur-[120px]" />
        </div>

        <div className="relative mx-auto max-w-3xl text-center">
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-500/10 px-4 py-1.5 font-mono text-[11px] uppercase tracking-widest text-rose-500"
          >
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-75" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-rose-500" />
            </span>
            Error 404 — Not Found
          </motion.p>

          {/* 4 [0] 4 — angka 0 diganti ring putus-putus berputar */}
          <div className="mt-8 flex select-none items-center justify-center gap-3 md:gap-5">
            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-[8rem] font-black leading-none tracking-tight text-foreground md:text-[12rem]"
            >
              4
            </motion.span>

            <motion.div
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative flex h-36 w-36 items-center justify-center md:h-52 md:w-52"
            >
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-[3px] border-dashed border-primary/60"
              >
                <span className="absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-secondary shadow-[0_0_12px_2px_rgba(6,182,212,0.7)]" />
              </motion.div>
              <motion.span
                animate={{ scale: [1, 1.15, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="h-9 w-9 rounded-full bg-gradient-to-br from-primary to-secondary shadow-lg shadow-primary/40 md:h-12 md:w-12"
              />
            </motion.div>

            <motion.span
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="text-[8rem] font-black leading-none tracking-tight text-foreground md:text-[12rem]"
            >
              4
            </motion.span>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-6 text-2xl font-extrabold tracking-tight md:text-3xl"
          >
            Halaman ini{" "}
            <span className="italic text-gray-400 dark:text-gray-500">
              nggak ketemu
            </span>
            .
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400"
          >
            Mungkin alamatnya salah ketik, atau halamannya udah dipindahkan.
            Daripada bingung, balik ke beranda aja.
          </motion.p>

          {/* terminal */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-10 max-w-lg overflow-hidden rounded-2xl border border-gray-200 bg-white/80 text-left shadow-xl backdrop-blur dark:border-white/10 dark:bg-[#0d0d10]/90"
          >
            <div className="flex items-center gap-2 border-b border-gray-200 bg-gray-50 px-4 py-3 dark:border-white/10 dark:bg-white/5">
              <span className="h-3 w-3 rounded-full bg-rose-500" />
              <span className="h-3 w-3 rounded-full bg-amber-400" />
              <span className="h-3 w-3 rounded-full bg-green-500" />
              <span className="ml-3 flex items-center gap-1.5 font-mono text-xs text-gray-400">
                <Terminal className="h-3.5 w-3.5" /> guntur — zsh
              </span>
            </div>
            <div className="space-y-2 px-5 py-4 font-mono text-[13px]">
              <p className="text-gray-500 dark:text-gray-400">
                <span className="text-secondary">$</span> curl -I{" "}
                <span className="text-foreground">{pathname}</span>
              </p>
              <p className="font-semibold text-rose-500">
                HTTP/2 404 Not Found
              </p>
              <p className="text-gray-400">
                The requested resource was not found on this server.
              </p>
              <p className="text-secondary">
                ${" "}
                <span className="inline-block h-4 w-2 translate-y-0.5 animate-pulse bg-secondary/80" />
              </p>
            </div>
          </motion.div>

          {/* aksi */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-4"
          >
            <Link
              href="/"
              className="group inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl"
            >
              <Home className="h-4 w-4" />
              Kembali ke Beranda
            </Link>
            <Link
              href="/projek"
              className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3.5 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary dark:border-white/20 dark:text-gray-200"
            >
              Lihat Proyek
              <FolderKanban className="h-4 w-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
