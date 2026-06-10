'use client'

import { useState } from "react"
import {
  AlertCircle,
  Lock,
  Mail,
  Shield,
  User,
  UserPlus,
  X,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"

export default function AddEmployeeModal({ open, onOpenChange }) {
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Reset form fields and error message.
  const resetForm = () => {
    setName("")
    setRole("")
    setEmail("")
    setPassword("")
    setError("")
  }

  // Close modal and reset form.
  const handleClose = () => {
    if (loading) return

    resetForm()
    onOpenChange(false)
  }

  // Submit new employee data to API.
  const handleSubmit = async (event) => {
    event.preventDefault()

    try {
      setLoading(true)
      setError("")

      const res = await authFetch("/api/admin", {
        method: "POST",
        body: JSON.stringify({
          name,
          role,
          email,
          password,
        }),
      })

      const data = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        setError(data.message || "Cannot create employee")
        return
      }

      resetForm()
      onOpenChange(false)
    } catch (err) {
      setError(err.message || "Server error")
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

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
                <UserPlus size={14} />
                New employee
              </div>

              <h2 className="text-xl font-extrabold tracking-tight">
                Add Staff Account
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Create a new account for restaurant staff or admin.
              </p>
            </div>

            <button
              type="button"
              onClick={handleClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close add employee modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto bg-white p-5 sm:p-6"
        >
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Name
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <User size={18} className="shrink-0 text-slate-400" />

                <input
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Employee name"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
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
                  <option value="">
                    Select role
                  </option>
                  <option value="admin">
                    Admin
                  </option>
                  <option value="staff">
                    Staff
                  </option>
                </select>
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
                  placeholder="employee@example.com"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Password
              </label>

              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <Lock size={18} className="shrink-0 text-slate-400" />

                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                  disabled={loading}
                  required
                />
              </div>
            </div>

            {/* Error message */}
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
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              onClick={handleSubmit}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <UserPlus size={17} />
              {loading ? "Creating..." : "Create"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}