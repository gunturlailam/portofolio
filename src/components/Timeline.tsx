"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Briefcase, Users } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Pengalaman {
  id: string;
  judul: string;
  deskripsi: string;
  tipe: string;
  tanggal_mulai: string;
  tanggal_selesai: string | null;
}

const FALLBACK_PENGALAMAN: Pengalaman[] = [
  {
    id: "f1",
    judul: "Frontend Developer",
    deskripsi:
      "Mengembangkan antarmuka pengguna dengan React.js & Next.js, berkolaborasi erat dengan tim UI/UX untuk menghasilkan produk yang cepat dan rapi.",
    tipe: "Pekerjaan",
    tanggal_mulai: "2023-06-01",
    tanggal_selesai: null,
  },
  {
    id: "f2",
    judul: "Ketua Himpunan Mahasiswa Informatika",
    deskripsi:
      "Memimpin organisasi 100+ anggota, merencanakan dan mengeksekusi 5 event teknologi tingkat nasional dari nol hingga selesai.",
    tipe: "Organisasi",
    tanggal_mulai: "2022-09-01",
    tanggal_selesai: "2023-09-01",
  },
];

const fmt = (d: string | null) => {
  if (!d) return "Sekarang";
  return new Date(d).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });
};

export default function Timeline() {
  const [data, setData] = useState<Pengalaman[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: rows, error } = await supabase
          .from("pengalaman")
          .select("*")
          .order("tanggal_mulai", { ascending: false });
        if (!alive) return;
        if (error) throw error;
        setData(rows && rows.length ? rows : FALLBACK_PENGALAMAN);
      } catch {
        if (alive) setData(FALLBACK_PENGALAMAN);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  return (
    <section
      id="experience"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-0 bottom-0 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="mx-auto max-w-5xl px-6">
        <motion.div
          className="mb-14 text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="mb-4 flex items-center justify-center gap-3">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Rekam Jejak
            </span>
            <span className="h-px w-8 bg-gradient-to-l from-transparent to-secondary" />
          </div>
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            Pengalaman &{" "}
            <span className="text-gray-400 dark:text-gray-500">Organisasi</span>
          </h2>
        </motion.div>

        <div className="relative">
          {/* garis vertikal */}
          <div className="absolute left-4 top-0 h-full w-0.5 -translate-x-1/2 bg-gradient-to-b from-primary via-secondary to-transparent md:left-1/2" />

          <div className="space-y-10">
            {loading
              ? Array.from({ length: 2 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative pl-12 md:grid md:grid-cols-2 md:gap-x-12 md:pl-0"
                  >
                    <div className="h-32 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10 md:col-span-2" />
                  </div>
                ))
              : data.map((item, i) => {
                  const isLeft = i % 2 === 0;
                  const isOrg = item.tipe.toLowerCase().includes("organisasi");
                  const Icon = isOrg ? Users : Briefcase;

                  const card = (
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.5,
                        delay: i * 0.08,
                        ease: [0.22, 1, 0.36, 1] as [
                          number,
                          number,
                          number,
                          number,
                        ],
                      }}
                      className="group relative rounded-2xl border border-gray-200 bg-white/70 p-6 shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      <div className="mb-3 flex flex-wrap items-center gap-3">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${
                            isOrg
                              ? "bg-secondary/10 text-secondary"
                              : "bg-primary/10 text-primary"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {item.tipe}
                        </span>
                        <span className="font-mono text-xs text-gray-400">
                          {fmt(item.tanggal_mulai)} —{" "}
                          {fmt(item.tanggal_selesai)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-foreground">
                        {item.judul}
                      </h3>
                      <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-400">
                        {item.deskripsi}
                      </p>
                    </motion.div>
                  );

                  return (
                    <div
                      key={item.id}
                      className="relative pl-12 md:grid md:grid-cols-2 md:gap-x-12 md:pl-0"
                    >
                      {/* titik glowing */}
                      <motion.span
                        initial={{ scale: 0 }}
                        whileInView={{ scale: 1 }}
                        viewport={{ once: true }}
                        transition={{
                          delay: i * 0.08 + 0.2,
                          type: "spring",
                          stiffness: 260,
                        }}
                        className="absolute left-4 top-2 z-10 flex h-4 w-4 -translate-x-1/2 items-center justify-center md:left-1/2"
                      >
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-60" />
                        <span className="relative inline-flex h-3 w-3 rounded-full bg-gradient-to-br from-primary to-secondary shadow-[0_0_12px_2px_rgba(139,92,246,0.6)]" />
                      </motion.span>

                      {isLeft ? (
                        <>
                          <div className="md:pr-2">{card}</div>
                          <div className="hidden md:block" />
                        </>
                      ) : (
                        <>
                          <div className="hidden md:block" />
                          <div className="md:pl-2">{card}</div>
                        </>
                      )}
                    </div>
                  );
                })}
          </div>
        </div>
      </div>
    </section>
  );
}
