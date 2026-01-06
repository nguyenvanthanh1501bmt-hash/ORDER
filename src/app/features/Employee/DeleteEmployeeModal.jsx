'use client'

import { useState, useEffect } from "react"

export default function DeleteEmployeeModal({ open, onOpenChange, employee }) {
  const [user_id, setUserId] = useState("")
  const [loading, setLoading] = useState(false)
  const [err, setErr] = useState(null)

  useEffect(() => {
    if (employee) setUserId(employee.user_id)
  }, [employee])

  const handleDelete = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr(null)

    try {
      const res = await fetch('/api/admin/delete-staff', {
        method: "DELETE",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Lỗi xóa nhân viên")

      onOpenChange(false) // đóng modal sau khi xóa thành công
    } catch (error) {
      setErr(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h1 className="text-xl font-bold mb-4">Delete staff: {employee?.name}?</h1>

        {err && <p className="text-red-500 mb-2">{err}</p>}

        <div className="flex gap-2">
          <button
            type="button"
            className="bg-red-600 text-white px-4 py-2 rounded"
            onClick={handleDelete}
            disabled={loading}
          >
            {loading ? "Deleting..." : "Delete"}
          </button>

          <button
            type="button"
            className="bg-gray-300 px-4 py-2 rounded"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
