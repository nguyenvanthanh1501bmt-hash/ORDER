'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { formatDate } from '../helper'

export default function TablelistUI({ tables = [], onEdit, onDelete }) {
  if (tables.length === 0) {
    return <p className="font-semibold text-gray-500">No table</p>
  }

  return (
    <div className="rounded-xl border bg-white shadow-sm">
      <table className="w-full text-sm table-fixed">
        <thead className="bg-gray-50 text-gray-600">
          <tr>
            <th className="px-3 py-3 text-left w-12">ID</th>

            <th className="px-3 py-3 text-left w-[18%]">
              Table name
            </th>

            <th className="px-3 py-3 text-left w-[18%]">
              Created at
            </th>

            {/* ƯU TIÊN QR CODE */}
            <th className="px-3 py-3 text-left w-[34%]">
              QR code
            </th>

            <th className="px-3 py-3 text-center w-[18%]">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {tables.map(t => (
            <tr
              key={t.id}
              className="
                group border-t
                hover:bg-gray-50
                transition
              "
            >
              <td className="px-3 py-3 text-gray-500 wrap-break-words">
                #{t.id}
              </td>

              <td className="px-3 py-3 font-medium text-gray-800 wrap-break-words">
                {t.name}
              </td>

              <td className="px-3 py-3 text-gray-500 whitespace-normal">
                {formatDate(t.created_at)}
              </td>

              {/* QR code – KHÔNG BỊ BÓP */}
              <td className="px-3 py-3 text-gray-700 break-all">
                {t.qr_code_id || '—'}
              </td>

              {/* Action – có thể xuống dòng */}
              <td className="px-3 py-3">
                <div
                  className="
                    flex flex-wrap justify-center gap-1
                    opacity-40 group-hover:opacity-100
                    transition
                  "
                >
                  <button
                    className="p-2 rounded-lg text-blue-600 hover:bg-blue-50"
                    onClick={() => onEdit(t)}
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    className="p-2 rounded-lg text-red-600 hover:bg-red-50"
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
