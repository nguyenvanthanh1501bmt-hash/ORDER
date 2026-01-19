'use client'

import { Pencil, Trash2 } from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
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
              <td className="px-3 py-3 text-gray-500">
                #{t.id}
              </td>

              <td className="px-3 py-3 font-medium text-gray-800 wrap-break-words">
                {t.name}
              </td>

              <td className="px-3 py-3 text-gray-500">
                {formatDate(t.created_at)}
              </td>

              {/* QR CODE RENDER BY IMAGE */}
              <td className="px-3 py-3">
                {t.qr_code_id ? (
                  <div className="flex items-center gap-3">
                    <QRCodeCanvas
                      value={t.qr_code_id}
                      size={64}
                      level="M"
                    />
                    <span className="text-xs text-gray-500 break-all">
                      {t.qr_code_id}
                    </span>
                  </div>
                ) : (
                  '—'
                )}
              </td>

              {/* ACTION */}
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
