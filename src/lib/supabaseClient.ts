import { createClient, type SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Env "siap" hanya kalau terisi & bukan placeholder template.
export const envReady =
  !!url &&
  !!key &&
  url.startsWith("http") &&
  key.length > 10 &&
  !key.includes("your_");

// Client tiruan: dipakai SAAT env belum diisi supaya aplikasi TIDAK crash.
// Rantai query (.from().select().range()...) dikembalikan kosong → komponen jatuh ke fallback.
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

export const supabase: SupabaseClient = envReady
  ? createClient(url as string, key as string, {
      auth: { persistSession: true, autoRefreshToken: true },
    })
  : (emptyChain as unknown as SupabaseClient);
