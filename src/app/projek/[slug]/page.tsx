"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowRight,
  CalendarDays,
  Tags,
  Link2,
  Layers,
} from "lucide-react";
import { supabase, envReady } from "@/lib/supabaseClient";
import { FALLBACK } from "@/components/ProjectGrid";
import { CAT_STYLE, type Projek } from "@/components/ProjectCard";

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

const catOf = (k: string) =>
  CAT_STYLE[k] ?? {
    text: "text-gray-500",
    dot: "bg-gray-400",
    hoverText: "",
    border: "",
    glow: "",
  };

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

export default function ProjekDetailPage() {
  const params = useParams();
  const slug = params?.slug as string;

  const [projek, setProjek] = useState<Projek | null>(null);
  const [list, setList] = useState<Projek[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setNotFound(false);

      if (!envReady) {
        const found = FALLBACK.find((p) => p.slug === slug) ?? null;
        if (alive) {
          setProjek(found);
          setList(FALLBACK);
          setNotFound(!found);
          setLoading(false);
        }
        return;
      }

      const [detail, all] = await Promise.all([
        supabase.from("projek").select("*").eq("slug", slug).maybeSingle(),
        supabase
          .from("projek")
          .select("id,judul,slug,kategori")
          .order("tanggal_selesai", { ascending: false }),
      ]);

      if (!alive) return;

      if (detail.error || !detail.data) {
        // tabel belum ada → coba fallback; kalau tetap nggak ada → not found
        const found = FALLBACK.find((p) => p.slug === slug) ?? null;
        setProjek(found);
        setList(found ? FALLBACK : []);
        setNotFound(!found);
      } else {
        setProjek(detail.data as Projek);
        setList((all.data as Projek[]) ?? []);
      }
      setLoading(false);
    })();
    return () => {
      alive = false;
    };
  }, [slug]);

  const idx = list.findIndex((p) => p.slug === slug);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx >= 0 && idx < list.length - 1 ? list[idx + 1] : null;
  const related = list.filter((p) => p.slug !== slug).slice(0, 3);
  const c = catOf(projek?.kategori ?? "");

  return (
    <main className="relative min-h-screen overflow-hidden pt-28 pb-24">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:48px_48px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-24 right-0 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 flex items-center gap-2 font-mono text-xs text-gray-400"
        >
          <Link
            href="/projek"
            className="group inline-flex items-center gap-1.5 rounded-full border border-gray-200 px-3 py-1.5 transition-colors hover:border-primary/50 hover:text-primary dark:border-white/10"
          >
            <ArrowLeft className="h-3.5 w-3.5 transition-transform group-hover:-translate-x-0.5" />
            Semua Proyek
          </Link>
          <span>/</span>
          <span className="truncate text-foreground">
            {loading ? "…" : (projek?.judul ?? "—")}
          </span>
        </motion.nav>

        {/* SKELETON */}
        {loading && (
          <div className="space-y-8">
            <div className="h-5 w-24 animate-pulse rounded-full bg-gray-200 dark:bg-white/10" />
            <div className="h-12 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
            <div className="aspect-[21/9] w-full animate-pulse rounded-3xl bg-gray-200 dark:bg-white/10" />
          </div>
        )}

        {/* NOT FOUND */}
        {!loading && notFound && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center rounded-3xl border border-dashed border-gray-300 bg-white/50 py-24 text-center dark:border-white/10 dark:bg-white/[0.02]"
          >
            <span className="font-mono text-6xl font-black text-gray-200 dark:text-white/10">
              404
            </span>
            <p className="mt-4 text-lg font-semibold">Proyek tidak ditemukan</p>
            <p className="mt-1.5 max-w-sm text-sm text-gray-500 dark:text-gray-400">
              Slug{" "}
              <code className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-xs dark:bg-white/10">
                {slug}
              </code>{" "}
              tidak ada di database. Mungkin sudah dihapus atau tautannya salah.
            </p>
            <Link
              href="/projek"
              className="mt-7 inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-transform hover:-translate-y-0.5"
            >
              <ArrowLeft className="h-4 w-4" />
              Kembali ke Semua Proyek
            </Link>
          </motion.div>
        )}

        {/* DETAIL */}
        {!loading && !notFound && projek && (
          <>
            {/* header */}
            <motion.header
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-10 max-w-3xl"
            >
              <span
                className={`mb-5 inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white/70 px-3 py-1 text-xs font-semibold backdrop-blur dark:border-white/10 dark:bg-white/5 ${c.text}`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
                {projek.kategori}
              </span>
              <h1 className="text-4xl font-extrabold leading-[1.08] tracking-tight md:text-5xl">
                {projek.judul}
              </h1>
              <div className="mt-5 flex flex-wrap items-center gap-5 font-mono text-xs text-gray-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {fmtDate(projek.tanggal_selesai)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Link2 className="h-3.5 w-3.5" />
                  /projek/{projek.slug}
                </span>
              </div>
            </motion.header>

            {/* gambar hero */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              className="group relative mb-14 overflow-hidden rounded-3xl border border-gray-200/70 shadow-xl dark:border-white/10"
            >
              <div className="aspect-[21/9] w-full bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10">
                <img
                  src={projek.gambar ?? ""}
                  alt={projek.judul}
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-105"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            </motion.div>

            {/* body 2 kolom + sidebar sticky */}
            <div className="grid gap-12 lg:grid-cols-3">
              <motion.article
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="lg:col-span-2"
              >
                <h2 className="mb-5 text-2xl font-bold tracking-tight">
                  Tentang Proyek Ini
                </h2>
                <div className="space-y-5 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
                  {projek.deskripsi
                    .split("\n")
                    .filter(Boolean)
                    .map((par, i) => (
                      <p
                        key={i}
                        className={
                          i === 0
                            ? "border-l-2 border-primary/40 pl-5 text-base text-gray-700 dark:text-gray-300"
                            : ""
                        }
                      >
                        {par}
                      </p>
                    ))}
                </div>

                {projek.link_github && (
                  <a
                    href={projek.link_github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group mt-9 inline-flex items-center gap-2.5 rounded-full bg-gray-900 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:-translate-y-0.5 hover:shadow-xl dark:bg-white dark:text-gray-900"
                  >
                    <GithubIcon className="h-4 w-4" />
                    Lihat Source Code
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </a>
                )}
              </motion.article>

              {/* sidebar sticky */}
              <motion.aside
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.6 }}
                className="lg:sticky lg:top-24 lg:self-start"
              >
                <div className="rounded-3xl border border-gray-200/70 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03]">
                  <h3 className="mb-5 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400">
                    <Tags className="h-3.5 w-3.5 text-secondary" />
                    Detail Proyek
                  </h3>
                  <dl className="space-y-4 text-sm">
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-gray-500 dark:text-gray-400">
                        Kategori
                      </dt>
                      <dd className={`font-semibold ${c.text}`}>
                        {projek.kategori}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-gray-500 dark:text-gray-400">
                        Selesai
                      </dt>
                      <dd className="font-semibold text-foreground">
                        {fmtDate(projek.tanggal_selesai)}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <dt className="text-gray-500 dark:text-gray-400">Repo</dt>
                      <dd className="font-semibold text-foreground">
                        {projek.link_github ? (
                          <a
                            href={projek.link_github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 hover:text-primary"
                          >
                            <GithubIcon className="h-3.5 w-3.5" /> GitHub
                          </a>
                        ) : (
                          "Privat"
                        )}
                      </dd>
                    </div>
                  </dl>

                  {related.length > 0 && (
                    <div className="mt-7 border-t border-gray-100 pt-6 dark:border-white/5">
                      <h3 className="mb-4 flex items-center gap-2 font-mono text-xs uppercase tracking-widest text-gray-400">
                        <Layers className="h-3.5 w-3.5 text-secondary" />
                        Proyek Lain
                      </h3>
                      <ul className="space-y-2.5">
                        {related.map((r) => (
                          <li key={r.id}>
                            <Link
                              href={`/projek/${r.slug}`}
                              className="group flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 transition-all hover:border-gray-200 hover:bg-white/70 dark:hover:border-white/10 dark:hover:bg-white/[0.04]"
                            >
                              <span
                                className={`h-2 w-2 shrink-0 rounded-full ${catOf(r.kategori).dot}`}
                              />
                              <span className="truncate text-sm font-medium text-gray-700 transition-colors group-hover:text-foreground dark:text-gray-300">
                                {r.judul}
                              </span>
                              <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 text-gray-300 transition-transform group-hover:translate-x-1 group-hover:text-primary" />
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </motion.aside>
            </div>

            {/* prev / next */}
            <motion.nav
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.6 }}
              className="mt-20 grid gap-4 border-t border-gray-200 pt-10 dark:border-white/10 sm:grid-cols-2"
            >
              {prev ? (
                <Link
                  href={`/projek/${prev.slug}`}
                  className="group flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white/60 p-5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <ArrowLeft className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:-translate-x-1 group-hover:text-primary" />
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      Sebelumnya
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {prev.judul}
                    </p>
                  </div>
                </Link>
              ) : (
                <span className="hidden sm:block" />
              )}
              {next && (
                <Link
                  href={`/projek/${next.slug}`}
                  className="group flex items-center justify-end gap-4 rounded-2xl border border-gray-200/70 bg-white/60 p-5 text-right transition-all hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      Selanjutnya
                    </p>
                    <p className="truncate text-sm font-semibold text-foreground">
                      {next.judul}
                    </p>
                  </div>
                  <ArrowRight className="h-5 w-5 shrink-0 text-gray-400 transition-transform group-hover:translate-x-1 group-hover:text-secondary" />
                </Link>
              )}
            </motion.nav>
          </>
        )}
      </div>
    </main>
  );
}
