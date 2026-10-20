import { createClient, type SupabaseClient } from "@supabase/supabase-js";

// Bersihkan kutip pembungkus, spasi nyasar, dan BOM yang nyelip di nilai.
const raw = (v: string | undefined) =>
  (v ?? "")
    .replace(/\uFEFF/g, "")
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "");

const url = raw(process.env.NEXT_PUBLIC_SUPABASE_URL);
// Supabase baru menamai "anon key" sebagai "publishable key" — terima keduanya.
const key = raw(
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY
);

export const supabaseUrl = url;
export const supabaseKey = key;

export const envReady =
  !!url &&
  !!key &&
  url.startsWith("http") &&
  key.length > 10 &&
  !key.includes("your_");

// Diagnostik: biar halaman login bisa ngaku apa yang dia lihat.
export const envDebug = {
  url: url ? url.slice(0, 14) + "…" : null,
  keyLen: key ? key.length : 0,
};

// Client tiruan: dipakai SAAT env belum diisi supaya aplikasi TIDAK crash.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyChain: any = new Proxy(function () {}, {
  get(_target, prop) {
    if (prop === "then")
      return (
        resolve: (v: {
          data: unknown[];
          error: null;
          count: null;
          status: number;
          statusText: string;
        }) => void,
      ) =>
        resolve({
          data: [],
          error: null,
          count: null,
          status: 200,
          statusText: "OK",
        });
    if (prop === "catch" || prop === "finally") return () => emptyChain;
    return emptyChain;
  },
  apply() {
    return emptyChain;
  },
});

export const supabase: SupabaseClient = envReady
  ? createClient(url, key, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : (emptyChain as unknown as SupabaseClient);
