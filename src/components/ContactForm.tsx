"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, MessageCircle, MapPin, Send, Loader2 } from "lucide-react";
import Toast, { type ToastType } from "./Toast";

const infoRows = [
  {
    icon: Mail,
    label: "Email",
    value: "gunturlailamyuro8@gmail.com",
    href: "mailto:gunturlailamyuro8@gmail.com",
  },
  {
    icon: MessageCircle,
    label: "WhatsApp",
    value: "+62 895-6025-7246-6",
    href: "https://wa.me/62895602572476",
  },
  { icon: MapPin, label: "Lokasi", value: "Padang, Indonesia", href: null },
];

interface ToastState {
  id: number;
  type: ToastType;
  message: string;
}

export default function ContactForm() {
  const [nama, setNama] = useState("");
  const [email, setEmail] = useState("");
  const [pesan, setPesan] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (type: ToastType, message: string) =>
    setToast({ id: Date.now(), type, message });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // validasi client-side
    if (!nama.trim() || !pesan.trim()) {
      showToast("error", "Nama dan pesan wajib diisi dulu ya.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showToast("error", "Format email belum benar. Cek lagi penulisanmu.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nama, email, pesan }),
      });
      const json = await res.json();

      if (res.ok && json.ok) {
        showToast(
          "success",
          json.message ?? "Pesan terkirim! Aku bakal segera balas.",
        );
        setNama("");
        setEmail("");
        setPesan("");
      } else {
        showToast(
          "error",
          json.message ?? "Terjadi kesalahan. Coba beberapa saat lagi.",
        );
      }
    } catch {
      showToast(
        "error",
        "Jaringan bermasalah. Pastikan server berjalan & coba lagi.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white/70 px-4 py-3 text-sm text-foreground outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/[0.04] dark:focus:border-primary";

  return (
    <section
      id="contact"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute -bottom-32 left-1/4 h-96 w-96 rounded-full bg-secondary/10 blur-[130px]" />
        <div className="absolute -top-24 right-1/4 h-96 w-96 rounded-full bg-primary/10 blur-[130px]" />
      </div>

      <div className="mx-auto grid max-w-6xl gap-14 px-6 lg:grid-cols-5 lg:gap-16">
        {/* kiri: ajakan + info */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-4 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-primary to-secondary" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Kontak
            </span>
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Punya ide? <br />
            <span className="italic text-gray-400 dark:text-gray-500">
              Mari wujudkan
            </span>{" "}
            bersama.
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
            Terbuka untuk proyek freelance, kolaborasi, magang, atau sekadar
            ngobrol soal teknologi. Pesanmu masuk langsung ke database-ku.
          </p>

          <ul className="mt-9 space-y-3">
            {infoRows.map((row) => {
              const inner = (
                <>
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6">
                    <row.icon className="h-5 w-5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-mono text-[10px] uppercase tracking-widest text-gray-400">
                      {row.label}
                    </span>
                    <span className="block truncate text-sm font-semibold text-foreground">
                      {row.value}
                    </span>
                  </span>
                </>
              );
              return (
                <li key={row.label}>
                  {row.href ? (
                    <a
                      href={row.href}
                      target={
                        row.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className="group flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white/60 p-3.5 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className="group flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white/60 p-3.5 dark:border-white/10 dark:bg-white/[0.03]">
                      {inner}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </motion.div>

        {/* kanan: form */}
        <motion.form
          onSubmit={handleSubmit}
          className="relative rounded-3xl border border-gray-200/70 bg-white/70 p-7 shadow-sm backdrop-blur dark:border-white/10 dark:bg-white/[0.03] md:p-9 lg:col-span-3"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label
                htmlFor="nama"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Nama
              </label>
              <input
                id="nama"
                type="text"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
                placeholder="Nama kamu"
                className={inputCls}
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-semibold text-foreground"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className={inputCls}
              />
            </div>
          </div>

          <div className="mt-5">
            <label
              htmlFor="pesan"
              className="mb-2 block text-sm font-semibold text-foreground"
            >
              Pesan
            </label>
            <textarea
              id="pesan"
              rows={6}
              value={pesan}
              onChange={(e) => setPesan(e.target.value)}
              placeholder="Ceritakan proyek atau ide kamu…"
              className={`${inputCls} resize-none`}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="group mt-7 inline-flex w-full items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-primary to-secondary px-7 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/40 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Mengirim…
              </>
            ) : (
              <>
                <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Kirim Pesan
              </>
            )}
          </button>
        </motion.form>
      </div>

      {/* toast container */}
      <div className="pointer-events-none fixed bottom-6 right-6 z-[70] flex flex-col items-end gap-3">
        <AnimatePresence>
          {toast && (
            <Toast
              key={toast.id}
              type={toast.type}
              message={toast.message}
              onClose={() => setToast(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
