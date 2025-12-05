'use client';

import { useState } from "react";

export default function AddFoodModal({ open, onOpenChange }) {
    const [name, setName] = useState("");
    const [price, setPrice] = useState("");
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");
    const [options, setOptions] = useState([]);
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setName("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setOptions([]);
        setImageUrl("");
        setError("");
    };

    const handleImageUpload = async (file) => {
        if (!file) return;

        try {
            setLoading(true);

            // sanitize tên file: bỏ dấu, thay khoảng trắng, loại ký tự đặc biệt
            const sanitizeFileName = (name) =>
            name
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .replace(/\s+/g, "_")
                .replace(/[^a-zA-Z0-9._-]/g, "");

            const sanitizedFile = new File(
                [file],
                `${Date.now()}-${sanitizeFileName(file.name)}`,
                { type: file.type }
            );

            const formData = new FormData();
            formData.append("file", sanitizedFile);

            const res = await fetch("/api/menu/upload-image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            // Lưu public URL vào state
            setImageUrl(data.url);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (!name || !price) {
            setError("Tên món và giá là bắt buộc");
            return;
        }

        try {
            setLoading(true);

            const res = await fetch("/api/menu_items/create-menu_items", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                name,
                price: Number(price),
                category,
                sub_category: subCategory,
                options,
                image_url: imageUrl,
                }),
            });

            const data = await res.json();
            if (!res.ok) {
                setError(data.message || "Có lỗi xảy ra");
                return;
            }

            resetForm();
            onOpenChange(false);

        } catch {
        setError("Không thể kết nối server");
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
            className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
            onClick={(e) => e.stopPropagation()}
        >
            <h2 className="text-xl font-semibold mb-4">Thêm món ăn</h2>

            <form onSubmit={handleSubmit} className="space-y-3">
                <input
                    type="text" placeholder="Tên món *"
                    value={name} onChange={e => setName(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="number" placeholder="Giá (VND) *"
                    value={price} onChange={e => setPrice(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text" placeholder="Danh mục"
                    value={category} onChange={e => setCategory(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text" placeholder="Mô tả (sub_category)"
                    value={subCategory} onChange={e => setSubCategory(e.target.value)}
                    className="w-full border rounded px-3 py-2"
                />
                <input
                    type="text" placeholder='OPTION JSON example: ["Size S","Size M","Size L"]'
                    onChange={e => {
                    try { setOptions(JSON.parse(e.target.value)); }
                    catch { setOptions([]); }
                    }}
                    className="w-full border rounded px-3 py-2"
                />

                <input
                    type="file"
                    accept="image/*"
                    onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                />

                {error && <p className="text-red-600">{error}</p>}

                <div className="flex justify-end gap-2 pt-2">
                    <button type="button" className="px-4 py-2 bg-gray-200 rounded" onClick={() => { resetForm(); onOpenChange(false); }} disabled={loading}>Hủy</button>
                    <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60" disabled={loading}>{loading ? "Đang lưu..." : "Lưu"}</button>
                </div>
            </form>
        </div>
        </div>
    );
}
