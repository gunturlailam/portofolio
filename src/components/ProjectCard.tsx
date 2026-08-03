import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight, CalendarDays } from "lucide-react";

export interface Projek {
  id: string;
  judul: string;
  deskripsi: string;
  gambar: string | null;
  link_github: string | null;
  tanggal_selesai: string | null;
  kategori: string;
  slug: string;
}

/* Ikon GitHub inline — lucide-react sudah menghapus ikon brand, jadi pakai SVG resmi. */
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

// Palette per kategori (string literal lengkap → aman dari purge Tailwind).
export const CAT_STYLE: Record<
  string,
  { text: string; dot: string; hoverText: string; border: string; glow: string }
> = {
  Web: {
    text: "text-primary",
    dot: "bg-primary",
    hoverText: "group-hover:text-primary",
    border: "group-hover:border-primary/50",
    glow: "group-hover:shadow-primary/25",
  },
  Mobile: {
    text: "text-secondary",
    dot: "bg-secondary",
    hoverText: "group-hover:text-secondary",
    border: "group-hover:border-secondary/50",
    glow: "group-hover:shadow-secondary/25",
  },
  Design: {
    text: "text-rose-500",
    dot: "bg-rose-500",
    hoverText: "group-hover:text-rose-500",
    border: "group-hover:border-rose-500/50",
    glow: "group-hover:shadow-rose-500/25",
  },
};

const catOf = (k: string) =>
  CAT_STYLE[k] ?? {
    text: "text-gray-500",
    dot: "bg-gray-400",
    hoverText: "group-hover:text-gray-500",
    border: "group-hover:border-gray-400/50",
    glow: "group-hover:shadow-gray-500/20",
  };

const fmtDate = (d: string | null) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        month: "short",
        year: "numeric",
      })
    : "—";

export default function ProjectCard({
  projek,
  index,
}: {
  projek: Projek;
  index: number;
}) {
  const c = catOf(projek.kategori);

  return (
    <motion.div
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.08,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
      whileHover={{ y: -6 }}
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border border-gray-200/70 bg-white/70 shadow-sm backdrop-blur transition-all duration-300 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03] ${c.border} ${c.glow}`}
    >
      {/* stretched link: seluruh kartu bisa diklik ke detail (kecuali tombol github) */}
      <Link
        href={`/projek/${projek.slug}`}
        aria-label={`Lihat proyek ${projek.judul}`}
        className="after:absolute after:inset-0 after:z-10 after:rounded-3xl after:content-['']"
      />

      {/* gambar */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 dark:from-white/5 dark:to-white/10">
        <img
          src={projek.gambar ?? ""}
          alt={projek.judul}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.style.display = "none";
          }}
          className="h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-50 transition-opacity duration-300 group-hover:opacity-90" />

        {/* chip kategori */}
        <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/40 bg-white/85 px-2.5 py-1 text-[11px] font-semibold backdrop-blur dark:border-white/10 dark:bg-black/55">
          <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
          <span className={c.text}>{projek.kategori}</span>
        </span>

        {/* reveal saat hover */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 items-center justify-between opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="text-sm font-semibold text-white">Lihat proyek</span>
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-900">
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>

      {/* konten */}
      <div className="relative flex flex-1 flex-col p-5">
        {/* nomor editorial watermark */}
        <span className="pointer-events-none absolute right-4 top-2 select-none text-5xl font-black leading-none text-gray-100 dark:text-white/[0.04]">
          {String(index + 1).padStart(2, "0")}
        </span>

        <h3
          className={`relative text-lg font-bold tracking-tight transition-colors ${c.hoverText}`}
        >
          {projek.judul}
        </h3>
        <p className="relative mt-1.5 line-clamp-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
          {projek.deskripsi}
        </p>

        <div className="relative mt-auto flex items-center justify-between border-t border-gray-100 pt-3.5 dark:border-white/5">
          <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-400">
            <CalendarDays className="h-3.5 w-3.5" />
            {fmtDate(projek.tanggal_selesai)}
          </span>
          {projek.link_github && (
            <a
              href={projek.link_github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Repository GitHub"
              onClick={(e) => e.stopPropagation()}
              className="relative z-20 flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 transition-all hover:scale-110 hover:border-primary/50 hover:text-primary dark:border-white/10 dark:text-gray-400"
            >
              <GithubIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
