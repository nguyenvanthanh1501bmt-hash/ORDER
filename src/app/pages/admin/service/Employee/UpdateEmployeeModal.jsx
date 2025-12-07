'use client'
import { useState, useEffect } from "react"

export default function UpdateEmployeeModal({ open, onOpenChange, Employee }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [userId, setUserId] = useState("") // dùng user_id từ Supabase Auth
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (Employee) {
      setEmail(Employee.email)
      setName(Employee.name)
      setRole(Employee.role)
      setUserId(Employee.user_id) // quan trọng: user_id từ Auth
    }
  }, [Employee])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErr("")

    try {
      const res = await fetch('/api/admin/update-staff', {
        method: "PUT",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, role, email, user_id: userId }),
      })

      const data = await res.json()
      if (!res.ok) throw new Error(data.message || "Update failed")

      onOpenChange(false)
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <h1 className="text-xl font-bold">Update Staff</h1>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            className="border p-2 rounded"
            required
          />

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            className="border p-2 rounded"
            required
          />

          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-2 rounded"
            required
          >
            <option value="">--Chọn vai trò--</option>
            <option value="admin">Admin</option>
            <option value="staff">Staff</option>
          </select>

          {err && <p className="text-red-500">{err}</p>}

          <div className="flex gap-2 mt-2">
            <button
              type="submit"
              className="bg-blue-600 text-white px-3 py-1 rounded"
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>

            <button
              type="button"
              className="bg-gray-300 px-3 py-1 rounded"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
