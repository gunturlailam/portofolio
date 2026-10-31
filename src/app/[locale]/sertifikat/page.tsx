import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CertificateGrid from "@/components/CertificateGrid";

export const metadata: Metadata = {
  title: "Semua Sertifikat — Guntur Lailam Yuro",
  description:
    "Daftar lengkap sertifikat & kredensial yang diraih Guntur Lailam Yuro.",
};

export default function SertifikatPage() {
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <CertificateGrid
        limit={100}
        showViewAll={false}
        title="Semua Sertifikat"
        subtitle="Arsip lengkap kredensial — dari bootcamp sampai sertifikasi profesional."
        cols="sm:grid-cols-2 lg:grid-cols-3"
      />
    </main>
  );
}
