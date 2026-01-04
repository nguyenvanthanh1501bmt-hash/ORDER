'use client';

import { Pencil, Trash2 } from "lucide-react";
import { formatDate } from "../../service/helper";

export default function TablelistUI({ tables = [], onEdit, onDelete }) {
  if (tables.length === 0) {
    return <p className="font-bold text-lg">No table</p>;
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm bg-white">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-3 text-left">ID</th>
            <th className="border px-4 py-3 text-left">Table name</th>
            <th className="border px-4 py-3 text-left">Created-at</th>
            <th className="border px-4 py-3 text-left">QR code</th>
            <th className="border px-4 py-3 text-center">Action</th>
          </tr>
        </thead>

        <tbody>
          {tables.map((t, index) => (
            <tr
              key={t.id}
              className={`hover:bg-gray-50 ${index % 2 === 1 ? "bg-gray-50/50" : ""}`}
            >
              <td className="border px-4 py-2">{t.id}</td>
              <td className="border px-4 py-2 font-medium">{t.name}</td>
              <td className="border px-4 py-2 text-gray-500">
                {formatDate(t.created_at)}
              </td>
              <td className="border px-4 py-2 text-gray-500">{t.qr_code_id || "-"}</td>
              <td className="border px-4 py-2">
                <div className="flex justify-center gap-3">
                  <button
                    className="p-2 rounded text-blue-600 hover:bg-blue-100"
                    onClick={() => onEdit(t)}
                  >
                    <Pencil size={16} />
                  </button>
                  <button
                    className="p-2 rounded text-red-600 hover:bg-red-100"
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
  );
}
