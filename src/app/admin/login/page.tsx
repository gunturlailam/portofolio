"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import {
  Mail,
  LockKeyhole,
  Loader2,
  ArrowLeft,
  ShieldAlert,
} from "lucide-react";
import {
  envReady,
  envDebug,
  supabaseUrl,
  supabaseKey,
} from "@/lib/supabaseClient";

const GoogleG = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09C6.22 6.86 8.87 4.75 12 4.75z"
    />
  </svg>
);

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState<"none" | "password" | "google">(
    "none",
  );

  const supabase = useMemo(
    () => (envReady ? createBrowserClient(supabaseUrl, supabaseKey) : null),
    [],
  );

  // kalau udah login, langsung ke dashboard
  useEffect(() => {
    if (!supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin/dashboard");
    });
  }, [supabase, router]);

  const handlePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supabase) return;
    setError("");
    setLoading("password");
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) {
      setError(error.message);
      setLoading("none");
      return;
    }
    router.push("/admin/dashboard");
    router.refresh();
  };

  const handleGoogle = async () => {
    if (!supabase) return;
    setError("");
    setLoading("google");
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/admin/dashboard` },
    });
    if (error) {
      setError(error.message);
      setLoading("none");
    }
  };

  const inputCls =
    "w-full rounded-xl border border-gray-300 bg-white/70 py-3 pl-11 pr-4 text-sm outline-none transition-all placeholder:text-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/[0.04]";

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-6 py-16">
      {/* ambient */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:44px_44px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_40%,transparent_100%)]" />
        <div className="absolute -top-24 left-1/3 h-96 w-96 rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute -bottom-24 right-1/3 h-96 w-96 rounded-full bg-secondary/15 blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 28, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1] as [number, number, number, number] as [
            number,
            number,
            number,
            number,
          ],
        }}
        className="w-full max-w-md"
      >
        <div className="mb-8 text-center">
          <Link
            href="/"
            className="inline-flex items-center text-2xl font-bold tracking-tight"
          >
            Guntur<span className="text-primary">.</span>
          </Link>
          <p className="mt-3 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 font-mono text-[11px] uppercase tracking-widest text-primary">
            <ShieldAlert className="h-3.5 w-3.5" />
            Area Admin
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200/70 bg-white/80 p-8 shadow-xl backdrop-blur dark:border-white/10 dark:bg-white/[0.04]">
          <h1 className="text-2xl font-extrabold tracking-tight">
            Masuk Dashboard
          </h1>
          <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
            Kelola proyek, sertifikat, pengalaman & pendidikan.
          </p>

          {!envReady && (
            <div className="mt-5 rounded-xl border border-amber-400/40 bg-amber-500/10 p-4 text-[13px] leading-relaxed text-amber-600 dark:text-amber-400">
              <strong>Supabase belum terbaca oleh aplikasi.</strong>
              <div className="mt-2 space-y-1 font-mono text-[11px]">
                <p>URL : {envDebug.url ?? "❌ TIDAK TERBACA (undefined)"}</p>
                <p>
                  KEY :{" "}
                  {envDebug.keyLen
                    ? `✅ ${envDebug.keyLen} karakter`
                    : "❌ TIDAK TERBACA (undefined)"}
                </p>
              </div>
              <p className="mt-2">
                Kalau ❌ → file/nama/restart yang bermasalah. Kalau ✅ tapi
                notice masih ada → hard refresh.
              </p>
            </div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-5 rounded-xl border border-rose-500/40 bg-rose-500/10 p-4 text-[13px] text-rose-500"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handlePassword} className="mt-6 space-y-4">
            <div className="relative">
              <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@email.com"
                disabled={!envReady}
                className={inputCls}
              />
            </div>
            <div className="relative">
              <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                disabled={!envReady}
                className={inputCls}
              />
            </div>
            <button
              type="submit"
              disabled={!envReady || loading !== "none"}
              className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition-all hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading === "password" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : null}
              {loading === "password" ? "Memeriksa…" : "Masuk"}
            </button>
          </form>

          <div className="my-6 flex items-center gap-4">
            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-gray-400">
              atau
            </span>
            <span className="h-px flex-1 bg-gray-200 dark:bg-white/10" />
          </div>

          <button
            onClick={handleGoogle}
            disabled={!envReady || loading !== "none"}
            className="inline-flex w-full items-center justify-center gap-2.5 rounded-full border border-gray-300 bg-white py-3 text-sm font-semibold text-gray-700 transition-all hover:-translate-y-0.5 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
          >
            {loading === "google" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <GoogleG className="h-4 w-4" />
            )}
            Lanjutkan dengan Google
          </button>
        </div>

        <p className="mt-6 text-center">
          <Link
            href="/"
            className="group inline-flex items-center gap-1.5 text-sm text-gray-500 transition-colors hover:text-primary dark:text-gray-400"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
            Kembali ke beranda
          </Link>
        </p>
      </motion.div>
    </main>
  );
}
