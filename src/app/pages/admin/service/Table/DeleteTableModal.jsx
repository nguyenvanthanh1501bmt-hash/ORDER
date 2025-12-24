'use client'

import { useState } from "react"

export default function ConfirmDeleteTableModal({ open, onOpenChange, table, onDeleted }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  if (!open || !table) return null

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
        data = { message: "Server không trả JSON" }
      }

      if (!res.ok) {
        setError(data.message || "Xóa bàn thất bại")
        return
      }

      // gọi callback để refresh list
      if (onDeleted) onDeleted(table.id)

      // đóng modal
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Lỗi server")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white w-96 p-6 rounded-lg shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-3 text-red-600">
          Xác nhận xóa bàn
        </h2>

        <p className="text-sm text-gray-700 mb-4">
          Bạn có chắc muốn xóa bàn
          <span className="font-semibold"> “{table.name}”</span> không?
          <br />
          Hành động này không thể hoàn tác.
        </p>

        {error && <p className="text-sm text-red-500 mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Hủy
          </button>

          <button
            type="button"
            className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700 disabled:opacity-60 focus:outline-none focus:ring-2 focus:ring-red-500"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Đang xóa..." : "Xóa"}
          </button>
        </div>
      </div>
    </div>
  )
}
