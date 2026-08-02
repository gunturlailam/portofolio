"use client";
import { motion } from "framer-motion";
import { Code2, Server, Wrench, Sparkles, Layers } from "lucide-react";
import type { LucideIcon } from "lucide-react";

/* ------------------------------------------------------------------ */
/*  Data                                                              */
/* ------------------------------------------------------------------ */
type GlyphKey = "react" | "tailwind" | "next" | "git" | "figma" | "vscode";
interface Skill {
  name: string;
  level: number;
  brand: string; // hex → dipakai untuk chrome (tint, border, bar, glow)
  glyph?: GlyphKey;
  mono?: string; // monogram kalau logo aslinya berbasis teks
}
interface Group {
  title: string;
  icon: LucideIcon;
  items: Skill[];
}

const GROUPS: Group[] = [
  {
    title: "Frontend",
    icon: Code2,
    items: [
      { name: "Next.js", level: 78, brand: "#000000", glyph: "next" },
      { name: "React", level: 82, brand: "#61DAFB", glyph: "react" },
      { name: "Tailwind CSS", level: 88, brand: "#06B6D4", glyph: "tailwind" },
      { name: "JavaScript", level: 84, brand: "#F7DF1E", mono: "JS" },
      { name: "TypeScript", level: 70, brand: "#3178C6", mono: "TS" },
      { name: "HTML5", level: 93, brand: "#E34F26", mono: "</>" },
      { name: "CSS3", level: 90, brand: "#1572B6", mono: "{ }" },
    ],
  },
  {
    title: "Backend",
    icon: Server,
    items: [
      { name: "PHP", level: 86, brand: "#777BB4", mono: "PHP" },
      { name: "MySQL", level: 80, brand: "#4479A1", mono: "SQL" },
      { name: "Node.js", level: 64, brand: "#339933", mono: "N" },
    ],
  },
  {
    title: "Tools & Design",
    icon: Wrench,
    items: [
      { name: "Git", level: 76, brand: "#F05032", glyph: "git" },
      { name: "VS Code", level: 90, brand: "#007ACC", glyph: "vscode" },
      { name: "Figma", level: 72, brand: "#A259FF", glyph: "figma" },
    ],
  },
];

const LEARNING = ["TypeScript", "Node.js"];
const TOTAL = GROUPS.reduce((n, g) => n + g.items.length, 0);

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */
const hexA = (hex: string, a: number) => {
  const h = hex.replace("#", "");
  const r = parseInt(h.slice(0, 2), 16);
  const g = parseInt(h.slice(2, 4), 16);
  const b = parseInt(h.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${a})`;
};

const ease = [0.22, 1, 0.36, 1] as const;

function TechMark({ skill }: { skill: Skill }) {
  const c = "h-6 w-6";
  switch (skill.glyph) {
    case "react":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.2"
        >
          <circle cx="12" cy="12" r="2.2" fill="currentColor" stroke="none" />
          <ellipse cx="12" cy="12" rx="9.5" ry="3.6" />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.6"
            transform="rotate(60 12 12)"
          />
          <ellipse
            cx="12"
            cy="12"
            rx="9.5"
            ry="3.6"
            transform="rotate(120 12 12)"
          />
        </svg>
      );
    case "tailwind":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M6 8.5q3-4.5 6 0t6 0" />
          <path d="M6 15.5q3-4.5 6 0t6 0" />
        </svg>
      );
    case "next":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M9.5 8.5v7M9.5 8.5l6 7.5" strokeLinecap="round" />
        </svg>
      );
    case "git":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <rect
            x="6.5"
            y="6.5"
            width="11"
            height="11"
            rx="2.2"
            transform="rotate(45 12 12)"
          />
          <circle cx="12" cy="8.3" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="12" cy="15.7" r="1.4" fill="currentColor" stroke="none" />
          <circle cx="8.3" cy="12" r="1.4" fill="currentColor" stroke="none" />
        </svg>
      );
    case "figma":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
        >
          <path d="M8.5 3H12v6H8.5a3 3 0 0 1 0-6z" />
          <path d="M12 3h3.5a3 3 0 0 1 0 6H12V3z" />
          <path d="M12 9h3.5a3 3 0 0 1 0 6H12V9z" />
          <circle cx="8.5" cy="12" r="3" />
          <path d="M8.5 15H12v3a3 3 0 1 1-3.5-3z" />
        </svg>
      );
    case "vscode":
      return (
        <svg
          viewBox="0 0 24 24"
          className={c}
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M9 8l-4 4 4 4M15 8l4 4-4 4" />
        </svg>
      );
    default:
      return (
        <span className="font-mono text-[13px] font-extrabold leading-none tracking-tight">
          {skill.mono}
        </span>
      );
  }
}

/* ------------------------------------------------------------------ */
/*  Section                                                           */
/* ------------------------------------------------------------------ */
export default function Skills() {
  return (
    <section
      id="skills"
      className="relative scroll-mt-24 overflow-hidden py-24 md:py-32"
    >
      {/* ambient: blueprint grid + scanline bergerak (variasi, bukan blob) */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808014_1px,transparent_1px),linear-gradient(to_bottom,#80808014_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_40%,#000_30%,transparent_80%)]" />
        <motion.div
          className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-secondary/50 to-transparent"
          initial={{ top: "-5%" }}
          animate={{ top: "105%" }}
          transition={{ duration: 7, repeat: Infinity, ease: "linear" }}
        />
      </div>

      <div className="mx-auto max-w-6xl px-6">
        {/* header */}
        <motion.div
          className="mb-16 max-w-2xl"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease }}
        >
          <div className="mb-5 flex items-center gap-3">
            <span className="h-px w-10 bg-gradient-to-r from-primary to-secondary" />
            <span className="font-mono text-xs uppercase tracking-[0.3em] text-primary">
              Keahlian
            </span>
          </div>
          <h2 className="text-4xl font-extrabold leading-[1.1] tracking-tight md:text-5xl">
            Tech stack yang saya{" "}
            <span className="bg-[linear-gradient(transparent_58%,rgba(6,182,212,0.30)_58%)] px-1">
              andalkan
            </span>
          </h2>
          <p className="mt-5 text-[15px] leading-relaxed text-gray-600 dark:text-gray-400">
            Bukan sekadar daftar — tiap teknologi di bawah punya bobot kemahiran
            yang saya ukur jujur dari proyek nyata. Dari fondasi PHP & MySQL
            sampai lapisan modern Next.js.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-xs font-semibold text-primary">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-primary" />
              </span>
              Sedang dipelajari: {LEARNING.join(" & ")}
            </span>
            <span className="inline-flex items-center gap-1.5 font-mono text-xs text-gray-400">
              <Layers className="h-3.5 w-3.5 text-secondary" />
              {TOTAL} teknologi · {GROUPS.length} kategori
            </span>
          </div>
        </motion.div>

        {/* per kategori: header samping + grid tile (asimetris, bukan baris kartu rata) */}
        <div className="space-y-14">
          {GROUPS.map((group, gi) => (
            <motion.div
              key={group.title}
              className="grid grid-cols-1 gap-6 md:grid-cols-12 md:gap-10"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: gi * 0.05, ease }}
            >
              {/* header kategori */}
              <div className="md:col-span-3">
                <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-gray-200 bg-white/70 text-primary shadow-sm dark:border-white/10 dark:bg-white/[0.04]">
                    <group.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold tracking-tight">
                      {group.title}
                    </h3>
                    <p className="font-mono text-xs text-gray-400">
                      {group.items.length} stack
                    </p>
                  </div>
                </div>
                <div className="mt-4 hidden h-px w-full bg-gradient-to-r from-gray-200 to-transparent dark:from-white/10 md:block" />
              </div>

              {/* tiles */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:col-span-9">
                {group.items.map((skill, i) => (
                  <motion.div
                    key={skill.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.45, delay: i * 0.05, ease }}
                    whileHover={{ y: -4 }}
                    className="group relative overflow-hidden rounded-2xl border border-gray-200/70 bg-white/60 p-5 backdrop-blur transition-colors duration-300 hover:border-gray-300 hover:shadow-lg dark:border-white/10 dark:bg-white/[0.03] dark:hover:border-white/20"
                  >
                    {/* brand glow on hover */}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 blur-md transition-opacity duration-500 group-hover:opacity-25"
                      style={{ backgroundColor: skill.brand }}
                    />
                    <div className="relative">
                      <div className="flex items-start justify-between">
                        <div
                          className="flex h-12 w-12 items-center justify-center rounded-xl border text-foreground transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-110"
                          style={{
                            backgroundColor: hexA(skill.brand, 0.12),
                            borderColor: hexA(skill.brand, 0.32),
                          }}
                        >
                          <TechMark skill={skill} />
                        </div>
                        <span className="font-mono text-[10px] font-medium text-gray-400">
                          {skill.level}%
                        </span>
                      </div>

                      <p className="mt-3.5 text-sm font-semibold text-foreground">
                        {skill.name}
                      </p>

                      {/* proficiency bar */}
                      <div className="mt-2.5 h-1.5 w-full overflow-hidden rounded-full bg-gray-200/80 dark:bg-white/10">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: skill.brand }}
                          initial={{ width: 0 }}
                          whileInView={{ width: `${skill.level}%` }}
                          viewport={{ once: true, amount: 0.5 }}
                          transition={{
                            duration: 0.9,
                            delay: 0.15 + i * 0.05,
                            ease,
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-14 flex items-center gap-2 font-mono text-xs text-gray-400"
        >
          <Sparkles className="h-3.5 w-3.5 text-secondary" />
          Kemahiran diukur dari kontribusi proyek nyata, bukan klaim.
        </motion.p>
      </div>
    </section>
  );
}
