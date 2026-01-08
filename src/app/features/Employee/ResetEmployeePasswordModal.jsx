'use client'

import { useState } from "react"

export default function ResetPasswordModal({ open, onOpenChange, employee }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [error, setError] = useState(null)

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage(null)
    setError(null)

    try {
      const res = await fetch('/api/admin/reset-password-staff', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employee.email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra")

      setMessage(`Email reset password đã được gửi tới ${employee.email}`)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

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
          <h2 className="text-lg font-semibold">
            Reset password
          </h2>
          <p className="text-sm text-gray-500">
            Một email reset mật khẩu sẽ được gửi đi
          </p>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          <p className="text-sm text-gray-700">
            Bạn có chắc chắn muốn reset mật khẩu cho
            <span className="font-semibold"> {employee?.name}</span>?
          </p>

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
              onClick={handleResetPassword}
              disabled={loading}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {loading ? "Sending..." : "Send reset email"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
