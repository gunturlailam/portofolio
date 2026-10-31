"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Printer,
  Mail,
  Phone,
  MapPin,
  Globe,
  Briefcase,
  GraduationCap,
  Award,
  Sparkles,
  Code2,
  FolderGit2,
  Check,
  Share2,
  ExternalLink,
  Layers,
  FileText,
  UserCheck,
} from "lucide-react";
import { supabase, envReady } from "@/lib/supabaseClient";

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

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
);

/* ====== DATA PROFIL RESMI ====== */
const PROFILE = {
  nama: "Guntur Lailam Yuro",
  judul: "Full Stack & Web Developer",
  subjudul: "Mahasiswa Sistem Informasi · Universitas Jayanusa",
  status: "Tersedia untuk Magang & Freelance",
  email: "gunturlailamyuro8@gmail.com",
  telepon: "+62 895-6025-7246",
  lokasi: "Padang, Sumatera Barat, Indonesia",
  linkedin: "linkedin.com/in/gunturlailam",
  linkedinUrl: "https://linkedin.com/in/gunturlailam",
  github: "github.com/gunturlailam",
  githubUrl: "https://github.com/gunturlailam",
  website: "gunturlailam-portofolio.vercel.app",
  websiteUrl: "https://gunturlailam-portofolio.vercel.app",
  ringkasan:
    "Web Developer & Mahasiswa Sistem Informasi di Universitas Jayanusa yang berfokus pada pengembangan aplikasi web modern yang cepat, estetik, dan mudah dikelola. Berpengalaman membangun sistem berbasis PHP & MySQL native hingga ekosistem JavaScript modern seperti Next.js, React, TypeScript, dan Tailwind CSS. Terbiasa memimpin tim, aktif berorganisasi, serta berorientasi tinggi pada clean architecture, performa web, dan kepuasan pengguna akhir.",
};

const SKILL_CATEGORIES = [
  {
    kategori: "Frontend",
    items: [
      "React.js",
      "Next.js (App Router)",
      "TypeScript",
      "JavaScript (ES6+)",
      "Tailwind CSS",
      "HTML5 / CSS3",
      "Framer Motion",
    ],
  },
  {
    kategori: "Backend & Database",
    items: [
      "PHP Native",
      "MySQL",
      "PostgreSQL",
      "Supabase",
      "RESTful API",
      "Node.js",
    ],
  },
  {
    kategori: "Tools & Workflow",
    items: ["Git & GitHub", "Figma", "VS Code", "Postman", "Vercel", "Vite"],
  },
  {
    kategori: "Soft Skills",
    items: [
      "Problem Solving",
      "Team Leadership",
      "Komunikasi Kolaboratif",
      "Adaptasi Cepat",
      "Agile Mindset",
    ],
  },
];

const FALLBACK_PENGALAMAN = [
  {
    id: "p1",
    judul: "Web & Frontend Developer",
    perusahaan: "Freelance & Proyek Independen",
    tipe: "Pekerjaan / Proyek",
    lokasi: "Padang / Remote",
    tanggal_mulai: "2023-06-01",
    tanggal_selesai: null,
    deskripsi:
      "Merancang dan mengimplementasikan antarmuka web modern yang responsif dan berkinerja tinggi untuk berbagai kebutuhan klien dan sistem informasi.",
    poin: [
      "Membangun web aplikasi modern menggunakan Next.js, React, dan Tailwind CSS dengan skor performa Google Lighthouse > 90.",
      "Mengintegrasikan RESTful API dan database relational (MySQL / Supabase) untuk sistem autentikasi, manajemen data (CRUD), dan upload file.",
      "Menerjemahkan wireframe dan prototype dari Figma menjadi kode antarmuka interaktif yang pixel-perfect dan ramah pengguna.",
    ],
    tech: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Supabase", "PHP", "MySQL"],
  },
  {
    id: "p2",
    judul: "Ketua Himpunan Mahasiswa Informatika",
    perusahaan: "Universitas Jayanusa",
    tipe: "Organisasi & Kepemimpinan",
    lokasi: "Padang, Indonesia",
    tanggal_mulai: "2022-09-01",
    tanggal_selesai: "2023-09-01",
    deskripsi:
      "Memimpin organisasi dengan 100+ anggota, mengoordinasikan perencanaan strategis, dan memimpin eksekusi kegiatan teknologi tingkat regional dan nasional.",
    poin: [
      "Mengoordinasikan 5 kegiatan workshop teknologi dan seminar seputar Web Development dan Artificial Intelligence bagi ratusan peserta.",
      "Memimpin tim lintas divisi, mengelola budgeting kegiatan, serta meningkatkan retensi dan keaktifan anggota organisasi hingga 45%.",
      "Membangun kemitraan dengan instansi eksternal dan komunitas teknologi untuk membuka wadah kolaborasi riset mahasiswa.",
    ],
    tech: ["Leadership", "Project Management", "Public Speaking", "Event Management"],
  },
];

const FALLBACK_PROJEK = [
  {
    id: "pr1",
    judul: "TaskFlow PHP Native",
    kategori: "Web Application",
    tanggal_selesai: "2023-10-15",
    deskripsi:
      "Aplikasi manajemen tugas dan produktivitas berbasis web dengan PHP Native & MySQL, dilengkapi sistem autentikasi multi-user aman, role authorization, form validation, dan manajemen status tugas responsif.",
    link_github: "https://github.com/gunturlailam",
    link_demo: "https://gunturlailam-portofolio.vercel.app",
    tech: ["PHP", "MySQL", "JavaScript", "Tailwind CSS"],
  },
  {
    id: "pr2",
    judul: "Dashboard Analytics Next.js",
    kategori: "Web Dashboard",
    tanggal_selesai: "2024-01-10",
    deskripsi:
      "Platform dashboard analitik real-time menggunakan Next.js 14 App Router, Recharts untuk visualisasi metrik bisnis, dan server-side caching optimal untuk akses data cepat tanpa jeda.",
    link_github: "https://github.com/gunturlailam",
    link_demo: "https://gunturlailam-portofolio.vercel.app",
    tech: ["Next.js 14", "TypeScript", "Tailwind CSS", "Recharts"],
  },
  {
    id: "pr3",
    judul: "E-Commerce Mobile & Web App",
    kategori: "Fullstack Platform",
    tanggal_selesai: "2023-11-20",
    deskripsi:
      "Sistem platform e-commerce katalog produk dinamis, keranjang belanja interaktif, kalkulator transaksi terintegrasi, dan pengelolaan stok barang berbasis database relasional.",
    link_github: "https://github.com/gunturlailam",
    link_demo: "https://gunturlailam-portofolio.vercel.app",
    tech: ["React", "Node.js", "MySQL", "Tailwind CSS"],
  },
  {
    id: "pr4",
    judul: "Interactive Portfolio & Dynamic CMS",
    kategori: "Personal Branding",
    tanggal_selesai: "2024-03-01",
    deskripsi:
      "Web portofolio modern dengan mode gelap/terang dinamis, integrasi Supabase Database untuk sinkronisasi proyek dan sertifikat secara langsung, serta visual micro-interactions framer-motion.",
    link_github: "https://github.com/gunturlailam",
    link_demo: "https://gunturlailam-portofolio.vercel.app",
    tech: ["Next.js", "Supabase", "TypeScript", "Framer Motion"],
  },
];

const FALLBACK_PENDIDIKAN = [
  {
    id: "ed1",
    universitas: "Universitas Jayanusa",
    jurusan: "S1 Sistem Informasi",
    tahun_mulai: 2023,
    tahun_selesai: 2027,
    keterangan:
      "Fokus pada Rekayasa Perangkat Lunak, Basis Data, dan Pengembangan Aplikasi Web. Aktif dalam riset teknologi serta organisasi kemahasiswaan.",
  },
  {
    id: "ed2",
    universitas: "SMA Negeri 6 Padang",
    jurusan: "Matematika & Ilmu Pengetahuan Alam (MIPA)",
    tahun_mulai: 2017,
    tahun_selesai: 2020,
    keterangan:
      "Lulus dengan predikat memuaskan, mendalami dasar-dasar logika komputasi dan aktif di kegiatan ekstrakurikuler teknologi.",
  },
];

const FALLBACK_SERTIFIKAT = [
  {
    id: "s1",
    nama_sertifikat: "Meta Front-End Developer Professional Certificate",
    penerbit: "Meta (Coursera)",
    tanggal_terbit: "2024-01-05",
    link: "https://coursera.org",
  },
  {
    id: "s2",
    nama_sertifikat: "Google UX Design Professional Certificate",
    penerbit: "Google (Coursera)",
    tanggal_terbit: "2023-11-10",
    link: "https://coursera.org",
  },
  {
    id: "s3",
    nama_sertifikat: "Fullstack Web Development Bootcamp",
    penerbit: "Dicoding Indonesia",
    tanggal_terbit: "2023-08-15",
    link: "https://dicoding.com",
  },
  {
    id: "s4",
    nama_sertifikat: "AWS Certified Cloud Practitioner Essentials",
    penerbit: "Amazon Web Services",
    tanggal_terbit: "2023-09-20",
    link: "https://aws.amazon.com",
  },
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
  if (p.length < 2) return d;
  const monthIdx = parseInt(p[1], 10) - 1;
  const monthName = BULAN[monthIdx] ?? p[1];
  return `${monthName} ${p[0]}`;
};

const range = (a?: string | null, b?: string | null) =>
  `${fmtBT(a)} – ${b ? fmtBT(b) : "Sekarang"}`;

type Row = Record<string, any>;

export default function CVPage() {
  const [activeTab, setActiveTab] = useState<"modern" | "ats">("modern");
  const [copied, setCopied] = useState(false);

  const [pendidikan, setPendidikan] = useState<Row[]>(FALLBACK_PENDIDIKAN);
  const [pengalaman, setPengalaman] = useState<Row[]>(FALLBACK_PENGALAMAN);
  const [projek, setProjek] = useState<Row[]>(FALLBACK_PROJEK);
  const [sertifikat, setSertifikat] = useState<Row[]>(FALLBACK_SERTIFIKAT);

  useEffect(() => {
    if (!envReady) return;
    (async () => {
      try {
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

        if (p1.data && p1.data.length > 0) setPendidikan(p1.data);
        if (p2.data && p2.data.length > 0) setPengalaman(p2.data);
        if (p3.data && p3.data.length > 0) setProjek(p3.data);
        if (p4.data && p4.data.length > 0) setSertifikat(p4.data);
      } catch (err) {
        console.error("Gagal sinkron data CV dari Supabase:", err);
      }
    })();
  }, []);

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100 py-8 text-slate-800 transition-colors duration-200 print:bg-white print:p-0 print:text-black dark:bg-[#0c0c10] dark:text-slate-100">
      {/* ====== ACTION TOOLBAR (Sembunyi saat dicetak) ====== */}
      <header className="mx-auto mb-8 max-w-5xl px-4 print:hidden">
        <div className="flex flex-col gap-4 rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between dark:border-white/10 dark:bg-[#14141d]/90">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition-colors hover:text-primary dark:text-slate-300 dark:hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" /> Kembali ke Portofolio
          </Link>

          {/* Mode Switcher */}
          <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-white/5">
            <button
              onClick={() => setActiveTab("modern")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "modern"
                  ? "bg-white text-primary shadow-sm dark:bg-primary dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" /> Tampilan Modern
            </button>
            <button
              onClick={() => setActiveTab("ats")}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all ${
                activeTab === "ats"
                  ? "bg-white text-primary shadow-sm dark:bg-primary dark:text-white"
                  : "text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              }`}
            >
              <FileText className="h-3.5 w-3.5" /> Standar ATS
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={handleCopyLink}
              title="Salin tautan CV"
              className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-200 dark:hover:border-primary"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5 text-green-500" />
                  <span className="text-green-600 dark:text-green-400">Tersalin!</span>
                </>
              ) : (
                <>
                  <Share2 className="h-3.5 w-3.5" />
                  <span>Bagikan</span>
                </>
              )}
            </button>

            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-secondary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all hover:opacity-95 hover:shadow-lg active:scale-95"
            >
              <Printer className="h-3.5 w-3.5" />
              <span>Cetak / Simpan PDF</span>
            </button>
          </div>
        </div>
      </header>

      {/* ====== KONTEN CV ====== */}
      {activeTab === "modern" ? (
        /* =========================================================================
           TEMPLAT 1: MODERN EXECUTIVE CV
           ========================================================================= */
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200/90 bg-white p-8 shadow-xl transition-all print:max-w-none print:rounded-none print:border-none print:p-0 print:shadow-none dark:border-white/10 dark:bg-[#121218]">
          {/* Header Profile Modern */}
          <div className="flex flex-col items-start justify-between gap-6 border-b border-slate-200 pb-8 sm:flex-row sm:items-center dark:border-white/10">
            <div className="flex items-center gap-5">
              <div className="relative">
                <div className="h-24 w-24 overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-tr from-primary to-secondary p-0.5 shadow-md print:h-20 print:w-20">
                  <img
                    src="/assets/profile.jpg"
                    alt={PROFILE.nama}
                    className="h-full w-full rounded-2xl object-cover"
                  />
                </div>
                <span
                  title="Tersedia untuk proyek"
                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-green-500 text-white dark:border-[#121218]"
                >
                  <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </span>
              </div>

              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary dark:bg-primary/20">
                  <UserCheck className="h-3 w-3" />
                  {PROFILE.status}
                </div>
                <h1 className="mt-2 text-2xl font-extrabold tracking-tight sm:text-3xl">
                  {PROFILE.nama}
                </h1>
                <p className="font-semibold text-secondary sm:text-base">
                  {PROFILE.judul}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {PROFILE.subjudul}
                </p>
              </div>
            </div>

            {/* Quick Contact Badges */}
            <div className="grid w-full grid-cols-1 gap-2 text-xs sm:w-auto sm:grid-cols-2">
              <a
                href={`mailto:${PROFILE.email}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Mail className="h-3.5 w-3.5 text-primary" />
                <span>{PROFILE.email}</span>
              </a>
              <a
                href={`tel:${PROFILE.telepon.replace(/\s+/g, "")}`}
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Phone className="h-3.5 w-3.5 text-primary" />
                <span>{PROFILE.telepon}</span>
              </a>
              <div className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 dark:border-white/10 dark:bg-white/5 dark:text-slate-300">
                <MapPin className="h-3.5 w-3.5 text-secondary" />
                <span>{PROFILE.lokasi}</span>
              </div>
              <a
                href={PROFILE.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <Globe className="h-3.5 w-3.5 text-secondary" />
                <span>{PROFILE.website}</span>
              </a>
              <a
                href={PROFILE.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <GithubIcon className="h-3.5 w-3.5 text-slate-800 dark:text-slate-200" />
                <span>{PROFILE.github}</span>
              </a>
              <a
                href={PROFILE.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50 px-3 py-2 text-slate-700 transition hover:border-primary hover:text-primary dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
              >
                <LinkedinIcon className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <span>{PROFILE.linkedin}</span>
              </a>
            </div>
          </div>

          {/* Grid Layout 2 Kolom */}
          <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-12">
            {/* KOLOM KIRI (Sidebar Ringkas & Skill: 4 kolom) */}
            <aside className="space-y-6 md:col-span-4">
              {/* Keahlian Teknis */}
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <Code2 className="h-4 w-4 text-primary" /> Keahlian Teknis
                </h3>
                <div className="space-y-4">
                  {SKILL_CATEGORIES.map((cat) => (
                    <div key={cat.kategori}>
                      <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider dark:text-slate-400">
                        {cat.kategori}
                      </span>
                      <div className="mt-1.5 flex flex-wrap gap-1.5">
                        {cat.items.map((it) => (
                          <span
                            key={it}
                            className="rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-medium text-slate-700 shadow-2xs dark:border-white/10 dark:bg-[#1a1a24] dark:text-slate-300"
                          >
                            {it}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Pendidikan */}
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  <GraduationCap className="h-4 w-4 text-primary" /> Pendidikan
                </h3>
                <div className="space-y-4">
                  {pendidikan.map((edu) => (
                    <div
                      key={edu.id}
                      className="border-l-2 border-primary/60 pl-3"
                    >
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                        {edu.universitas}
                      </h4>
                      <p className="text-[11.5px] font-medium text-slate-600 dark:text-slate-300">
                        {edu.jurusan}
                      </p>
                      <span className="text-[11px] font-semibold text-secondary">
                        {edu.tahun_mulai} –{" "}
                        {edu.tahun_selesai ? edu.tahun_selesai : "Sekarang"}
                      </span>
                      {edu.keterangan && (
                        <p className="mt-1 text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
                          {edu.keterangan}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Sertifikasi */}
              {sertifikat.length > 0 && (
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                  <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                    <Award className="h-4 w-4 text-secondary" /> Sertifikasi
                  </h3>
                  <div className="space-y-3">
                    {sertifikat.map((cert) => (
                      <div
                        key={cert.id}
                        className="rounded-lg border border-slate-200/60 bg-white/70 p-2.5 dark:border-white/5 dark:bg-[#161620]"
                      >
                        <h4 className="text-[11.5px] font-bold text-slate-800 dark:text-slate-100">
                          {cert.nama_sertifikat}
                        </h4>
                        <div className="mt-1 flex items-center justify-between text-[10.5px] text-slate-500 dark:text-slate-400">
                          <span>{cert.penerbit}</span>
                          <span>{fmtBT(cert.tanggal_terbit)}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Bahasa & Minat */}
              <div className="rounded-2xl border border-slate-200/70 bg-slate-50/70 p-5 dark:border-white/10 dark:bg-white/[0.03]">
                <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">
                  Bahasa
                </h3>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-100">
                    Indonesia:
                  </strong>{" "}
                  Penutur Asli (Native)
                </p>
                <p className="mt-1 text-[11.5px] text-slate-600 dark:text-slate-300">
                  <strong className="text-slate-800 dark:text-slate-100">
                    Inggris:
                  </strong>{" "}
                  Kemampuan Kerja Profesional & Dokumentasi Teknis
                </p>
              </div>
            </aside>

            {/* KOLOM KANAN (Konten Utama: Ringkasan, Pengalaman, Proyek: 8 kolom) */}
            <main className="space-y-8 md:col-span-8">
              {/* Ringkasan */}
              <section>
                <h2 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                  <Sparkles className="h-4 w-4 text-primary" /> Ringkasan Profesional
                </h2>
                <div className="rounded-2xl border border-slate-200/70 bg-slate-50/50 p-4.5 text-[12.5px] leading-relaxed text-slate-700 shadow-2xs dark:border-white/10 dark:bg-white/[0.02] dark:text-slate-300">
                  {PROFILE.ringkasan}
                </div>
              </section>

              {/* Pengalaman */}
              {pengalaman.length > 0 && (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    <Briefcase className="h-4 w-4 text-primary" /> Pengalaman Kerja & Organisasi
                  </h2>
                  <div className="space-y-5">
                    {pengalaman.map((exp) => (
                      <div
                        key={exp.id}
                        className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs transition hover:border-primary/40 dark:border-white/10 dark:bg-white/[0.02]"
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-1">
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {exp.judul}
                          </h3>
                          <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 dark:bg-white/10 dark:text-slate-300">
                            {range(exp.tanggal_mulai, exp.tanggal_selesai)}
                          </span>
                        </div>

                        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                          <span className="font-semibold text-primary">
                            {exp.perusahaan ?? exp.tipe}
                          </span>
                          {exp.lokasi && (
                            <>
                              <span>•</span>
                              <span>{exp.lokasi}</span>
                            </>
                          )}
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 dark:bg-white/5 dark:text-slate-300">
                            {exp.tipe}
                          </span>
                        </div>

                        {exp.deskripsi && (
                          <p className="mt-2 text-[12px] leading-relaxed text-slate-600 dark:text-slate-300">
                            {exp.deskripsi}
                          </p>
                        )}

                        {exp.poin && Array.isArray(exp.poin) && (
                          <ul className="mt-2.5 space-y-1.5 text-[12px] text-slate-600 dark:text-slate-300">
                            {exp.poin.map((pt: string, idx: number) => (
                              <li key={idx} className="flex items-start gap-2">
                                <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                                <span>{pt}</span>
                              </li>
                            ))}
                          </ul>
                        )}

                        {exp.tech && Array.isArray(exp.tech) && (
                          <div className="mt-3 flex flex-wrap gap-1.5 pt-2">
                            {exp.tech.map((t: string) => (
                              <span
                                key={t}
                                className="rounded bg-primary/10 px-2 py-0.5 text-[10.5px] font-medium text-primary dark:bg-primary/20"
                              >
                                {t}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Proyek Unggulan */}
              {projek.length > 0 && (
                <section>
                  <h2 className="mb-4 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-900 dark:text-white">
                    <FolderGit2 className="h-4 w-4 text-secondary" /> Proyek Unggulan
                  </h2>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {projek.map((prj) => (
                      <div
                        key={prj.id}
                        className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white p-4.5 shadow-2xs transition hover:border-secondary/40 dark:border-white/10 dark:bg-white/[0.02]"
                      >
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                              {prj.judul}
                            </h3>
                            <span className="shrink-0 rounded bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                              {prj.kategori}
                            </span>
                          </div>

                          <p className="mt-2 text-[11.5px] leading-relaxed text-slate-600 line-clamp-3 dark:text-slate-300">
                            {prj.deskripsi}
                          </p>
                        </div>

                        <div className="mt-3 pt-2">
                          {prj.tech && Array.isArray(prj.tech) && (
                            <div className="mb-2.5 flex flex-wrap gap-1">
                              {prj.tech.map((t: string) => (
                                <span
                                  key={t}
                                  className="rounded border border-slate-200 bg-slate-50 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:border-white/10 dark:bg-white/5 dark:text-slate-300"
                                >
                                  {t}
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="flex items-center gap-3 text-[11px] font-semibold text-primary">
                            {prj.link_github && (
                              <a
                                href={prj.link_github}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 hover:underline"
                              >
                                <GithubIcon className="h-3 w-3" /> GitHub
                              </a>
                            )}
                            {prj.link_demo && (
                              <a
                                href={prj.link_demo}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-flex items-center gap-1 hover:underline text-secondary"
                              >
                                <ExternalLink className="h-3 w-3" /> Live Demo
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}
            </main>
          </div>
        </div>
      ) : (
        /* =========================================================================
           TEMPLAT 2: ATS-FRIENDLY CLASSIC RESUME (Format Standar Rekruter)
           ========================================================================= */
        <div className="mx-auto max-w-[820px] bg-white px-10 py-12 font-sans text-[#111] shadow-xl print:max-w-none print:px-0 print:py-0 print:shadow-none">
          {/* Header ATS */}
          <header className="border-b-2 border-slate-900 pb-5 text-center">
            <h1 className="text-3xl font-extrabold uppercase tracking-wider text-slate-900">
              {PROFILE.nama}
            </h1>
            <p className="mt-1 text-sm font-bold text-slate-700 tracking-wide">
              {PROFILE.judul}
            </p>
            <p className="mt-2 text-xs leading-relaxed text-slate-600">
              {PROFILE.lokasi} • {PROFILE.telepon} • {PROFILE.email}
              <br />
              {PROFILE.linkedin} • {PROFILE.github} • {PROFILE.website}
            </p>
          </header>

          {/* Ringkasan ATS */}
          <section className="mt-6">
            <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
              Ringkasan Profesional
            </h2>
            <p className="mt-2.5 text-xs leading-relaxed text-slate-700">
              {PROFILE.ringkasan}
            </p>
          </section>

          {/* Keahlian ATS */}
          <section className="mt-6">
            <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
              Keahlian Teknis
            </h2>
            <div className="mt-2.5 space-y-1 text-xs leading-relaxed text-slate-700">
              <p>
                <strong>Frontend:</strong> React.js, Next.js, TypeScript, JavaScript (ES6+), Tailwind CSS, HTML5, CSS3, Responsive Design.
              </p>
              <p>
                <strong>Backend & Database:</strong> PHP Native, MySQL, PostgreSQL, Supabase, RESTful APIs, Node.js.
              </p>
              <p>
                <strong>Tools & Version Control:</strong> Git, GitHub, Figma, VS Code, Postman, Vercel.
              </p>
              <p>
                <strong>Soft Skills:</strong> Problem Solving, Kepemimpinan Tim, Komunikasi Kolaboratif, Manajemen Waktu.
              </p>
            </div>
          </section>

          {/* Pengalaman ATS */}
          {pengalaman.length > 0 && (
            <section className="mt-6">
              <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                Pengalaman Kerja & Organisasi
              </h2>
              <div className="mt-3 space-y-4">
                {pengalaman.map((exp) => (
                  <div key={exp.id} className="break-inside-avoid">
                    <div className="flex items-baseline justify-between text-xs">
                      <span className="font-bold text-slate-900">
                        {exp.judul}{" "}
                        <span className="font-normal italic text-slate-700">
                          — {exp.perusahaan ?? exp.tipe}
                        </span>
                      </span>
                      <span className="font-semibold text-slate-600">
                        {range(exp.tanggal_mulai, exp.tanggal_selesai)}
                      </span>
                    </div>

                    {exp.deskripsi && (
                      <p className="mt-1 text-xs leading-relaxed text-slate-700">
                        {exp.deskripsi}
                      </p>
                    )}

                    {exp.poin && Array.isArray(exp.poin) && (
                      <ul className="mt-1.5 list-disc pl-4 text-xs space-y-1 text-slate-700">
                        {exp.poin.map((pt: string, idx: number) => (
                          <li key={idx}>{pt}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Proyek ATS */}
          {projek.length > 0 && (
            <section className="mt-6">
              <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                Proyek Pilihan
              </h2>
              <div className="mt-3 space-y-3.5">
                {projek.map((prj) => (
                  <div key={prj.id} className="break-inside-avoid text-xs">
                    <div className="flex items-baseline justify-between">
                      <span className="font-bold text-slate-900">
                        {prj.judul}{" "}
                        <span className="font-normal italic text-slate-600">
                          ({prj.kategori})
                        </span>
                      </span>
                      <span className="text-slate-600">
                        {fmtBT(prj.tanggal_selesai)}
                      </span>
                    </div>

                    <p className="mt-1 leading-relaxed text-slate-700">
                      {prj.deskripsi}
                    </p>

                    <div className="mt-1 text-[11px] text-slate-600">
                      {prj.tech && Array.isArray(prj.tech) && (
                        <span>
                          <strong>Teknologi:</strong> {prj.tech.join(", ")} |{" "}
                        </span>
                      )}
                      {prj.link_github && (
                        <span>
                          Repository: {prj.link_github}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Pendidikan ATS */}
          {pendidikan.length > 0 && (
            <section className="mt-6">
              <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                Pendidikan
              </h2>
              <div className="mt-3 space-y-3">
                {pendidikan.map((edu) => (
                  <div
                    key={edu.id}
                    className="flex items-baseline justify-between text-xs break-inside-avoid"
                  >
                    <div>
                      <span className="font-bold text-slate-900">
                        {edu.universitas}
                      </span>{" "}
                      — <span>{edu.jurusan}</span>
                      {edu.keterangan && (
                        <p className="mt-0.5 text-[11px] text-slate-600">
                          {edu.keterangan}
                        </p>
                      )}
                    </div>
                    <span className="shrink-0 font-medium text-slate-600">
                      {edu.tahun_mulai} –{" "}
                      {edu.tahun_selesai ? edu.tahun_selesai : "Sekarang"}
                    </span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sertifikasi ATS */}
          {sertifikat.length > 0 && (
            <section className="mt-6">
              <h2 className="border-b border-slate-400 pb-1 text-xs font-bold uppercase tracking-widest text-slate-900">
                Sertifikasi Profesional
              </h2>
              <ul className="mt-2.5 space-y-1.5 text-xs text-slate-700">
                {sertifikat.map((cert) => (
                  <li
                    key={cert.id}
                    className="flex items-baseline justify-between"
                  >
                    <span>
                      <strong>{cert.nama_sertifikat}</strong> — {cert.penerbit}
                    </span>
                    <span className="shrink-0 text-slate-600">
                      {fmtBT(cert.tanggal_terbit)}
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </main>
  );
}
