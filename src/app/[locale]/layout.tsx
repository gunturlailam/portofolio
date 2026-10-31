import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { ThemeProvider } from "next-themes";
import { notFound } from "next/navigation";
import { locales } from "@/i18n";
import "../globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

const SITE_URL = "https://portofolio-guntur.vercel.app";

export async function generateMetadata({ params }: { params: { locale: string } }): Promise<Metadata> {
  const locale = params.locale;
  
  if (!locales.includes(locale as any)) {
    notFound();
  }

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: "Guntur Lailam Yuro — Web Developer",
      template: "%s | Guntur Lailam Yuro",
    },
    description:
      locale === 'id'
        ? "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang. Mahasiswa Sistem Informasi Universitas Jayanusa yang suka membangun web yang nyaman dipakai."
        : "Personal portfolio of Guntur Lailam Yuro — Web Developer from Padang. Information Systems student at Jayanusa University who loves building user-friendly websites.",
    authors: [{ name: "Guntur Lailam Yuro" }],
    creator: "Guntur Lailam Yuro",
    keywords: [
      "Guntur Lailam Yuro",
      "Web Developer",
      "Portfolio",
      "Next.js",
      "Supabase",
      "Tailwind CSS",
      "Padang",
      "Sistem Informasi",
    ],
    robots: { index: true, follow: true },
    themeColor: "#8B5CF6",
    openGraph: {
      type: "website",
      locale: locale === 'id' ? "id_ID" : "en_US",
      siteName: "Guntur Lailam Yuro — Portfolio",
      title: "Guntur Lailam Yuro — Web Developer",
      description:
        locale === 'id'
          ? "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang."
          : "Personal portfolio of Guntur Lailam Yuro — Web Developer from Padang.",
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
        locale === 'id'
          ? "Portofolio pribadi Guntur Lailam Yuro — Web Developer dari Padang."
          : "Personal portfolio of Guntur Lailam Yuro — Web Developer from Padang.",
      images: [
        "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=1200",
      ],
    },
  };
}

export default function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(params.locale as any)) {
    notFound();
  }

  const messages = getMessages();

  return (
    <html lang={params.locale} suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased scroll-smooth`}>
        <NextIntlClientProvider messages={messages}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
