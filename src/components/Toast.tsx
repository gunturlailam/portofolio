"use client";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, X } from "lucide-react";

export type ToastType = "success" | "error";

interface Props {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  type,
  message,
  onClose,
  duration = 4500,
}: Props) {
  const isSuccess = type === "success";

  return (
    <motion.div
      initial={{ opacity: 0, y: 28, scale: 0.94 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 12, scale: 0.94 }}
      transition={{ type: "spring", stiffness: 380, damping: 28 }}
      className={`pointer-events-auto relative w-[min(92vw,22rem)] overflow-hidden rounded-2xl border bg-white/90 shadow-2xl backdrop-blur dark:bg-[#111113]/90 ${
        isSuccess ? "border-emerald-500/30" : "border-rose-500/30"
      }`}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3 p-4">
        <span
          className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isSuccess
              ? "bg-emerald-500/15 text-emerald-500"
              : "bg-rose-500/15 text-rose-500"
          }`}
        >
          {isSuccess ? (
            <CheckCircle2 className="h-4.5 w-4.5" />
          ) : (
            <AlertCircle className="h-4.5 w-4.5" />
          )}
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground">
            {isSuccess ? "Berhasil!" : "Ups, gagal!"}
          </p>
          <p className="mt-0.5 text-[13px] leading-relaxed text-gray-600 dark:text-gray-400">
            {message}
          </p>
        </div>
        <button
          onClick={onClose}
          aria-label="Tutup notifikasi"
          className="rounded-full p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-foreground dark:hover:bg-white/10"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* progress bar auto-dismiss */}
      <motion.div
        initial={{ width: "100%" }}
        animate={{ width: "0%" }}
        transition={{ duration: duration / 1000, ease: "linear" }}
        onAnimationComplete={onClose}
        className={`absolute bottom-0 left-0 h-0.5 ${isSuccess ? "bg-emerald-500" : "bg-rose-500"}`}
      />
    </motion.div>
  );
}
