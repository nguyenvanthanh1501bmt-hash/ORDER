'use client'

import { useState } from "react"
import {
  AlertCircle,
  AlertTriangle,
  Table2,
  Trash2,
  X,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"

export default function ConfirmDeleteTableModal({
  open,
  onOpenChange,
  table,
  onDeleted,
}) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Close modal safely.
  const handleClose = () => {
    if (loading) return

    setError("")
    onOpenChange(false)
  }

  // Delete selected table.
  const handleDelete = async () => {
    if (!table?.id) {
      setError("Table ID is missing")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await authFetch(`/api/table?id=${table.id}`, {
        method: "DELETE",
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setError(data.message || "Failed to delete table")
        return
      }

      onDeleted?.(table.id)
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !table) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/30 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-red-100 bg-red-600 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-semibold text-white ring-1 ring-white/20">
                <AlertTriangle size={14} />
                Danger action
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Delete Table
              </h2>

              <p className="mt-1 text-xs text-red-100">
                This action cannot be undone.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white transition hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close delete table modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4 p-5 sm:p-6">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                <Table2 size={22} />
              </div>

              <div className="min-w-0">
                <p className="text-sm font-bold text-slate-900">
                  Table {table.name || table.id}
                </p>

                <p className="truncate text-xs text-slate-500">
                  ID #{table.id}
                </p>
              </div>
            </div>
          </div>

          <p className="text-sm leading-6 text-slate-600">
            Are you sure you want to delete this table? Its QR code will no longer be used for ordering.
          </p>

          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
              <AlertCircle size={18} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleDelete}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-red-300"
            >
              <Trash2 size={17} />
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}