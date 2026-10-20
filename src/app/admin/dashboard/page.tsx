/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient } from "@supabase/ssr";
import type { SupabaseClient } from "@supabase/supabase-js";
import { supabaseUrl, supabaseKey, envReady } from "@/lib/supabaseClient";
import Toast, { type ToastType } from "@/components/Toast";
import {
  LayoutDashboard,
  Gauge,
  FolderKanban,
  Award,
  Briefcase,
  GraduationCap,
  Inbox,
  Plus,
  Pencil,
  Trash2,
  X,
  Upload,
  LogOut,
  ExternalLink,
  Loader2,
  Menu,
  ArrowRight,
  FileText,
} from "lucide-react";

type Tab =
  | "dashboard"
  | "projek"
  | "sertifikat"
  | "pengalaman"
  | "pendidikan"
  | "pesan";
type Row = Record<string, any>;
type Notify = (t: ToastType, m: string) => void;

/* ---------------- helpers ---------------- */
const slugify = (s: string) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");

async function makeUniqueSlug(
  db: SupabaseClient,
  base: string,
  exceptId?: string,
) {
  // Guard: kalau slugify menghasilkan kosong, pakai "project" sebagai fallback
  const cleanBase = base.trim() || "project";
  const fallback = `${cleanBase}-${Date.now().toString(36)}`;

  try {
    const { data, error } = await db
      .from("projek")
      .select("id,slug")
      .ilike("slug", `${cleanBase}%`);

    if (error || !data) return fallback;

    const taken = new Set(
      data.filter((r: any) => r.id !== exceptId).map((r: any) => r.slug),
    );

    if (!taken.has(cleanBase)) return cleanBase;

    let i = 2;
    while (taken.has(`${cleanBase}-${i}`)) i++;
    return `${cleanBase}-${i}`;
  } catch {
    return fallback;
  }
}

const fmtDate = (d: any) =>
  d
    ? new Date(d).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "—";

/* ---------------- atoms ---------------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block font-mono text-[10px] uppercase tracking-widest text-gray-400">
        {label}
      </span>
      {children}
    </label>
  );
}
const inputCls =
  "w-full rounded-xl border border-gray-300 bg-white/70 px-3.5 py-2.5 text-sm outline-none transition focus:border-primary focus:ring-4 focus:ring-primary/15 dark:border-white/10 dark:bg-white/[0.05]";

function ImgUpload({
  db,
  value,
  onChange,
  folder,
  notify,
  accept = "image/*",
}: {
  db: SupabaseClient;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  notify: Notify;
  accept?: string;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const isPdf = /\.pdf(\?.*)?$/i.test(value || "");
  const isImage =
    !isPdf &&
    /\.(png|jpe?g|gif|webp|svg|bmp|avif|ico)(\?.*)?$/i.test(value || "");
  const pick = async (f: File) => {
    setBusy(true);
    const path = `${folder}/${Date.now()}-${f.name.replace(/\s+/g, "-")}`;
    const { error } = await db.storage.from("portofolio").upload(path, f);
    if (error) notify("error", "Upload gagal: " + error.message);
    else {
      const { data } = db.storage.from("portofolio").getPublicUrl(path);
      onChange(data.publicUrl);
      notify("success", "File tersimpan ke Storage.");
    }
    setBusy(false);
  };
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5">
        {value ? (
          isPdf ? (
            <div className="flex h-full flex-col items-center justify-center bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-300">
              <FileText className="h-6 w-6" />
              <span className="mt-1 text-[10px] font-semibold uppercase">
                PDF
              </span>
            </div>
          ) : isImage ? (
            <img
              src={value}
              alt="preview"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-gray-500">
              <Upload className="h-5 w-5" />
              <span className="mt-1 text-[10px] font-semibold uppercase">
                FILE
              </span>
            </div>
          )
        ) : (
          <div className="flex h-full items-center justify-center text-gray-300">
            <Upload className="h-5 w-5" />
          </div>
        )}
        {busy && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40">
            <Loader2 className="h-5 w-5 animate-spin text-white" />
          </div>
        )}
      </div>
      <div className="space-y-1.5">
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold transition hover:border-primary hover:text-primary dark:border-white/10"
        >
          <Upload className="h-3.5 w-3.5" />{" "}
          {value ? "Ganti File" : "Upload File"}
        </button>
        <p className="font-mono text-[10px] text-gray-400">
          → bucket `portofolio`
        </p>
      </div>
      <input
        ref={ref}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files?.[0] && pick(e.target.files[0])}
      />
    </div>
  );
}

function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 16 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            onClick={(e) => e.stopPropagation()}
            className="max-h-[88vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-gray-200 bg-white p-6 shadow-2xl dark:border-white/10 dark:bg-[#111113]"
          >
            <div className="mb-5 flex items-center justify-between">
              <h3 className="text-lg font-bold">{title}</h3>
              <button
                onClick={onClose}
                className="rounded-full p-1.5 text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function Del({ onConfirm }: { onConfirm: () => void }) {
  const [arm, setArm] = useState(false);
  useEffect(() => {
    if (!arm) return;
    const t = setTimeout(() => setArm(false), 2500);
    return () => clearTimeout(t);
  }, [arm]);
  return (
    <button
      onClick={() => (arm ? onConfirm() : setArm(true))}
      className={`rounded-full p-2 transition ${arm ? "bg-rose-500 text-white" : "text-gray-400 hover:bg-rose-500/10 hover:text-rose-500"}`}
    >
      {arm ? (
        <span className="px-1 text-[10px] font-bold">Yakin?</span>
      ) : (
        <Trash2 className="h-4 w-4" />
      )}
    </button>
  );
}

/* ---------------- forms ---------------- */
function ProjekForm({
  db,
  initial,
  onSaved,
  notify,
}: {
  db: SupabaseClient;
  initial?: Row;
  onSaved: () => void;
  notify: Notify;
}) {
  const [f, setF] = useState({
    judul: initial?.judul ?? "",
    kategori: initial?.kategori ?? "Web",
    deskripsi: initial?.deskripsi ?? "",
    gambar: initial?.gambar ?? "",
    link_github: initial?.link_github ?? "",
    tanggal_selesai: initial?.tanggal_selesai ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    if (!f.judul.trim()) {
      notify("error", "Judul tidak boleh kosong");
      return;
    }

    setBusy(true);

    const baseSlug = slugify(f.judul);
    let slug = await makeUniqueSlug(db, baseSlug, initial?.id);

    const payload = {
      ...f,
      tanggal_selesai: f.tanggal_selesai || null,
      slug,
      judul: f.judul.trim(),
      deskripsi: f.deskripsi.trim(),
    };

    let res = initial
      ? await db.from("projek").update(payload).eq("id", initial.id)
      : await db.from("projek").insert(payload);

    if (res.error && res.error.code === "23505") {
      slug = `${baseSlug || "project"}-${Date.now().toString(36)}`;
      const p2 = { ...payload, slug };
      res = initial
        ? await db.from("projek").update(p2).eq("id", initial.id)
        : await db.from("projek").insert(p2);
    }

    setBusy(false);

    if (res.error) {
      notify("error", res.error.message);
      console.error("DB error:", res.error);
    } else {
      notify("success", `Projek tersimpan (slug: ${slug})`);
      onSaved();
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Judul">
        <input
          required
          className={inputCls}
          value={f.judul}
          onChange={(e) => set("judul", e.target.value)}
        />
      </Field>
      <p className="-mt-2 font-mono text-[10px] text-gray-400">
        slug: <span className="text-secondary">{slugify(f.judul) || "…"}</span>
      </p>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Kategori">
          <select
            className={inputCls}
            value={f.kategori}
            onChange={(e) => set("kategori", e.target.value)}
          >
            <option value="Web">Web</option>
            <option value="Mobile">Mobile</option>
            <option value="Design">Design</option>
          </select>
        </Field>
        <Field label="Tanggal Selesai">
          <input
            type="date"
            className={inputCls}
            value={f.tanggal_selesai}
            onChange={(e) => set("tanggal_selesai", e.target.value)}
          />
        </Field>
      </div>
      <Field label="Link GitHub">
        <input
          className={inputCls}
          value={f.link_github}
          onChange={(e) => set("link_github", e.target.value)}
          placeholder="https://github.com/…"
        />
      </Field>
      <Field label="Deskripsi">
        <textarea
          rows={4}
          required
          className={`${inputCls} resize-none`}
          value={f.deskripsi}
          onChange={(e) => set("deskripsi", e.target.value)}
        />
      </Field>
      <Field label="Gambar">
        <ImgUpload
          db={db}
          folder="projek"
          value={f.gambar}
          onChange={(v) => set("gambar", v)}
          notify={notify}
        />
      </Field>
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
        Simpan
      </button>
    </form>
  );
}

function SertifikatForm({ db, initial, onSaved, notify }: any) {
  const [f, setF] = useState({
    nama_sertifikat: initial?.nama_sertifikat ?? "",
    penerbit: initial?.penerbit ?? "",
    tanggal_terbit: initial?.tanggal_terbit ?? "",
    file_gambar: initial?.file_gambar ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = initial
      ? await db.from("sertifikat").update(f).eq("id", initial.id)
      : await db.from("sertifikat").insert(f);
    setBusy(false);
    if (error) notify("error", error.message);
    else {
      notify("success", "Sertifikat tersimpan.");
      onSaved();
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Nama Sertifikat">
        <input
          required
          className={inputCls}
          value={f.nama_sertifikat}
          onChange={(e) => set("nama_sertifikat", e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Penerbit">
          <input
            required
            className={inputCls}
            value={f.penerbit}
            onChange={(e) => set("penerbit", e.target.value)}
          />
        </Field>
        <Field label="Tanggal Terbit">
          <input
            type="date"
            required
            className={inputCls}
            value={f.tanggal_terbit}
            onChange={(e) => set("tanggal_terbit", e.target.value)}
          />
        </Field>
      </div>
      <Field label="File Sertifikat (PDF/Gambar)">
        <ImgUpload
          db={db}
          folder="sertifikat"
          value={f.file_gambar}
          onChange={(v) => set("file_gambar", v)}
          notify={notify}
          accept="image/*,application/pdf"
        />
      </Field>
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
      </button>
    </form>
  );
}

function PengalamanForm({ db, initial, onSaved, notify }: any) {
  const [f, setF] = useState({
    judul: initial?.judul ?? "",
    tipe: initial?.tipe ?? "Pekerjaan",
    deskripsi: initial?.deskripsi ?? "",
    tanggal_mulai: initial?.tanggal_mulai ?? "",
    tanggal_selesai: initial?.tanggal_selesai ?? "",
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = { ...f, tanggal_selesai: f.tanggal_selesai || null };
    const { error } = initial
      ? await db.from("pengalaman").update(payload).eq("id", initial.id)
      : await db.from("pengalaman").insert(payload);
    setBusy(false);
    if (error) notify("error", error.message);
    else {
      notify("success", "Pengalaman tersimpan.");
      onSaved();
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Judul">
        <input
          required
          className={inputCls}
          value={f.judul}
          onChange={(e) => set("judul", e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipe">
          <select
            className={inputCls}
            value={f.tipe}
            onChange={(e) => set("tipe", e.target.value)}
          >
            <option>Pekerjaan</option>
            <option>Organisasi</option>
          </select>
        </Field>
        <div className="grid grid-cols-2 gap-2">
          <Field label="Mulai">
            <input
              type="date"
              required
              className={inputCls}
              value={f.tanggal_mulai}
              onChange={(e) => set("tanggal_mulai", e.target.value)}
            />
          </Field>
          <Field label="Selesai">
            <input
              type="date"
              className={inputCls}
              value={f.tanggal_selesai}
              onChange={(e) => set("tanggal_selesai", e.target.value)}
            />
          </Field>
        </div>
      </div>
      <Field label="Deskripsi">
        <textarea
          rows={4}
          required
          className={`${inputCls} resize-none`}
          value={f.deskripsi}
          onChange={(e) => set("deskripsi", e.target.value)}
        />
      </Field>
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
      </button>
    </form>
  );
}

function PendidikanForm({ db, initial, onSaved, notify }: any) {
  const [f, setF] = useState({
    universitas: initial?.universitas ?? "",
    jurusan: initial?.jurusan ?? "",
    tahun_mulai: initial?.tahun_mulai ?? 2023,
    tahun_selesai: initial?.tahun_selesai ?? 2027,
  });
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: any) => setF((p) => ({ ...p, [k]: v }));
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const payload = {
      ...f,
      tahun_mulai: +f.tahun_mulai,
      tahun_selesai: +f.tahun_selesai,
    };
    const { error } = initial
      ? await db.from("pendidikan").update(payload).eq("id", initial.id)
      : await db.from("pendidikan").insert(payload);
    setBusy(false);
    if (error) notify("error", error.message);
    else {
      notify("success", "Pendidikan tersimpan.");
      onSaved();
    }
  };
  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label="Universitas / Sekolah">
        <input
          required
          className={inputCls}
          value={f.universitas}
          onChange={(e) => set("universitas", e.target.value)}
        />
      </Field>
      <Field label="Jurusan">
        <input
          required
          className={inputCls}
          value={f.jurusan}
          onChange={(e) => set("jurusan", e.target.value)}
        />
      </Field>
      <div className="grid grid-cols-2 gap-4">
        <Field label="Tahun Mulai">
          <input
            type="number"
            required
            className={inputCls}
            value={f.tahun_mulai}
            onChange={(e) => set("tahun_mulai", e.target.value)}
          />
        </Field>
        <Field label="Tahun Selesai">
          <input
            type="number"
            required
            className={inputCls}
            value={f.tahun_selesai}
            onChange={(e) => set("tahun_selesai", e.target.value)}
          />
        </Field>
      </div>
      <button
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary py-3 text-sm font-semibold text-white disabled:opacity-60"
      >
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
      </button>
    </form>
  );
}

/* ---------------- overview / dashboard ---------------- */
function Overview({
  db,
  user,
  go,
}: {
  db: SupabaseClient | null;
  user: string;
  go: (t: Tab) => void;
}) {
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [recentProjek, setRecentProjek] = useState<Row[]>([]);
  const [recentPesan, setRecentPesan] = useState<Row[]>([]);

  useEffect(() => {
    if (!db) return;
    (async () => {
      const tables = [
        "projek",
        "sertifikat",
        "pengalaman",
        "pendidikan",
        "pesan",
      ];
      const res: Record<string, number> = {};
      await Promise.all(
        tables.map(async (t) => {
          const { count } = await db
            .from(t)
            .select("*", { count: "exact", head: true });
          res[t] = count ?? 0;
        }),
      );
      setCounts(res);
      const { data: p } = await db
        .from("projek")
        .select("*")
        .order("tanggal_selesai", { ascending: false })
        .limit(4);
      setRecentProjek(p ?? []);
      const { data: m } = await db
        .from("pesan")
        .select("*")
        .order("dibuat_pada", { ascending: false })
        .limit(3);
      setRecentPesan(m ?? []);
    })();
  }, [db]);

  const h = new Date().getHours();
  const greet =
    h < 11
      ? "Selamat pagi"
      : h < 15
        ? "Selamat siang"
        : h < 19
          ? "Selamat sore"
          : "Selamat malam";
  const name = (user.split("@")[0] || "Admin").replace(/[._]/g, " ");

  const stats = [
    {
      key: "projek",
      label: "Projek",
      icon: FolderKanban,
      cls: "text-primary bg-primary/10",
    },
    {
      key: "sertifikat",
      label: "Sertifikat",
      icon: Award,
      cls: "text-amber-500 bg-amber-500/10",
    },
    {
      key: "pengalaman",
      label: "Pengalaman",
      icon: Briefcase,
      cls: "text-secondary bg-secondary/10",
    },
    {
      key: "pendidikan",
      label: "Pendidikan",
      icon: GraduationCap,
      cls: "text-emerald-500 bg-emerald-500/10",
    },
    {
      key: "pesan",
      label: "Pesan",
      icon: Inbox,
      cls: "text-rose-500 bg-rose-500/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* sapaan */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-gray-200/70 bg-gradient-to-r from-primary/10 via-transparent to-secondary/10 p-6 dark:border-white/10"
      >
        <p className="font-mono text-xs uppercase tracking-widest text-gray-400">
          {new Date().toLocaleDateString("id-ID", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <h2 className="mt-2 text-2xl font-extrabold tracking-tight capitalize">
          {greet}, {name} 👋
        </h2>
        <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
          Berikut ringkasan konten portofolio kamu hari ini.
        </p>
      </motion.div>

      {/* stat cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {stats.map((s, i) => (
          <motion.button
            key={s.key}
            onClick={() => go(s.key as Tab)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.06 }}
            whileHover={{ y: -4 }}
            className="group rounded-2xl border border-gray-200/70 bg-white p-4 text-left transition-shadow hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03]"
          >
            <span
              className={`inline-flex h-9 w-9 items-center justify-center rounded-xl ${s.cls}`}
            >
              <s.icon className="h-4 w-4" />
            </span>
            <p className="mt-3 text-2xl font-extrabold">{counts[s.key] ?? 0}</p>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {s.label}
            </p>
          </motion.button>
        ))}
      </div>

      {/* panel terbaru */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-gray-200/70 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">Projek Terbaru</h3>
            <button
              onClick={() => go("projek")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Kelola <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentProjek.length === 0 && (
              <p className="py-6 text-center text-xs text-gray-400">
                Belum ada proyek.
              </p>
            )}
            {recentProjek.map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                {p.gambar && (
                  <img
                    src={p.gambar}
                    alt=""
                    className="h-10 w-14 rounded-lg object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{p.judul}</p>
                  <p className="font-mono text-[10px] text-gray-400">
                    {p.kategori} · {fmtDate(p.tanggal_selesai)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200/70 bg-white p-5 dark:border-white/10 dark:bg-white/[0.03]">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-bold">Pesan Terbaru</h3>
            <button
              onClick={() => go("pesan")}
              className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Kelola <ArrowRight className="h-3 w-3" />
            </button>
          </div>
          <div className="space-y-3">
            {recentPesan.length === 0 && (
              <p className="py-6 text-center text-xs text-gray-400">
                Belum ada pesan masuk.
              </p>
            )}
            {recentPesan.map((m) => (
              <div
                key={m.id}
                className="rounded-xl border border-gray-100 p-3 dark:border-white/5"
              >
                <p className="text-sm font-semibold">
                  {m.nama}{" "}
                  <span className="ml-1 font-mono text-[10px] font-normal text-gray-400">
                    {m.email}
                  </span>
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                  {m.pesan}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- main ---------------- */
const TABS: { id: Tab; label: string; icon: any; desc: string }[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: Gauge,
    desc: "Ringkasan konten portofolio kamu.",
  },
  {
    id: "projek",
    label: "Projek",
    icon: FolderKanban,
    desc: "Kelola kartu proyek di grid & halaman detail.",
  },
  {
    id: "sertifikat",
    label: "Sertifikat",
    icon: Award,
    desc: "Kelola sertifikat yang tampil di section & halaman sertifikat.",
  },
  {
    id: "pengalaman",
    label: "Pengalaman",
    icon: Briefcase,
    desc: "Kelola timeline pengalaman & organisasi.",
  },
  {
    id: "pendidikan",
    label: "Pendidikan",
    icon: GraduationCap,
    desc: "Kelola riwayat pendidikan di section About.",
  },
  {
    id: "pesan",
    label: "Pesan",
    icon: Inbox,
    desc: "Inbox pesan masuk dari form kontak.",
  },
];
const ORDER: Record<Tab, string> = {
  dashboard: "dibuat_pada",
  projek: "tanggal_selesai",
  sertifikat: "tanggal_terbit",
  pengalaman: "tanggal_mulai",
  pendidikan: "tahun_mulai",
  pesan: "dibuat_pada",
};
const FORMS: Record<Tab, any> = {
  dashboard: null,
  projek: ProjekForm,
  sertifikat: SertifikatForm,
  pengalaman: PengalamanForm,
  pendidikan: PendidikanForm,
  pesan: null,
};

export default function DashboardPage() {
  const router = useRouter();
  const db = useMemo(
    () => (envReady ? createBrowserClient(supabaseUrl, supabaseKey) : null),
    [],
  );
  const [user, setUser] = useState("");
  const [tab, setTab] = useState<Tab>("dashboard");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toast, setToast] = useState<{
    id: number;
    type: ToastType;
    message: string;
  } | null>(null);
  const toastSeq = useRef(0);
  const notify: Notify = (type, message) =>
    setToast({ id: ++toastSeq.current, type, message });

  useEffect(() => {
    db?.auth.getUser().then(({ data }) => setUser(data.user?.email ?? ""));
  }, [db]);

  const load = async () => {
    if (!db || tab === "dashboard") {
      setLoading(false);
      return;
    }
    setLoading(true);
    const { data } = await db
      .from(tab)
      .select("*")
      .order(ORDER[tab], { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [tab, db]);

  const remove = async (id: string) => {
    const { error } = await db!.from(tab).delete().eq("id", id);
    if (error) notify("error", error.message);
    else {
      notify("success", "Data dihapus.");
      load();
    }
  };
  const signOut = async () => {
    await db?.auth.signOut();
    router.push("/admin/login");
    router.refresh();
  };

  const active = TABS.find((t) => t.id === tab)!;
  const FormComp = FORMS[tab];
  const switchTab = (id: Tab) => {
    setTab(id);
    setEditing(null);
    setOpen(false);
    setMenuOpen(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a]">
      {/* SIDEBAR DESKTOP */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 flex-col border-r border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/80 lg:flex">
        <div className="flex h-16 items-center gap-3 border-b border-gray-200/70 px-6 dark:border-white/10">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
            <LayoutDashboard className="h-4 w-4" />
          </span>
          <div>
            <p className="text-sm font-bold leading-none">Admin Panel</p>
            <p className="mt-0.5 truncate font-mono text-[10px] text-gray-400">
              {user || "…"}
            </p>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="mb-3 px-2 font-mono text-[10px] uppercase tracking-widest text-gray-400">
            Menu
          </p>
          <div className="space-y-1.5">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`relative flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${tab === t.id ? "text-white" : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-white/5"}`}
              >
                {tab === t.id && (
                  <motion.span
                    layoutId="admNav"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <t.icon className="relative z-10 h-4 w-4" />
                <span className="relative z-10">{t.label}</span>
                {tab === t.id && (
                  <span className="relative z-10 ml-auto h-1.5 w-1.5 rounded-full bg-white/80" />
                )}
              </button>
            ))}
          </div>
        </nav>
        <div className="space-y-2 border-t border-gray-200/70 p-4 dark:border-white/10">
          <Link
            href="/"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-2.5 text-xs font-semibold transition hover:border-primary hover:text-primary dark:border-white/10"
          >
            <ExternalLink className="h-3.5 w-3.5" /> Lihat Situs
          </Link>
          <button
            onClick={signOut}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white"
          >
            <LogOut className="h-3.5 w-3.5" /> Keluar
          </button>
        </div>
      </aside>

      {/* DRAWER MOBILE */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
              onClick={() => setMenuOpen(false)}
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 340, damping: 32 }}
              className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white p-4 dark:bg-[#0a0a0a] lg:hidden"
            >
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
                    <LayoutDashboard className="h-4 w-4" />
                  </span>
                  <p className="text-sm font-bold">Admin Panel</p>
                </div>
                <button
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full p-2 text-gray-400"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => switchTab(t.id)}
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium ${tab === t.id ? "bg-gradient-to-r from-primary to-secondary text-white" : "text-gray-600 dark:text-gray-300"}`}
                  >
                    <t.icon className="h-4 w-4" /> {t.label}
                  </button>
                ))}
              </div>
              <div className="mt-auto space-y-2 pt-6">
                <Link
                  href="/"
                  className="flex w-full items-center justify-center gap-2 rounded-full border border-gray-300 py-2.5 text-xs font-semibold dark:border-white/10"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Lihat Situs
                </Link>
                <button
                  onClick={signOut}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-rose-500/10 py-2.5 text-xs font-semibold text-rose-500"
                >
                  <LogOut className="h-3.5 w-3.5" /> Keluar
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* KONTEN */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200/70 bg-white/80 px-5 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/80 lg:hidden">
          <div className="flex items-center gap-2.5">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary text-white">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <p className="text-sm font-bold">Admin Panel</p>
          </div>
          <button
            onClick={() => setMenuOpen(true)}
            className="rounded-full border border-gray-300 p-2 dark:border-white/10"
          >
            <Menu className="h-4 w-4" />
          </button>
        </header>

        <div className="mx-auto max-w-5xl px-6 pb-24 pt-10">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight md:text-3xl">
                {active.label}
              </h1>
              <p className="mt-1.5 text-sm text-gray-500 dark:text-gray-400">
                {active.desc}
              </p>
            </div>
            {FormComp && (
              <button
                onClick={() => {
                  setEditing(null);
                  setOpen(true);
                }}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
              >
                <Plus className="h-4 w-4" /> Tambah
              </button>
            )}
          </div>

          {tab === "dashboard" ? (
            <Overview db={db} user={user} go={switchTab} />
          ) : (
            <div className="space-y-3">
              {loading &&
                Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-20 animate-pulse rounded-2xl bg-gray-200 dark:bg-white/10"
                  />
                ))}
              {!loading && rows.length === 0 && (
                <div className="rounded-3xl border border-dashed border-gray-300 py-16 text-center text-sm text-gray-400 dark:border-white/10">
                  Belum ada data. Klik “Tambah”.
                </div>
              )}
              {!loading &&
                rows.map((r) => (
                  <motion.div
                    key={r.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center gap-4 rounded-2xl border border-gray-200/70 bg-white p-4 dark:border-white/10 dark:bg-white/[0.03]"
                  >
                    {(r.gambar || r.file_gambar) && (
                      <img
                        src={r.gambar || r.file_gambar}
                        alt=""
                        className="h-14 w-20 shrink-0 rounded-lg object-cover"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-bold">
                        {r.judul ||
                          r.nama_sertifikat ||
                          r.universitas ||
                          r.nama}
                      </p>
                      <p className="truncate font-mono text-[11px] text-gray-400">
                        {r.kategori && (
                          <span className="mr-2 text-primary">
                            {r.kategori}
                          </span>
                        )}
                        {r.penerbit && (
                          <span className="mr-2">{r.penerbit}</span>
                        )}
                        {r.jurusan && <span className="mr-2">{r.jurusan}</span>}
                        {r.email && <span className="mr-2">{r.email}</span>}
                        {fmtDate(
                          r.tanggal_selesai ||
                            r.tanggal_terbit ||
                            r.tanggal_mulai ||
                            r.dibuat_pada,
                        )}
                        {r.tahun_mulai &&
                          ` · ${r.tahun_mulai}–${r.tahun_selesai}`}
                      </p>
                      {tab === "pesan" && (
                        <p className="mt-1 line-clamp-2 text-xs text-gray-500">
                          {r.pesan}
                        </p>
                      )}
                    </div>
                    {FormComp && (
                      <button
                        onClick={() => {
                          setEditing(r);
                          setOpen(true);
                        }}
                        className="rounded-full p-2 text-gray-400 transition hover:bg-primary/10 hover:text-primary"
                      >
                        <Pencil className="h-4 w-4" />
                      </button>
                    )}
                    <Del onConfirm={() => remove(r.id)} />
                  </motion.div>
                ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        open={open && !!FormComp}
        onClose={() => setOpen(false)}
        title={editing ? `Edit ${tab}` : `Tambah ${tab}`}
      >
        {FormComp && (
          <FormComp
            db={db}
            initial={editing}
            notify={notify}
            onSaved={() => {
              setOpen(false);
              setEditing(null);
              load();
            }}
          />
        )}
      </Modal>

      <div className="pointer-events-none fixed bottom-6 right-6 z-[90] flex flex-col items-end gap-3">
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
    </main>
  );
}
