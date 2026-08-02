"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  GraduationCap,
  CalendarDays,
  Sparkles,
  Coffee,
  Target,
} from "lucide-react";
import { supabase } from "@/lib/supabaseClient";

interface Pendidikan {
  id: string;
  universitas: string;
  jurusan: string;
  tahun_mulai: number;
  tahun_selesai: number;
}

// Fallback = data pribadi Guntur. Dipakai kalau env kosong / fetch gagal / DB kosong.
const FALLBACK_PENDIDIKAN: Pendidikan[] = [
  {
    id: "f1",
    universitas: "Universitas Jayanusa",
    jurusan: "Teknik Informatika",
    tahun_mulai: 2023,
    tahun_selesai: 2027,
  },
  {
    id: "f2",
    universitas: "SMA Negeri 6 Padang",
    jurusan: "IPA",
    tahun_mulai: 2017,
    tahun_selesai: 2020,
  },
  {
    id: "f3",
    universitas: "SMP Negeri 33 Padang",
    jurusan: "Umum",
    tahun_mulai: 2014,
    tahun_selesai: 2017,
  },
  {
    id: "f4",
    universitas: "SD Negeri 02 Padang",
    jurusan: "Umum",
    tahun_mulai: 2008,
    tahun_selesai: 2014,
  },
];

const quickFacts = [
  { icon: MapPin, label: "Berbasis di", value: "Padang, Indonesia" },
  { icon: GraduationCap, label: "Status", value: "Mahasiswa · Jayanusa '23" },
  { icon: Target, label: "Fokus", value: "Web Dev & UI/UX" },
  { icon: Coffee, label: "Bahan bakar", value: "Kopi susu & lofi" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function About() {
  const [data, setData] = useState<Pendidikan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data: rows, error } = await supabase
          .from("pendidikan")
          .select("*")
          .order("tahun_mulai", { ascending: false });
        if (!alive) return;
        if (error) throw error;
        setData(rows && rows.length ? rows : FALLBACK_PENDIDIKAN);
      } catch {
        if (alive) setData(FALLBACK_PENDIDIKAN);
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
      id="about"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* ambient layer */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-secondary/10 blur-[120px]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,#80808018_1px,transparent_0)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_70%_60%_at_50%_50%,#000_30%,transparent_75%)]" />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* blok naratif asimetris */}
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          {/* kiri: cerita */}
          <motion.div
            className="lg:col-span-7"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
          >
            <motion.div
              variants={fadeUp}
              custom={0}
              className="mb-5 flex items-center gap-3"
            >
              <span className="h-px w-10 bg-gradient-to-r from-primary to-secondary" />
              <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
                Tentang Saya
              </span>
            </motion.div>

            <motion.h2
              variants={fadeUp}
              custom={1}
              className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl"
            >
              Membangun hal bermakna,
              <br className="hidden sm:block" />{" "}
              <span className="font-light italic text-gray-400 dark:text-gray-500">
                satu baris kode
              </span>{" "}
              dalam satu waktu.
            </motion.h2>

            <motion.div
              variants={fadeUp}
              custom={2}
              className="mt-7 space-y-5 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400"
            >
              <p className="border-l-2 border-primary/40 pl-5">
                Halo, saya{" "}
                <span className="font-semibold text-foreground">
                  Guntur Lailam Yuro
                </span>{" "}
                — mahasiswa Teknik Informatika Universitas Jayanusa angkatan
                2023 yang tumbuh di Padang. Saya jatuh cinta pada momen ketika
                ide abstrak berubah jadi antarmuka yang bisa disentuh, diklik,
                dan dirasakan manfaatnya oleh orang sungguhan.
              </p>
              <p>
                Hari-hari saya diisi dengan PHP & MySQL untuk fondasi yang
                kokoh, lalu Next.js, Tailwind, dan Framer Motion untuk lapisan
                pengalaman yang halus. Saya percaya produk yang baik bukan cuma
                yang <em>berfungsi</em>, tapi yang membuat penggunanya tersenyum
                kecil tanpa sadar — lewat detail, ritme, dan rasa.
              </p>
              <p>
                Di luar layar, saya aktif berorganisasi, ngoprek desain, dan
                mengejar rasa penasaran tentang bagaimana teknologi bisa
                menyelesaikan masalah sehari-hari dengan elegan.
              </p>
            </motion.div>
          </motion.div>

          {/* kanan: kartu fakta cepat */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="group relative overflow-hidden rounded-3xl border border-gray-200 bg-white/70 p-7 shadow-sm backdrop-blur transition-shadow duration-500 hover:shadow-xl dark:border-white/10 dark:bg-white/[0.03]">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 blur-2xl transition-transform duration-700 group-hover:scale-150" />
              <div className="relative mb-6 flex items-center justify-between">
                <span className="font-mono text-xs uppercase tracking-widest text-gray-400">
                  Profil Singkat
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-500/10 px-2.5 py-1 text-[11px] font-semibold text-green-600 dark:text-green-400">
                  <span className="relative flex h-1.5 w-1.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green-500" />
                  </span>
                  Aktif
                </span>
              </div>

              <ul className="relative divide-y divide-gray-100 dark:divide-white/5">
                {quickFacts.map((f) => (
                  <li
                    key={f.label}
                    className="group/row flex items-center gap-4 py-3.5 transition-colors"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover/row:scale-110 group-hover/row:rotate-6">
                      <f.icon className="h-4 w-4" />
                    </span>
                    <div className="min-w-0">
                      <p className="font-mono text-[10px] uppercase tracking-widest text-gray-400">
                        {f.label}
                      </p>
                      <p className="truncate text-sm font-semibold text-foreground">
                        {f.value}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>

        {/* perjalanan pendidikan — list vertikal, bukan grid kartu generik */}
        <motion.div
          className="mt-20 md:mt-28"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <motion.div
            variants={fadeUp}
            custom={0}
            className="mb-8 flex items-end justify-between gap-4"
          >
            <h3 className="text-2xl font-bold tracking-tight md:text-3xl">
              Perjalanan Pendidikan
            </h3>
            <span className="hidden font-mono text-xs text-gray-400 sm:block">
              {data.length} tahap
            </span>
          </motion.div>

          <div className="relative space-y-3">
            {loading
              ? Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-5 rounded-2xl border border-gray-100 p-5 dark:border-white/5"
                  >
                    <div className="h-10 w-16 animate-pulse rounded-lg bg-gray-200 dark:bg-white/10" />
                    <div className="flex-1 space-y-2">
                      <div className="h-4 w-2/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                      <div className="h-3 w-1/3 animate-pulse rounded bg-gray-200 dark:bg-white/10" />
                    </div>
                  </div>
                ))
              : data.map((p, i) => (
                  <motion.div
                    key={p.id}
                    custom={i}
                    variants={fadeUp}
                    className="group relative flex items-center gap-5 overflow-hidden rounded-2xl border border-gray-100 bg-white/60 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-white/5 dark:bg-white/[0.02]"
                  >
                    <span className="absolute left-0 top-0 h-full w-1 origin-top scale-y-0 bg-gradient-to-b from-primary to-secondary transition-transform duration-300 group-hover:scale-y-100" />
                    <div className="flex w-20 shrink-0 flex-col items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10 py-2 font-mono text-sm font-bold text-primary">
                      {p.tahun_mulai}
                      <span className="text-[10px] font-normal text-gray-400">
                        — {p.tahun_selesai}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-base font-bold text-foreground">
                        {p.universitas}
                      </p>
                      <p className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                        <GraduationCap className="h-3.5 w-3.5 text-secondary" />
                        {p.jurusan}
                      </p>
                    </div>
                    <CalendarDays className="hidden h-5 w-5 shrink-0 text-gray-300 transition-colors group-hover:text-primary dark:text-gray-600 sm:block" />
                  </motion.div>
                ))}
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-10 flex items-center gap-2 font-mono text-xs text-gray-400"
        >
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          Data pendidikan dimuat dinamis dari Supabase.
        </motion.p>
      </div>
    </section>
  );
}
