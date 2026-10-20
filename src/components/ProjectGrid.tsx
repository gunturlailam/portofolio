"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Layers, RotateCcw, ArrowRight, SearchX } from "lucide-react";
import { supabase, envReady } from "@/lib/supabaseClient";
import ProjectCard, { type Projek } from "./ProjectCard";
import { useLang } from "@/lib/i18n";

export const FALLBACK: Projek[] = [
  {
    id: "f1",
    judul: "TaskFlow PHP Native",
    deskripsi:
      "Aplikasi manajemen tugas berbasis web dengan PHP Native & MySQL, fitur CRUD lengkap dan autentikasi pengguna.",
    gambar:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=800",
    link_github: "https://github.com",
    tanggal_selesai: "2023-10-15",
    kategori: "Web",
    slug: "taskflow-php-native",
  },
  {
    id: "f2",
    judul: "E-Commerce Mobile App",
    deskripsi:
      "Aplikasi mobile e-commerce dengan React Native & Firebase, terintegrasi payment gateway.",
    gambar:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&q=80&w=800",
    link_github: "https://github.com",
    tanggal_selesai: "2023-11-20",
    kategori: "Mobile",
    slug: "ecommerce-mobile-app",
  },
  {
    id: "f3",
    judul: "Brand Identity Startup",
    deskripsi:
      "Identitas visual lengkap: logo, palet warna, tipografi, dan panduan merek untuk startup teknologi.",
    gambar:
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?auto=format&fit=crop&q=80&w=800",
    link_github: null,
    tanggal_selesai: "2023-12-05",
    kategori: "Design",
    slug: "brand-identity-startup",
  },
  {
    id: "f4",
    judul: "Dashboard Analytics Next.js",
    deskripsi:
      "Dashboard analitik real-time dengan Next.js 14, Tailwind, dan Recharts untuk visualisasi interaktif.",
    gambar:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    link_github: "https://github.com",
    tanggal_selesai: "2024-01-10",
    kategori: "Web",
    slug: "dashboard-analytics-nextjs",
  },
  {
    id: "f5",
    judul: "UI/UX Redesign Fintech",
    deskripsi:
      "Redesain antarmuka aplikasi fintech untuk meningkatkan UX, aksesibilitas, dan retensi pengguna.",
    gambar:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&q=80&w=800",
    link_github: "https://github.com",
    tanggal_selesai: "2024-03-01",
    kategori: "Design",
    slug: "ui-ux-redesign-fintech",
  },
  {
    id: "f6",
    judul: "Chat App Realtime",
    deskripsi:
      "Aplikasi pesan instan realtime dengan WebSocket, notifikasi push, dan enkripsi end-to-end sederhana.",
    gambar:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?auto=format&fit=crop&q=80&w=800",
    link_github: "https://github.com",
    tanggal_selesai: "2024-04-12",
    kategori: "Mobile",
    slug: "chat-app-realtime",
  },
];

const uniqueCats = (rows: Projek[]) =>
  Array.from(new Set(rows.map((r) => r.kategori)));

const catKeyMap: Record<string, "categoryWeb" | "categoryMobile" | "categoryDesign"> =
  { Web: "categoryWeb", Mobile: "categoryMobile", Design: "categoryDesign" };

interface Props {
  pageSize?: number;
  showViewAll?: boolean;
  title?: string;
  subtitle?: string;
}

export default function ProjectGrid({
  pageSize = 6,
  showViewAll = true,
  title = "Karya Pilihan",
  subtitle = "Proyek yang saya bangun — dari fondasi backend sampai polesan antarmuka.",
}: Props) {
  const { t } = useLang();
  const trCat = (c: string) => (catKeyMap[c] ? t(catKeyMap[c]) : c);
  const ALL = t("all");
  const [items, setItems] = useState<Projek[]>([]);
  const [cats, setCats] = useState<string[]>([]);
  const [active, setActive] = useState<string>("Semua");
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [usingFallback, setUsingFallback] = useState(false);

  const filteredFallback = useMemo(
    () =>
      active === "Semua"
        ? FALLBACK
        : FALLBACK.filter((p) => p.kategori === active),
    [active],
  );

  // Kategori pills: ambil 1x di mount (fallback kalau env kosong / tabel belum ada).
  useEffect(() => {
    let alive = true;
    (async () => {
      if (!envReady) {
        if (alive) setCats(uniqueCats(FALLBACK));
        return;
      }
      const { data, error } = await supabase.from("projek").select("kategori");
      if (!alive) return;
      if (error || !data) {
        setCats(uniqueCats(FALLBACK));
        return;
      }
      const list = Array.from(
        new Set(data.map((r: { kategori: string }) => r.kategori)),
      );
      setCats(list.length ? list : []);
    })();
    return () => {
      alive = false;
    };
  }, []);

  // Muat halaman pertama (reset) tiap kategori berubah.
  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setItems([]);

      if (!envReady) {
        const list = filteredFallback;
        if (alive) {
          setUsingFallback(true);
          setItems(list.slice(0, pageSize));
          setHasMore(list.length > pageSize);
        }
        setLoading(false);
        return;
      }

      let q = supabase
        .from("projek")
        .select("*")
        .order("tanggal_selesai", { ascending: false })
        .range(0, pageSize - 1);
      if (active !== "Semua") q = q.eq("kategori", active);

      const { data, error } = await q;
      if (!alive) return;

      if (error || !data) {
        // tabel belum ada / error → pakai fallback biar tampilan tetap hidup
        const list = filteredFallback;
        setUsingFallback(true);
        setItems(list.slice(0, pageSize));
        setHasMore(list.length > pageSize);
      } else {
        setUsingFallback(false);
        setItems(data as Projek[]);
        setHasMore(data.length === pageSize);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const loadMore = async () => {
    if (loadingMore || !hasMore) return;

    if (usingFallback) {
      const next = Math.min(items.length + pageSize, filteredFallback.length);
      setItems(filteredFallback.slice(0, next));
      setHasMore(next < filteredFallback.length);
      return;
    }

    setLoadingMore(true);
    const from = items.length;
    let q = supabase
      .from("projek")
      .select("*")
      .order("tanggal_selesai", { ascending: false })
      .range(from, from + pageSize - 1);
    if (active !== "Semua") q = q.eq("kategori", active);

    const { data } = await q;
    if (data) {
      setItems((prev) => [...prev, ...(data as Projek[])]);
      setHasMore(data.length === pageSize);
    }
    setLoadingMore(false);
  };

  const pills = ["Semua", ...cats];

  return (
    <section
      id="work"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* ambient: diagonal hairlines + mask (variasi dari section lain) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,#80808010_0,#80808010_1px,transparent_1px,transparent_14px)] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_30%,#000_25%,transparent_80%)]" />
        <div className="absolute -left-20 top-1/3 h-72 w-72 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute -right-20 bottom-1/4 h-72 w-72 rounded-full bg-rose-500/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* header asimetris: judul kiri, filter kanan */}
        <div className="mb-12 flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <motion.div
            className="max-w-xl"
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-4 flex items-center gap-3">
              <span className="h-px w-10 bg-gradient-to-r from-primary to-secondary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                {t("eyebrowWork")}
              </span>
            </div>
            <h2 className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
              {title.split(" ").slice(0, -1).join(" ")}{" "}
              <span className="italic text-gray-400 dark:text-gray-500">
                {title.split(" ").slice(-1)}
              </span>
            </h2>
            <p className="mt-4 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
              {subtitle}
            </p>
          </motion.div>

          {/* filter pills dengan indikator geser (layoutId) */}
          <motion.div
            className="flex flex-wrap gap-2"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {pills.map((c) => {
              const isActive = active === c;
              return (
                <button
                  key={c}
                  onClick={() => setActive(c)}
                  className="relative rounded-full px-4 py-2 text-sm font-medium transition-colors"
                >
                  {isActive && (
                    <motion.span
                      layoutId="projFilter"
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                  <span
                    className={`relative z-10 ${isActive ? "text-white" : "text-gray-600 hover:text-foreground dark:text-gray-300"}`}
                  >
                    {c === "Semua" ? ALL : trCat(c)}
                  </span>
                </button>
              );
            })}
          </motion.div>
        </div>

        {/* counter */}
        <div className="mb-6 flex items-center gap-2 font-mono text-xs text-gray-400">
          <Layers className="h-3.5 w-3.5 text-secondary" />
          {loading
            ? t("loading")
            : `${items.length} ${t("shownCount")}`}
        </div>

        {/* SKELETON */}
        {loading && (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: pageSize }).map((_, i) => (
              <div
                key={i}
                className="flex flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white/60 dark:border-white/10 dark:bg-white/[0.03]"
              >
                <div className="aspect-[16/10] animate-pulse bg-gray-200 dark:bg-white/10" />
                <div className="space-y-3 p-5">
                  <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-full animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                  <div className="h-3 w-4/5 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && items.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-gray-300 bg-white/50 py-20 text-center dark:border-white/10 dark:bg-white/[0.02]"
          >
            <span className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100 text-gray-400 dark:bg-white/5">
              <SearchX className="h-7 w-7" />
            </span>
            <p className="text-lg font-semibold text-foreground">
              {t("noProjects")}
            </p>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              {t("emptyHint")}
            </p>
            <button
              onClick={() => setActive("Semua")}
              className="mt-6 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              <RotateCcw className="h-4 w-4" />
              {t("resetFilter")}
            </button>
          </motion.div>
        )}

        {/* GRID */}
        {!loading && items.length > 0 && (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((p, i) => (
                <ProjectCard key={p.id} projek={p} index={i} />
              ))}
            </div>

            {/* load more */}
            {hasMore && (
              <div className="mt-12 flex justify-center">
                <button
                  onClick={loadMore}
                  disabled={loadingMore}
                  className="group inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:border-primary hover:text-primary disabled:opacity-60 dark:border-white/20 dark:text-gray-200 dark:hover:border-primary dark:hover:text-primary"
                >
                  {loadingMore ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                      {t("loading")}
                    </>
                  ) : (
                    <>
                      {t("loadMore")}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </div>
            )}
          </>
        )}

        {/* lihat semua */}
        {showViewAll && !loading && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-14 text-center"
          >
            <Link
              href="/projek"
              className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-secondary"
            >
              {t("viewAll")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1.5" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
