"use client";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type Locale = "id" | "en";

const STORAGE_KEY = "portfolio-locale";

/* ------------------------------------------------------------------ */
/*  Kamus kata — UI chrome & label dinamis. Teks naratif panjang      */
/*  ditulis inline lewat komponen <Tts id/en>.                        */
/* ------------------------------------------------------------------ */
const dict = {
  id: {
    // Navbar
    about: "Tentang",
    education: "Pendidikan",
    experience: "Pengalaman",
    projects: "Projek",
    certificates: "Sertifikat",
    contact: "Kontak",
    switchToDark: "Gelap",
    switchToLight: "Terang",
    openMenu: "Buka menu",
    closeMenu: "Tutup menu",
    changeLanguage: "Ganti bahasa",
    // Hero
    available: "Tersedia untuk proyek freelance",
    hello: "Halo, saya",
    role: "Web Developer",
    downloadCv: "Download CV",
    hireMe: "Hubungi Saya",
    statYears: "Tahun Belajar",
    statProjects: "Proyek Selesai",
    statStack: "Teknologi Dikuasai",
    badgeWeb: "Web Developer",
    badgeDesign: "UI/UX Design",
    scrollDown: "Geser ke bawah",
    // Section eyebrows
    eyebrowAbout: "Tentang Saya",
    eyebrowSkills: "Keahlian",
    eyebrowWork: "Karya Pilihan",
    eyebrowExperience: "Pengalaman",
    eyebrowCertificates: "Sertifikat",
    eyebrowContact: "Kontak",
    // About
    quickFacts: "Profil Singkat",
    activeNow: "Aktif",
    factBased: "Berbasis di",
    factStatus: "Status",
    factMajor: "Jurusan",
    factInterest: "Minat",
    factStatusVal: "Mahasiswa · Jayanusa ’23",
    factMajorVal: "Sistem Informasi",
    factInterestVal: "Web Development",
    eduTitle: "Perjalanan Pendidikan",
    stages: "tahap",
    skillNote: "Kemahiran diukur dari kontribusi proyek nyata, bukan klaim.",
    skillHeadingA: "Tech stack yang saya",
    skillHeadingB: "andalkan",
    skillIntro: "Bukan sekadar daftar — tiap teknologi di bawah punya bobot kemahiran yang saya ukur jujur dari proyek nyata. Dari fondasi PHP & MySQL sampai lapisan modern Next.js.",
    learningNow: "Sedang dipelajari",
    techCount: "teknologi",
    categoryCount: "kategori",
    toolsTitle: "Alat & Desain",
    stacksLabel: "stack",
    // Skills groups
    groupFrontend: "Frontend",
    groupBackend: "Backend",
    groupTools: "Alat & Lainnya",
    // Projects
    searchPlaceholder: "Cari projek…",
    all: "Semua",
    viewAll: "Lihat semua projek",
    noProjects: "Belum ada projek di kategori ini.",
    loadMore: "Muat lebih banyak",
    loading: "Memuat…",
    details: "Detail",
    liveDemo: "Lihat Live",
    sourceCode: "Kode Sumber",
    categoryWeb: "Web",
    categoryMobile: "Mobile",
    categoryDesign: "Design",
    resetFilter: "Reset Filter",
    shownCount: "proyek ditampilkan",
    emptyHint: "Coba pilih kategori lain, atau muat ulang daftar proyek.",
    // Timeline / exp
    workType: "Pekerjaan",
    orgType: "Organisasi",
    present: "Sekarang",
    // Certificates
    issuedBy: "Diterbitkan oleh",
    viewCertificate: "Lihat sertifikat",
    allCertificates: "Semua sertifikat",
    noCertificates: "Belum ada sertifikat tersedia.",
    // Contact
    formName: "Nama",
    formNamePh: "Nama kamu",
    formEmail: "Email",
    formEmailPh: "email@contoh.com",
    formMessage: "Pesan",
    formMessagePh: "Ceritakan ide atau kebutuhanmu…",
    send: "Kirim Pesan",
    contactIntro: "Terbuka untuk proyek freelance, kolaborasi, magang, atau sekadar ngobrol soal teknologi. Pesanmu masuk langsung ke database-ku.",
    locationVal: "Padang, Indonesia",
    sending: "Mengirim…",
    toastRequired: "Nama dan pesan wajib diisi dulu ya.",
    toastEmail: "Format email belum benar. Cek lagi penulisanmu.",
    toastSuccess: "Pesan terkirim! Aku bakal segera balas.",
    toastError: "Terjadi kesalahan. Coba beberapa saat lagi.",
    toastNetwork: "Jaringan bermasalah. Pastikan server berjalan & coba lagi.",
    toastOk: "Berhasil!",
    toastFail: "Ups, gagal!",
    closeNotif: "Tutup notifikasi",
    // Footer
    footerNav: "Navigasi",
    footerConnect: "Terhubung",
    backToTop: "Kembali ke atas",
    home: "Beranda",
    rights: "Hak cipta dilindungi.",
    // 404
    notFoundTitle: "Halaman tidak ditemukan",
    notFoundDesc:
      "Halaman yang kamu cari mungkin sudah dipindah atau memang tidak pernah ada.",
    goHome: "Kembali ke Beranda",
  },
  en: {
    // Navbar
    about: "About",
    education: "Education",
    experience: "Experience",
    projects: "Projects",
    certificates: "Certificates",
    contact: "Contact",
    switchToDark: "Dark",
    switchToLight: "Light",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    changeLanguage: "Change language",
    // Hero
    available: "Available for freelance projects",
    hello: "Hi, I’m",
    role: "Web Developer",
    downloadCv: "Download CV",
    hireMe: "Hire Me",
    statYears: "Years Learning",
    statProjects: "Projects Shipped",
    statStack: "Technologies Mastered",
    badgeWeb: "Web Developer",
    badgeDesign: "UI/UX Design",
    scrollDown: "Scroll down",
    // Section eyebrows
    eyebrowAbout: "About Me",
    eyebrowSkills: "Skills",
    eyebrowWork: "Featured Work",
    eyebrowExperience: "Experience",
    eyebrowCertificates: "Certificates",
    eyebrowContact: "Contact",
    // About
    quickFacts: "Quick Profile",
    activeNow: "Active",
    factBased: "Based in",
    factStatus: "Status",
    factMajor: "Major",
    factInterest: "Focus",
    factStatusVal: "Student · Jayanusa ’23",
    factMajorVal: "Information Systems",
    factInterestVal: "Web Development",
    eduTitle: "Education Journey",
    stages: "stages",
    skillNote: "Skill levels are measured by real project contributions, not claims.",
    skillHeadingA: "The tech stack I",
    skillHeadingB: "rely on",
    skillIntro: "Not just a list — every technology below carries a proficiency weight I honestly measure from real projects. From the PHP & MySQL foundation up to the modern Next.js layer.",
    learningNow: "Currently learning",
    techCount: "technologies",
    categoryCount: "categories",
    toolsTitle: "Tools & Design",
    stacksLabel: "stacks",
    // Skills groups
    groupFrontend: "Frontend",
    groupBackend: "Backend",
    groupTools: "Tools & Others",
    // Projects
    searchPlaceholder: "Search projects…",
    all: "All",
    viewAll: "View all projects",
    noProjects: "No projects in this category yet.",
    loadMore: "Load more",
    loading: "Loading…",
    details: "Details",
    liveDemo: "View Live",
    sourceCode: "Source Code",
    categoryWeb: "Web",
    categoryMobile: "Mobile",
    categoryDesign: "Design",
    resetFilter: "Reset Filter",
    shownCount: "proyek ditampilkan",
    emptyHint: "Coba pilih kategori lain, atau muat ulang daftar proyek.",
    // Timeline / exp
    workType: "Work",
    orgType: "Organization",
    present: "Present",
    // Certificates
    issuedBy: "Issued by",
    viewCertificate: "View certificate",
    allCertificates: "All certificates",
    noCertificates: "No certificates available yet.",
    // Contact
    formName: "Name",
    formNamePh: "Your name",
    formEmail: "Email",
    formEmailPh: "you@example.com",
    formMessage: "Message",
    formMessagePh: "Tell me about your idea or needs…",
    send: "Send Message",
    contactIntro: "Open to freelance projects, collaborations, internships, or just a chat about technology. Your message lands straight in my database.",
    locationVal: "Padang, Indonesia",
    sending: "Sending…",
    toastRequired: "Name and message are required.",
    toastEmail: "That email format doesn’t look right.",
    toastSuccess: "Message sent! I’ll get back to you soon.",
    toastError: "Something went wrong. Please try again later.",
    toastNetwork: "Network issue. Check your connection and try again.",
    toastOk: "Success!",
    toastFail: "Oops, failed!",
    closeNotif: "Close notification",
    // Footer
    footerNav: "Navigation",
    footerConnect: "Connect",
    backToTop: "Back to top",
    home: "Home",
    rights: "All rights reserved.",
    // 404
    notFoundTitle: "Page not found",
    notFoundDesc:
      "The page you’re looking for may have been moved, or never existed.",
    goHome: "Back to Home",
  },
};

type DictKey = keyof typeof dict.id;

interface LangCtx {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: (key: DictKey) => string;
}

const LanguageContext = createContext<LangCtx>({
  locale: "id",
  setLocale: () => {},
  toggle: () => {},
  t: (k) => k,
});

export function LanguageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>("id");

  useEffect(() => {
    let initial: Locale = "id";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "id" || stored === "en") initial = stored;
      else if (navigator.language?.toLowerCase().startsWith("en"))
        initial = "en";
    } catch {
      /* SSR-safe */
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLocale(initial);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    try {
      localStorage.setItem(STORAGE_KEY, l);
    } catch {
      /* ignore */
    }
    // update html lang attr for SEO/a11y
    if (typeof document !== "undefined")
      document.documentElement.lang = l;
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "id" ? "en" : "id");
  }, [locale, setLocale]);

  const t = useCallback(
    (key: DictKey) => dict[locale][key] ?? key,
    [locale],
  );

  const value = useMemo(
    () => ({ locale, setLocale, toggle, t }),
    [locale, setLocale, toggle, t],
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLang() {
  return useContext(LanguageContext);
}

/** Render bilingual narrative text inline: <Tts id="…" en="…" /> */
export function Tts({
  id,
  en,
  className,
  as: Tag = "p",
}: {
  id: React.ReactNode;
  en: React.ReactNode;
  className?: string;
  as?: "p" | "span" | "h1" | "h2" | "h3" | "h4";
}) {
  const { locale } = useLang();
  return <Tag className={className}>{locale === "en" ? en : id}</Tag>;
}
