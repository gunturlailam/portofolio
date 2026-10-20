import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  // Dukung dua penamaan key Supabase (anon lama / publishable baru).
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
  return NextResponse.json({
    urlAda: !!url,
    keyAda: !!key,
    urlMulaiHttp: !!url && url.startsWith("http"),
    urlPreview: url ? url.slice(0, 12) + "…" : null,
    keyPanjang: key ? key.length : 0,
  });
}
