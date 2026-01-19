'use client'

import { useState } from "react"

export default function ConfirmDeleteTableModal({ open, onOpenChange, table, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open || !table) return null

  // ============ HANDLER ===============
  const handleDelete = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await fetch("/api/table/delete-table", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tableId: table.id }),
      })

      let data
      try {
        data = await res.json()
      } catch {
        data = { message: "Invalid server response" }
      }

      if (!res.ok) {
        setError(data.message || "Failed to delete table")
        return
      }

      if (onDeleted) onDeleted(table.id)
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-red-600">
            Delete table
          </h2>
          <p className="text-sm text-gray-500">
            This action cannot be undone
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Are you sure you want to delete
            <span className="font-semibold"> “{table.name}”</span>?
          </p>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              className="rounded-lg border px-4 py-2 text-sm hover:bg-gray-50"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
              onClick={handleDelete}
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
