import { NextResponse } from "next/server";
import { supabase, envReady } from "@/lib/supabaseClient";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const nama = String(body.nama ?? "").trim();
    const email = String(body.email ?? "").trim();
    const pesan = String(body.pesan ?? "").trim();

    // validasi server-side
    if (!nama || !pesan) {
      return NextResponse.json(
        { ok: false, message: "Nama dan pesan wajib diisi." },
        { status: 400 },
      );
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { ok: false, message: "Format email tidak valid." },
        { status: 400 },
      );
    }

    if (!envReady) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "Supabase belum dikonfigurasi. Isi .env.local lalu restart dev server.",
        },
        { status: 503 },
      );
    }

    const { error } = await supabase
      .from("pesan")
      .insert({ nama, email, pesan });
    if (error) {
      return NextResponse.json(
        { ok: false, message: "Gagal menyimpan pesan: " + error.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Pesan terkirim! Terima kasih sudah menghubungi, Guntur bakal segera balas.",
    });
  } catch {
    return NextResponse.json(
      { ok: false, message: "Terjadi kesalahan tak terduga di server." },
      { status: 500 },
    );
  }
}
