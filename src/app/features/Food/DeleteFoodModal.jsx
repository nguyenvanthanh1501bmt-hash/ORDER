'use client'

import { useState } from "react"

export default function DeleteFoodModal({ open, onOpenChange, food }) {
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  const handleDelete = async () => {
    if (!food?.id) {
      setErr("Missing food ID")
      return
    }

    setLoading(true)
    setErr(null)

    try {
      const res = await fetch(`/api/menu_items?id=${food.id}`, {
        method: "DELETE",
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        throw new Error(data.message || "Delete failed")
      }

      onOpenChange(false)
    } catch (error) {
      setErr(error.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !food) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b px-6 py-4">
          <h2 className="text-lg font-semibold text-red-600">
            Delete food item
          </h2>
          <p className="text-sm text-gray-500">
            Hành động này không thể hoàn tác
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Bạn có chắc chắn muốn xóa món
            <span className="font-semibold"> {food.name}</span> không?
          </p>

          {err && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {err}
            </p>
          )}

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
              onClick={handleDelete}
              disabled={loading}
              className="rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-60"
            >
              {loading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}