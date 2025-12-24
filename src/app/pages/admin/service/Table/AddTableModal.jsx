'use client';

import { useState } from "react";
import { generateTableQRCode } from "./GenerateQRCode";

export default function AddTableModal({ open, onOpenChange }) {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const resetForm = () => {
    setName("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");

      const qr_code_id = generateTableQRCode({ id: Date.now(), name });

      const res = await fetch("/api/table/create-table", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tableName: name,
          qr_code_id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Lỗi tạo bàn");
        return;
      }

      resetForm();
      onOpenChange(false);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onOpenChange(false)}
    >
      <div
        className="bg-white p-6 rounded-lg w-96"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit}>
          <h1 className="text-xl font-semibold mb-4">Add Table</h1>

          <label className="block mb-1 text-sm font-medium">
            Table name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tên bàn"
            className="border p-2 w-full mb-3 rounded"
            required
          />

          {error && (
            <p className="text-red-500 text-sm mb-2">{error}</p>
          )}

          <div className="flex justify-end gap-2">
            <button
              type="button"
              className="bg-gray-200 px-4 py-2 rounded"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
            >
              Hủy
            </button>

            <button
              type="submit"
              className="bg-blue-600 text-white px-4 py-2 rounded"
              disabled={loading}
            >
              {loading ? "Đang tạo..." : "Tạo bàn"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
