'use client'

import { useEffect, useMemo } from "react"
import {
  AlertCircle,
  CheckCircle2,
  Info,
  X,
} from "lucide-react"

export default function CustomAlert({
  text,
  timeout = 2000,
  onclose,
  type = "auto",
}) {
  // Auto close alert after timeout.
  useEffect(() => {
    if (!text || !onclose) return

    const timer = setTimeout(() => {
      onclose()
    }, timeout)

    return () => clearTimeout(timer)
  }, [text, timeout, onclose])

  // Detect alert type from text when type is not provided.
  const alertType = useMemo(() => {
    if (type !== "auto") return type

    const value = String(text || "").toLowerCase()

    if (
      value.includes("error") ||
      value.includes("failed") ||
      value.includes("cannot") ||
      value.includes("invalid")
    ) {
      return "error"
    }

    if (
      value.includes("success") ||
      value.includes("successfully") ||
      value.includes("done") ||
      value.includes("saved")
    ) {
      return "success"
    }

    return "info"
  }, [text, type])

  const alertConfig = {
    success: {
      icon: CheckCircle2,
      wrapper: "border-emerald-200 bg-emerald-50 text-emerald-800",
      iconBox: "bg-emerald-100 text-emerald-700",
      closeButton: "text-emerald-700 hover:bg-emerald-100",
    },
    error: {
      icon: AlertCircle,
      wrapper: "border-red-200 bg-red-50 text-red-800",
      iconBox: "bg-red-100 text-red-700",
      closeButton: "text-red-700 hover:bg-red-100",
    },
    info: {
      icon: Info,
      wrapper: "border-slate-200 bg-white text-slate-800",
      iconBox: "bg-slate-100 text-slate-700",
      closeButton: "text-slate-600 hover:bg-slate-100",
    },
  }

  if (!text) return null

  const config = alertConfig[alertType] || alertConfig.info
  const Icon = config.icon

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[9999] flex justify-center px-4 sm:bottom-8">
      <div
        className={`
          pointer-events-auto
          flex w-full max-w-md items-start gap-3
          rounded-3xl border px-4 py-3
          shadow-2xl shadow-slate-950/10
          backdrop-blur-xl
          transition-all
          ${config.wrapper}
        `}
      >
        <div
          className={`
            mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl
            ${config.iconBox}
          `}
        >
          <Icon size={18} />
        </div>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold leading-6">
            {text}
          </p>
        </div>

        {onclose && (
          <button
            type="button"
            onClick={onclose}
            className={`
              flex h-8 w-8 shrink-0 items-center justify-center rounded-xl transition
              ${config.closeButton}
            `}
            aria-label="Close alert"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  )
}