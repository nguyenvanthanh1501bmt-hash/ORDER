'use client'

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Save,
  Table2,
  X,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"

export default function UpdateTableModal({ open, onOpenChange, table }) {
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Fill form when selected table changes.
  useEffect(() => {
    if (table) {
      setName(table.name || "")
      setError("")
    }
  }, [table])

  // Close modal safely.
  const handleClose = () => {
    if (loading) return

    setError("")
    onOpenChange(false)
  }

  // Update selected table.
  const handleSubmit = async (event) => {
    event.preventDefault()

    const tableName = name.trim()

    if (!table?.id) {
      setError("Table ID is missing")
      return
    }

    if (!tableName) {
      setError("Table name is required")
      return
    }

    try {
      setLoading(true)
      setError("")

      const res = await authFetch(`/api/table?id=${table.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name: tableName,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setError(data.message || "Failed to update table")
        return
      }

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
        <div className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                <Table2 size={14} />
                Edit table
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Update Table
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Edit table name and information.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close update table modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <form
          id="update-table-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-white p-5 sm:p-6"
        >
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white text-slate-700 ring-1 ring-slate-200">
                  <Table2 size={22} />
                </div>

                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-900">
                    Current table
                  </p>

                  <p className="truncate text-xs text-slate-500">
                    ID #{table.id}
                  </p>
                </div>
              </div>
            </div>

            {/* Table name */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Table name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <Table2 size={18} className="shrink-0 text-slate-400" />

                <input
                  autoFocus
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="e.g. Table 01"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        </form>

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
              type="submit"
              form="update-table-form"
              disabled={loading || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <Save size={17} />
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}