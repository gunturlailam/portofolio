"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Printer } from "lucide-react";
import { supabase, envReady } from "@/lib/supabaseClient";

/* ====== PROFIL — edit bagian ini sesuai data lu ====== */
const PROFILE = {
  nama: "Guntur Lailam Yuro",
  judul: "Web Developer",
  email: "gunturlailamyuro8@gmail.com",
  telepon: "+62 895-6025-7246",
  lokasi: "Padang, Indonesia",
  linkedin: "linkedin.com/in/gunturlailam",
  github: "github.com/gunturlailam",
  website: "gunturlailam-portofolio.vercel.app",
  ringkasan:
    "Mahasiswa Sistem Informasi Universitas Jayanusa yang berfokus pada web development. Berpengalaman membangun aplikasi dengan PHP, MySQL, dan ekosistem JavaScript modern (Next.js, React, Tailwind). Terbiasa bekerja dalam tim, aktif berorganisasi, dan berkomitmen menulis kode yang sederhana serta mudah dirawat.",
};
const SKILLS = [
  "PHP",
  "MySQL",
  "JavaScript",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind CSS",
  "HTML5",
  "CSS3",
  "Git",
  "Figma",
  "Node.js",
];

const BULAN = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];
const fmtBT = (d?: string | null) => {
  if (!d) return "Sekarang";
  const p = d.split("-");
  if (p.length !== 3) return d;
  return `${BULAN[+p[1] - 1]} ${p[0]}`;
};
const range = (a?: string | null, b?: string | null) =>
  `${fmtBT(a)} – ${b ? fmtBT(b) : "Sekarang"}`;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Row = Record<string, any>;

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6">
      <h2 className="mb-3 border-b-2 border-black pb-1 text-[13px] font-bold uppercase tracking-[0.18em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CVPage() {
  const [pendidikan, setPendidikan] = useState<Row[]>([]);
  const [pengalaman, setPengalaman] = useState<Row[]>([]);
  const [projek, setProjek] = useState<Row[]>([]);
  const [sertifikat, setSertifikat] = useState<Row[]>([]);

  useEffect(() => {
    if (!envReady) return;
    (async () => {
      const [p1, p2, p3, p4] = await Promise.all([
        supabase
          .from("pendidikan")
          .select("*")
          .order("tahun_mulai", { ascending: false }),
        supabase
          .from("pengalaman")
          .select("*")
          .order("tanggal_mulai", { ascending: false }),
        supabase
          .from("projek")
          .select("*")
          .order("tanggal_selesai", { ascending: false })
          .limit(6),
        supabase
          .from("sertifikat")
          .select("*")
          .order("tanggal_terbit", { ascending: false }),
      ]);
      setPendidikan(p1.data ?? []);
      setPengalaman(p2.data ?? []);
      setProjek(p3.data ?? []);
      setSertifikat(p4.data ?? []);
    })();
  }, []);

  return (
    <main className="min-h-screen bg-gray-200 py-10 print:bg-white print:py-0 dark:bg-black/60">
      {/* toolbar (nggak ikut ke-print) */}
      <div className="mx-auto mb-6 flex max-w-[820px] items-center justify-between px-4 print:hidden">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-primary dark:text-gray-200"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Link>
        <button
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
        >
          <Printer className="h-4 w-4" /> Unduh PDF
        </button>
      </div>

      {/* ====== KERTAS CV (ATS) ====== */}
      <div className="mx-auto max-w-[820px] bg-white px-10 py-12 font-sans text-[#111] shadow-xl print:max-w-none print:px-0 print:py-0 print:shadow-none">
        {/* header */}
        <header className="text-center">
          <h1 className="text-[28px] font-extrabold uppercase tracking-wide">
            {PROFILE.nama}
          </h1>
          <p className="mt-1 text-[14px] font-semibold">{PROFILE.judul}</p>
          <p className="mt-2 text-[12px] leading-relaxed text-[#333]">
            {PROFILE.email} · {PROFILE.telepon} · {PROFILE.lokasi}
            <br />
            {PROFILE.linkedin} · {PROFILE.github} · {PROFILE.website}
          </p>
        </header>

        <Section title="Ringkasan">
          <p className="text-[13px] leading-relaxed">{PROFILE.ringkasan}</p>
        </Section>

        {pengalaman.length > 0 && (
          <Section title="Pengalaman">
            <div className="space-y-4">
              {pengalaman.map((r) => (
                <div key={r.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold">{r.judul}</h3>
                    <span className="text-[12px]">
                      {range(r.tanggal_mulai, r.tanggal_selesai)}
                    </span>
                  </div>
                  <p className="text-[12.5px] italic">{r.tipe}</p>
                  <p className="mt-1 text-[13px] leading-relaxed">
                    {r.deskripsi}
                  </p>
                </div>
              ))}
            </div>
          </Section>
        )}

        {projek.length > 0 && (
          <Section title="Proyek">
            <div className="space-y-3">
              {projek.map((r) => (
                <div key={r.id}>
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-[14px] font-bold">
                      {r.judul}{" "}
                      <span className="font-normal italic">({r.kategori})</span>
                    </h3>
                    <span className="text-[12px]">
                      {fmtBT(r.tanggal_selesai)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-[13px] leading-relaxed">
                    {(r.deskripsi ?? "").slice(0, 220)}
                  </p>
                  {r.link_github && (
                    <p className="text-[12px] text-[#333]">{r.link_github}</p>
                  )}
                </div>
              ))}
            </div>
          </Section>
        )}

        {pendidikan.length > 0 && (
          <Section title="Pendidikan">
            <div className="space-y-3">
              {pendidikan.map((r) => (
                <div key={r.id} className="flex items-baseline justify-between">
                  <div>
                    <h3 className="text-[14px] font-bold">{r.universitas}</h3>
                    <p className="text-[13px]">{r.jurusan}</p>
                  </div>
                  <span className="text-[12px]">
                    {r.tahun_mulai} – {r.tahun_selesai}
                  </span>
                </div>
              ))}
            </div>
          </Section>
        )}

        <Section title="Keahlian">
          <p className="text-[13px] leading-relaxed">{SKILLS.join(" · ")}</p>
        </Section>

        {sertifikat.length > 0 && (
          <Section title="Sertifikat">
            <ul className="space-y-1.5">
              {sertifikat.map((r) => (
                <li
                  key={r.id}
                  className="flex items-baseline justify-between text-[13px]"
                >
                  <span>
                    <strong>{r.nama_sertifikat}</strong> — {r.penerbit}
                  </span>
                  <span className="text-[12px]">{fmtBT(r.tanggal_terbit)}</span>
                </li>
              ))}
            </ul>
          </Section>
        )}
      </div>
    </main>
  );
}
