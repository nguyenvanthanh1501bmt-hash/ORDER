'use client'

import { useEffect, useState } from "react"
import {
  AlertCircle,
  Mail,
  Save,
  Shield,
  User,
  X,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"

export default function UpdateEmployeeModal({ open, onOpenChange, Employee }) {
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [userId, setUserId] = useState("")
  const [err, setErr] = useState("")
  const [loading, setLoading] = useState(false)

  // Fill form when selected employee changes.
  useEffect(() => {
    if (Employee) {
      setEmail(Employee.email || "")
      setName(Employee.name || "")
      setRole(Employee.role || "")
      setUserId(Employee.user_id || "")
      setErr("")
    }
  }, [Employee])

  // Close modal safely.
  const handleClose = () => {
    if (loading) return

    setErr("")
    onOpenChange(false)
  }

  // Submit updated employee data.
  const handleSubmit = async (event) => {
    event.preventDefault()

    if (!Employee?.id) {
      setErr("Staff ID is missing")
      return
    }

    setLoading(true)
    setErr("")

    try {
      const res = await authFetch(`/api/admin?id=${Employee.id}`, {
        method: "PUT",
        body: JSON.stringify({
          name,
          role,
          email,
          user_id: userId,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        throw new Error(data.message || "Update failed")
      }

      onOpenChange(false)
    } catch (error) {
      setErr(error.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  if (!open || !Employee) return null

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4"
      onClick={handleClose}
    >
      <div
        className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/30 sm:rounded-3xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                <User size={14} />
                Edit employee
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Update Staff Information
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Update employee name, email, and role.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close update employee modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          id="update-employee-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-white p-5 sm:p-6"
        >
          <div className="space-y-4">
            {/* Full name */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Full name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <User size={18} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="Employee name"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Email
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <Mail size={18} className="shrink-0 text-slate-400" />

                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  placeholder="employee@example.com"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Role */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Role
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <Shield size={18} className="shrink-0 text-slate-400" />

                <select
                  value={role}
                  onChange={(event) => setRole(event.target.value)}
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none"
                  disabled={loading}
                  required
                >
                  <option value="">Select role</option>
                  <option value="admin">Admin</option>
                  <option value="staff">Staff</option>
                </select>
              </div>
            </div>

            {/* Error message */}
            {err && (
              <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <span>{err}</span>
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
              form="update-employee-form"
              disabled={loading || !name.trim()}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <Save size={17} />
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}