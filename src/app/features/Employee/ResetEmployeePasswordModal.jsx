'use client'

import { useState } from "react"

export default function ResetPasswordModal({ open, onOpenChange, employee }) {
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleResetPassword = async () => {
    if (!employee?.id) {
      setError("Staff ID is missing")
      return
    }

    if (!password.trim()) {
      setError("Password is required")
      return
    }

    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch(`/api/admin/reset-password?id=${employee.id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        throw new Error(data.message || "Có lỗi xảy ra")
      }

      setMessage(`Đã reset mật khẩu cho ${employee.email}`)
      setPassword("")
    } catch (err) {
      setError(err.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !employee) return null

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
          <h2 className="text-lg font-semibold">
            Reset password
          </h2>
          <p className="text-sm text-gray-500">
            Đặt mật khẩu mới cho nhân viên
          </p>
        </div>

        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Reset mật khẩu cho
            <span className="font-semibold"> {employee.name}</span>
          </p>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="New password"
            className="w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />

          {message && (
            <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
              {message}
            </p>
          )}

          {error && (
            <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
              {error}
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
              onClick={handleResetPassword}
              disabled={loading || !password.trim()}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Saving..." : "Reset password"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}