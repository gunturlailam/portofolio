import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

// Ganti dengan URL deploy lu nanti (Vercel) biar OG/absolute URL bener.
const SITE_URL = "https://gunturlailam-portofolio.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Guntur Lailam Yuro — Web Developer",
    template: "%s | Guntur Lailam Yuro",
  },
  description:
    "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang. Mahasiswa Sistem Informasi Universitas Jayanusa yang suka membangun web yang nyaman dipakai.",
  authors: [{ name: "Guntur Lailam Yuro" }],
  creator: "Guntur Lailam Yuro",
  keywords: [
    "Guntur Lailam Yuro",
    "Web Developer",
    "Portofolio",
    "Next.js",
    "Supabase",
    "Tailwind CSS",
    "Padang",
    "Sistem Informasi",
  ],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "Guntur Lailam Yuro — Portfolio",
    title: "Guntur Lailam Yuro — Web Developer",
    description:
      "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang.",
    url: "/",
    images: [
      {
        url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200",
        width: 1200,
        height: 630,
        alt: "Guntur Lailam Yuro — Web Developer",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Guntur Lailam Yuro — Web Developer",
    description:
      "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang.",
    images: [
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200",
    ],
  },
};

export const viewport: Viewport = {
  themeColor: "#8B5CF6",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased scroll-smooth`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
