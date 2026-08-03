"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { createBrowserClient, type SupabaseClient } from "@supabase/ssr";
import { supabaseUrl, supabaseKey, envReady } from "@/lib/supabaseClient";
import Toast, { type ToastType } from "@/components/Toast";
import {
  LayoutDashboard,
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
} from "lucide-react";

type Tab = "projek" | "sertifikat" | "pengalaman" | "pendidikan" | "pesan";
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
  const { data } = await db
    .from("projek")
    .select("id,slug")
    .ilike("slug", `${base}%`);
  const taken = new Set(
    (data ?? []).filter((r: any) => r.id !== exceptId).map((r: any) => r.slug),
  );
  if (!taken.has(base)) return base;
  let i = 2;
  while (taken.has(`${base}-${i}`)) i++;
  return `${base}-${i}`;
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
}: {
  db: SupabaseClient;
  value: string;
  onChange: (v: string) => void;
  folder: string;
  notify: Notify;
}) {
  const [busy, setBusy] = useState(false);
  const ref = useRef<HTMLInputElement>(null);
  const pick = async (f: File) => {
    setBusy(true);
    const path = `${folder}/${Date.now()}-${f.name.replace(/\s+/g, "-")}`;
    const { error } = await db.storage.from("portofolio").upload(path, f);
    if (error) notify("error", "Upload gagal: " + error.message);
    else {
      const { data } = db.storage.from("portofolio").getPublicUrl(path);
      onChange(data.publicUrl);
      notify("success", "Gambar terupload ke Storage.");
    }
    setBusy(false);
  };
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-100 dark:border-white/10 dark:bg-white/5">
        {value ? (
          <img
            src={value}
            alt="preview"
            className="h-full w-full object-cover"
          />
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
          {value ? "Ganti Gambar" : "Upload Gambar"}
        </button>
        <p className="font-mono text-[10px] text-gray-400">
          → bucket `portofolio`
        </p>
      </div>
      <input
        ref={ref}
        type="file"
        accept="image/*"
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
    setBusy(true);
    const slug = await makeUniqueSlug(db, slugify(f.judul), initial?.id);
    const payload = { ...f, tanggal_selesai: f.tanggal_selesai || null, slug };
    const { error } = initial
      ? await db.from("projek").update(payload).eq("id", initial.id)
      : await db.from("projek").insert(payload);
    setBusy(false);
    if (error) notify("error", error.message);
    else {
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
          <input
            list="katlist"
            className={inputCls}
            value={f.kategori}
            onChange={(e) => set("kategori", e.target.value)}
          />
          <datalist id="katlist">
            <option value="Web" />
            <option value="Mobile" />
            <option value="Design" />
          </datalist>
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
        {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Simpan
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
      <Field label="Gambar">
        <ImgUpload
          db={db}
          folder="sertifikat"
          value={f.file_gambar}
          onChange={(v) => set("file_gambar", v)}
          notify={notify}
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

/* ---------------- main ---------------- */
const TABS: { id: Tab; label: string; icon: any }[] = [
  { id: "projek", label: "Projek", icon: FolderKanban },
  { id: "sertifikat", label: "Sertifikat", icon: Award },
  { id: "pengalaman", label: "Pengalaman", icon: Briefcase },
  { id: "pendidikan", label: "Pendidikan", icon: GraduationCap },
  { id: "pesan", label: "Pesan", icon: Inbox },
];
const ORDER: Record<Tab, string> = {
  projek: "tanggal_selesai",
  sertifikat: "tanggal_terbit",
  pengalaman: "tanggal_mulai",
  pendidikan: "tahun_mulai",
  pesan: "dibuat_pada",
};

export default function DashboardPage() {
  const router = useRouter();
  const db = useMemo(
    () => (envReady ? createBrowserClient(supabaseUrl, supabaseKey) : null),
    [],
  );
  const [user, setUser] = useState("");
  const [tab, setTab] = useState<Tab>("projek");
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [toast, setToast] = useState<{
    id: number;
    type: ToastType;
    message: string;
  } | null>(null);
  const notify: Notify = (type, message) =>
    setToast({ id: Date.now(), type, message });

  useEffect(() => {
    db?.auth.getUser().then(({ data }) => setUser(data.user?.email ?? ""));
  }, [db]);

  const load = async () => {
    if (!db) return;
    setLoading(true);
    const { data } = await db
      .from(tab)
      .select("*")
      .order(ORDER[tab], { ascending: false });
    setRows(data ?? []);
    setLoading(false);
  };
  useEffect(() => {
    load(); /* eslint-disable-next-line */
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

  const FORMS: Record<Tab, any> = {
    projek: ProjekForm,
    sertifikat: SertifikatForm,
    pengalaman: PengalamanForm,
    pendidikan: PendidikanForm,
    pesan: null,
  };
  const FormComp = FORMS[tab];

  return (
    <main className="min-h-screen bg-gray-50 pb-24 dark:bg-[#0a0a0a]">
      {/* header */}
      <header className="sticky top-0 z-40 border-b border-gray-200/70 bg-white/80 backdrop-blur-xl dark:border-white/10 dark:bg-[#0a0a0a]/80">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-secondary text-white">
              <LayoutDashboard className="h-4 w-4" />
            </span>
            <div>
              <p className="text-sm font-bold leading-none">Admin Panel</p>
              <p className="font-mono text-[10px] text-gray-400">
                {user || "…"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-4 py-2 text-xs font-semibold transition hover:border-primary hover:text-primary dark:border-white/10"
            >
              <ExternalLink className="h-3.5 w-3.5" /> Lihat Situs
            </Link>
            <button
              onClick={signOut}
              className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-4 py-2 text-xs font-semibold text-rose-500 transition hover:bg-rose-500 hover:text-white"
            >
              <LogOut className="h-3.5 w-3.5" /> Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* tabs */}
        <div className="mb-8 flex flex-wrap gap-2">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setTab(t.id);
                setEditing(null);
                setOpen(false);
              }}
              className="relative rounded-full px-4 py-2 text-sm font-medium"
            >
              {tab === t.id && (
                <motion.span
                  layoutId="admTab"
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-primary to-secondary shadow-lg shadow-primary/30"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span
                className={`relative z-10 inline-flex items-center gap-2 ${tab === t.id ? "text-white" : "text-gray-600 dark:text-gray-300"}`}
              >
                <t.icon className="h-4 w-4" />
                {t.label}
              </span>
            </button>
          ))}
        </div>

        {/* toolbar */}
        {FormComp && (
          <div className="mb-5 flex items-center justify-between">
            <p className="font-mono text-xs text-gray-400">
              {rows.length} baris
            </p>
            <button
              onClick={() => {
                setEditing(null);
                setOpen(true);
              }}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5"
            >
              <Plus className="h-4 w-4" /> Tambah
            </button>
          </div>
        )}

        {/* list */}
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
              Belum ada data. Klik "Tambah".
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
                    {r.judul || r.nama_sertifikat || r.universitas || r.nama}
                  </p>
                  <p className="truncate font-mono text-[11px] text-gray-400">
                    {r.kategori && (
                      <span className="mr-2 text-primary">{r.kategori}</span>
                    )}
                    {r.penerbit && <span className="mr-2">{r.penerbit}</span>}
                    {r.jurusan && <span className="mr-2">{r.jurusan}</span>}
                    {r.email && <span className="mr-2">{r.email}</span>}
                    {fmtDate(
                      r.tanggal_selesai ||
                        r.tanggal_terbit ||
                        r.tanggal_mulai ||
                        r.dibuat_pada,
                    )}
                    {r.tahun_mulai && ` · ${r.tahun_mulai}–${r.tahun_selesai}`}
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
      </div>

      {/* modal form */}
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

      {/* toast */}
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
