'use client'

import {
  CalendarDays,
  Hash,
  Pencil,
  QrCode,
  Trash2,
  UtensilsCrossed,
} from 'lucide-react'
import { QRCodeCanvas } from 'qrcode.react'
import { formatDate } from '../helper'

export default function TablelistUI({ tables = [], onEdit, onDelete }) {
  // Show empty state when there are no tables.
  if (tables.length === 0) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <UtensilsCrossed size={28} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No tables found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Tables will appear here after they are added to the system.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Mobile card layout */}
      <div className="grid gap-4 md:hidden">
        {tables.map((table) => (
          <div
            key={table.id}
            className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md"
          >
            <div className="border-b border-slate-100 bg-slate-50 p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-slate-900 px-2.5 py-1 text-xs font-semibold text-white">
                    <Hash size={12} />
                    {table.id}
                  </div>

                  <h3 className="truncate text-lg font-bold text-slate-900">
                    {table.name}
                  </h3>

                  <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays size={13} />
                    {formatDate(table.created_at)}
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEdit(table)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition hover:bg-blue-100"
                    aria-label="Edit table"
                  >
                    <Pencil size={16} />
                  </button>

                  <button
                    type="button"
                    onClick={() => onDelete(table)}
                    className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-50 text-red-600 transition hover:bg-red-100"
                    aria-label="Delete table"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-4">
              {table.qr_code_id ? (
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4">
                  <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
                    <QRCodeCanvas
                      value={table.qr_code_id}
                      size={72}
                      level="M"
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1 flex items-center gap-1.5 text-sm font-semibold text-slate-900">
                      <QrCode size={15} />
                      QR Code
                    </div>

                    <p className="break-all text-xs leading-5 text-slate-500">
                      {table.qr_code_id}
                    </p>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-500">
                  No QR code available
                </div>
              )}
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
                ID
              </th>

              <th className="px-5 py-4">
                Table name
              </th>

              <th className="px-5 py-4">
                Created at
              </th>

              <th className="px-5 py-4">
                QR code
              </th>

              <th className="px-5 py-4 text-right">
                Action
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-100">
            {tables.map((table) => (
              <tr
                key={table.id}
                className="group transition hover:bg-slate-50"
              >
                <td className="px-5 py-4">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700">
                    <Hash size={12} />
                    {table.id}
                  </span>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <UtensilsCrossed size={17} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate font-semibold text-slate-900">
                        {table.name}
                      </p>
                      <p className="text-xs text-slate-500">
                        Restaurant table
                      </p>
                    </div>
                  </div>
                </td>

                <td className="px-5 py-4">
                  <div className="flex items-center gap-2 text-slate-600">
                    <CalendarDays size={16} className="text-slate-400" />
                    <span>{formatDate(table.created_at)}</span>
                  </div>
                </td>

                <td className="px-5 py-4">
                  {table.qr_code_id ? (
                    <div className="flex max-w-md items-center gap-3">
                      <div className="shrink-0 rounded-2xl bg-white p-2 shadow-sm ring-1 ring-slate-200">
                        <QRCodeCanvas
                          value={table.qr_code_id}
                          size={58}
                          level="M"
                        />
                      </div>

                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-slate-700">
                          <QrCode size={13} />
                          QR value
                        </div>

                        <p className="line-clamp-2 break-all text-xs leading-5 text-slate-500">
                          {table.qr_code_id}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                      No QR code
                    </span>
                  )}
                </td>

                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => onEdit(table)}
                      className="inline-flex items-center gap-2 rounded-2xl bg-blue-50 px-3 py-2 text-xs font-semibold text-blue-600 transition hover:bg-blue-100"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => onDelete(table)}
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