'use client'

import { Pencil, Trash2 } from "lucide-react"
import { formatDate } from "../helper"

export default function TablelistUI({ tables = [], onEdit, onDelete }) {
  if (tables.length === 0) {
    return <p className="font-semibold text-gray-500">No table</p>
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
      <table className="w-full text-sm">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-4 py-3 text-left w-16">ID</th>
            <th className="px-4 py-3 text-left">Table name</th>
            <th className="px-4 py-3 text-left">Created at</th>
            <th className="px-4 py-3 text-left">QR code</th>
            <th className="px-4 py-3 text-center w-28">Action</th>
          </tr>
        </thead>

        <tbody>
          {tables.map((t, index) => (
            <tr
              key={t.id}
              className="
                group border-t
                hover:bg-gray-50
                transition
              "
            >
              <td className="px-4 py-3 text-gray-500">
                #{t.id}
              </td>

              <td className="px-4 py-3 font-medium text-gray-800">
                {t.name}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {formatDate(t.created_at)}
              </td>

              <td className="px-4 py-3 text-gray-500">
                {t.qr_code_id || '—'}
              </td>

              {/* Action – ẩn mềm */}
              <td className="px-4 py-3">
                <div className="
                  flex justify-center gap-1
                  opacity-40 group-hover:opacity-100
                  transition
                ">
                  <button
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50 cursor-pointer"
                    onClick={() => onEdit(t)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50 cursor-pointer"
                    onClick={() => onDelete(t)}
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
