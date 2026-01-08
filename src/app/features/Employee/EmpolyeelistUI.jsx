'use client'

import { Pencil, Trash2, RotateCcw } from "lucide-react"

/* ===== helper render role badge ===== */
function RoleBadge({ role }) {
  const r = (role || "").toLowerCase()

  let className =
    "inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border"

  if (r === "admin")
    className += " bg-red-50 text-red-700 border-red-200"
  else if (r === "staff" || r === "employee")
    className += " bg-blue-50 text-blue-700 border-blue-200"
  else
    className += " bg-gray-100 text-gray-700 border-gray-200"

  return <span className={className}>{role || "N/A"}</span>
}

export default function EmployeelistUI({
  employees = [],
  onEdit,
  onDelete,
  onResetPassword,
}) {
  if (employees.length === 0) {
    return <p className="text-gray-500 font-medium">No employees</p>
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Name</th>
            <th className="px-4 py-3 text-left font-semibold">Email</th>
            <th className="px-4 py-3 text-left font-semibold">Role</th>
            <th className="px-4 py-3 text-center font-semibold w-36">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {employees.map((emp) => (
            <tr
              key={emp.id}
              className="
                group border-t
                hover:bg-gray-50
                transition
              "
            >
              <td className="px-4 py-3 font-medium text-gray-800">
                {emp.name}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {emp.email || "—"}
              </td>

              <td className="px-4 py-3">
                <RoleBadge role={emp.role} />
              </td>

              {/* Action – ẩn mềm */}
              <td className="px-4 py-3">
                <div
                  className="
                    flex justify-center gap-1
                    opacity-40 group-hover:opacity-100
                    transition
                  "
                >
                  <button
                    onClick={() => onEdit(emp)}
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    onClick={() => onResetPassword(emp)}
                    className="p-2 rounded-lg text-yellow-600 hover:bg-yellow-50 cursor-pointer"
                    title="Reset password"
                  >
                    <RotateCcw size={16} />
                  </button>

                  <button
                    onClick={() => onDelete(emp)}
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
