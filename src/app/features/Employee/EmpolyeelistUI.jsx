'use client'

import {
  Mail,
  Pencil,
  RotateCcw,
  Shield,
  Trash2,
  User,
  Users,
} from "lucide-react"

/* Render employee role badge. */
function RoleBadge({ role }) {
  const normalizedRole = (role || "").toLowerCase()

  if (normalizedRole === "admin") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold text-red-700">
        <Shield size={13} />
        Admin
      </span>
    )
  }

  if (normalizedRole === "staff" || normalizedRole === "employee") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
        <User size={13} />
        {role || "Staff"}
      </span>
    )
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
      <User size={13} />
      {role || "N/A"}
    </span>
  )
}

/* Render circular avatar using the employee name. */
function EmployeeAvatar({ name }) {
  const firstLetter = name?.trim()?.charAt(0)?.toUpperCase() || "?"

  return (
    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-sm font-bold text-white shadow-sm">
      {firstLetter}
    </div>
  )
}

export default function EmployeelistUI({
  employees = [],
  onEdit,
  onDelete,
  onResetPassword,
}) {
  // Show empty state when there are no employees.
  if (employees.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <Users size={28} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No employees found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Employees will appear here after they are added to the system.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile card layout */}
      <div className="grid gap-4 md:hidden">
        {employees.map((emp) => (
          <div
            key={emp.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 items-center gap-3">
                  <EmployeeAvatar name={emp.name} />

                  <div className="min-w-0">
                    <h3 className="truncate text-base font-bold text-slate-900">
                      {emp.name || "Unnamed employee"}
                    </h3>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5 text-xs text-slate-500">
                      <Mail size={13} className="shrink-0" />
                      <span className="truncate">
                        {emp.email || "No email"}
                      </span>
                    </div>
                  </div>
                </div>

                <RoleBadge role={emp.role} />
              </div>
            </div>

            <div className="flex flex-wrap gap-2 p-4">
              <button
                type="button"
                onClick={() => onEdit(emp)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-blue-50 px-3 py-2.5 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <Pencil size={15} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onResetPassword(emp)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-amber-50 px-3 py-2.5 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
              >
                <RotateCcw size={15} />
                Reset
              </button>

              <button
                type="button"
                onClick={() => onDelete(emp)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl bg-red-50 px-3 py-2.5 text-xs font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={15} />
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Desktop table layout */}
      <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm md:block">
        <table className="w-full text-sm">
          <thead className="bg-slate-50 text-left text-xs font-bold uppercase tracking-wider text-slate-500">
            <tr>
              <th className="px-5 py-4">
                Employee
              </th>

              <th className="px-5 py-4">
                Email
              </th>

              <th className="px-5 py-4">
                Role
              </th>

              <th className="px-5 py-4 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {employees.map((emp) => (
              <tr
                key={emp.id}
                className="group transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <EmployeeAvatar name={emp.name} />

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {emp.name || "Unnamed employee"}
                      </p>
                      <p className="text-xs text-slate-500">
                        Staff account
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex min-w-0 items-center gap-2 text-slate-600">
                    <Mail size={16} className="shrink-0 text-slate-400" />
                    <span className="truncate">
                      {emp.email || "—"}
                    </span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <RoleBadge role={emp.role} />
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(emp)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onResetPassword(emp)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100"
                    >
                      <RotateCcw size={15} />
                      Reset
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(emp)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-red-50 px-3 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-100"
                    >
                      <Trash2 size={15} />
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}