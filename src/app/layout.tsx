import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "next-themes";
import "./globals.css";
import { html } from "framer-motion/client";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Guntur Lailam Yuro - Personal Portfolio",
  description:
    "Portofolio pribadi dinamis Guntur Lailam Yuro yang dibangun dengan Next.js 14, Tailwind CSS, Framer Motion, dan databse.",
  openGraph: {
    title: "Guntur Lailam Yuro - Personal Portfolio",
    description:
      "Portofolio pribadi dinamis Guntur Lailam Yuro yang dibangun dengan Next.js 14, Tailwind CSS, Framer Motion, dan Supabase.",
    url: "https://portofolio-saya.vercel.app",
    siteName: "Guntur Lailam Yuro Portfolio",
    images: [
      {
        url: "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?auto=format&fit=crop&q=80&w=120",
        width: 1200,
        height: 630,
        alt: "Guntur Lailam Yuro Portfolio Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
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
