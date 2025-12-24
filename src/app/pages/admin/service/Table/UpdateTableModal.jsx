'use client';

import { useEffect, useState } from "react";

export default function UpdateTableModal({ open, onOpenChange, table }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (table) {
      setName(table.name || "");
      setError("");
    }
  }, [table]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const res = await fetch("/api/table/update-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableId: table.id,
          tableName: name,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Lỗi cập nhật bàn");
        return;
      }

      onOpenChange(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open || !table) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white p-6 rounded-lg w-96 shadow"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold mb-4">Update Table</h1>

          <label className="block mb-1 text-sm font-medium">
            Table name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="border p-2 w-full mb-4 rounded focus:ring-2 focus:ring-blue-500"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-3">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => onOpenChange(false)}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Đang lưu..." : "Lưu"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
