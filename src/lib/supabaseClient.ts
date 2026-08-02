import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Env dianggap "siap" hanya kalau terisi & bukan placeholder bawaan template.
const envReady =
  !!url &&
  !!key &&
  url.startsWith("http") &&
  key.length > 10 &&
  !key.includes("your_");

// Client tiruan: dipakai SAAT env belum diisi supaya aplikasi TIDAK crash.
// Semua rantai query (.from().select().order()) dikembalikan kosong,
// sehingga komponen otomatis jatuh ke data fallback pribadi Guntur.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const emptyChain: any = new Proxy(function () {}, {
  get(_target, prop) {
    if (prop === "then")
      return (resolve: any) =>
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

// createClient HANYA dipanggil kalau env siap.
// Kalau belum → pakai emptyChain → TIDAK ada throw → TIDAK ada overlay error.
export const supabase: SupabaseClient = envReady
  ? createClient(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : (emptyChain as unknown as SupabaseClient);
