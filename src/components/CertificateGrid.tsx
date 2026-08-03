"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  CalendarDays,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { supabase, envReady } from "@/lib/supabaseClient";

interface Sertifikat {
  id: string;
  nama_sertifikat: string;
  penerbit: string;
  tanggal_terbit: string;
  file_gambar: string | null;
}

const FALLBACK_SERTIFIKAT: Sertifikat[] = [
  {
    id: "s1",
    nama_sertifikat: "Meta Front-End Developer Professional Certificate",
    penerbit: "Coursera",
    tanggal_terbit: "2024-01-05",
    file_gambar:
      "https://images.unsplash.com/photo-1589330694653-4d5c953671b9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s2",
    nama_sertifikat: "Google UX Design Professional Certificate",
    penerbit: "Coursera",
    tanggal_terbit: "2023-11-10",
    file_gambar:
      "https://images.unsplash.com/photo-1589330694653-4d5c953671b9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s3",
    nama_sertifikat: "AWS Certified Cloud Practitioner",
    penerbit: "Amazon Web Services",
    tanggal_terbit: "2023-09-20",
    file_gambar:
      "https://images.unsplash.com/photo-1589330694653-4d5c953671b9?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "s4",
    nama_sertifikat: "Fullstack Web Development Bootcamp",
    penerbit: "Dicoding Indonesia",
    tanggal_terbit: "2023-08-15",
    file_gambar:
      "https://images.unsplash.com/photo-1589330694653-4d5c953671b9?auto=format&fit=crop&q=80&w=800",
  },
];

const fmtDate = (d: string) =>
  new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

interface Props {
  limit?: number;
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
  cols?: string;
}

export default function CertificateGrid({
  limit = 4,
  showViewAll = true,
  title = "Sertifikat & Kredensial",
  subtitle = "Bukti belajar yang terverifikasi — diambil dari yang terbaru.",
  cols = "sm:grid-cols-2",
}: Props) {
  const [items, setItems] = useState<Sertifikat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      if (!envReady) {
        if (alive) {
          setItems(FALLBACK_SERTIFIKAT.slice(0, limit));
          setLoading(false);
        }
        return;
      }
      const { data, error } = await supabase
        .from("sertifikat")
        .select("*")
        .order("tanggal_terbit", { ascending: false })
        .limit(limit);
      if (!alive) return;
      if (error || !data) {
        setItems(FALLBACK_SERTIFIKAT.slice(0, limit));
      } else {
        setItems(data as Sertifikat[]);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [limit]);

  return (
    <section
      id="certificates"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* ambient: dots + glow emas & ungu (variasi) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#80808016_1px,transparent_0)] bg-[size:28px_28px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_40%,#000_25%,transparent_80%)]" />
        <div className="absolute -left-24 top-1/4 h-80 w-80 rounded-full bg-amber-400/10 blur-[120px]" />
        <div className="absolute -right-24 bottom-1/4 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* header asimetris */}
        <div className="mb-14 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-amber-400 to-primary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-amber-500">
                Penghargaan
              </span>
            </div>
            <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic text-gray-400 dark:text-gray-500">
                {title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </motion.div>

          {showViewAll && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.4 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Link
                href="/sertifikat"
                className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-6 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-amber-400 hover:text-amber-500 dark:border-white/20 dark:text-gray-200"
              >
                Lihat Semua
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </motion.div>
          )}
        </div>

        {/* SKELETON */}
        {loading && (
          <div className={`grid gap-6 ${cols}`}>
            {Array.from({ length: Math.min(limit, 4) }).map((_, i) => (
              <div
                key={i}
                className="rounded-2xl border border-gray-200/70 bg-white/60 p-4 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="aspect-[16/10] animate-pulse rounded-xl bg-gray-200 dark:bg-white/10" />
                <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                <div className="mt-2 h-3 w-1/2 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
              </div>
            ))}
          </div>
        )}

        {/* EMPTY */}
        {!loading && items.length === 0 && (
          <div className="flex flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-white/50 py-20 text-center dark:border-white/10 dark:bg-white/[0.02]">
            <Inbox className="mb-4 h-8 w-8 text-gray-300" />
            <p className="font-semibold">Belum ada sertifikat ditampilkan</p>
          </div>
        )}

        {/* GRID "scattered postcards" */}
        {!loading && items.length > 0 && (
          <div className={`grid gap-7 ${cols}`}>
            {items.map((s, i) => {
              const rot = i % 2 === 0 ? -1.5 : 1.5;
              return (
                <motion.article
                  key={s.id}
                  initial={{ opacity: 0, y: 34, rotate: rot }}
                  whileInView={{ opacity: 1, y: 0, rotate: rot }}
                  whileHover={{ rotate: 0, y: -8 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{
                    duration: 0.55,
                    delay: i * 0.08,
                    ease: [0.22, 1, 0.36, 1] as [
                      number,
                      number,
                      number,
                      number,
                    ] as [number, number, number, number],
                  }}
                  className="group relative rounded-2xl border border-gray-200/80 bg-white/80 p-4 shadow-sm backdrop-blur transition-shadow duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.04]"
                >
                  {/* frame dalam (gaya sertifikat) */}
                  <div className="pointer-events-none absolute inset-2 rounded-xl border border-gray-200/70 dark:border-white/10" />

                  {/* gambar */}
                  <div className="relative overflow-hidden rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10">
                    <div className="aspect-[16/10]">
                      <img
                        src={s.file_gambar ?? ""}
                        alt={s.nama_sertifikat}
                        loading="lazy"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                        className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-108"
                      />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-40 transition-opacity group-hover:opacity-70" />

                    {/* seal / stempel */}
                    <div className="absolute -bottom-4 right-4 flex h-14 w-14 rotate-12 items-center justify-center rounded-full border-2 border-dashed border-amber-400/80 bg-amber-50/95 shadow-md transition-transform duration-500 group-hover:rotate-[30deg] group-hover:scale-110 dark:bg-amber-400/15">
                      <Award className="h-6 w-6 text-amber-500" />
                    </div>
                  </div>

                  {/* konten */}
                  <div className="relative px-2 pb-2 pt-5">
                    <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-widest">
                      <span className="text-amber-500">
                        #SRT-{String(i + 1).padStart(3, "0")}
                      </span>
                      <span className="text-gray-400">
                        {new Date(s.tanggal_terbit).getFullYear()}
                      </span>
                    </div>
                    <h3 className="text-base font-bold leading-snug tracking-tight text-foreground transition-colors group-hover:text-amber-500">
                      {s.nama_sertifikat}
                    </h3>
                    <div className="mt-3 space-y-1.5 text-sm text-gray-500 dark:text-gray-400">
                      <p className="flex items-center gap-2">
                        <Building2 className="h-3.5 w-3.5 text-primary" />
                        {s.penerbit}
                      </p>
                      <p className="flex items-center gap-2">
                        <CalendarDays className="h-3.5 w-3.5 text-secondary" />
                        {fmtDate(s.tanggal_terbit)}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
