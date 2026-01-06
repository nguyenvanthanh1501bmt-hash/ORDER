'use client'

import { useState } from "react"

export default function ResetPasswordModal({ open, onOpenChange, employee }) {
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)

  const handleResetPassword = async () => {
    setLoading(true)
    setMessage(null)

    try {
      const res = await fetch('/api/admin/reset-password-staff', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: employee.email })
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Có lỗi xảy ra")

      setMessage(`Email reset password đã được gửi tới: ${employee.email}`)
    } catch (err) {
      setMessage(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg w-96">
        <h2 className="text-xl font-bold mb-4">Reset Password</h2>
        <p className="mb-4">Bạn có chắc muốn reset mật khẩu cho <span className="font-semibold">{employee.name}</span>?</p>

        {message && <p className="mb-4 text-center text-sm">{message}</p>}

        <div className="flex gap-2">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded"
            onClick={handleResetPassword}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Email"}
          </button>

          <button
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
