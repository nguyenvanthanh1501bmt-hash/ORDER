'use client';

import { useState } from "react";

export default function AddFoodModal({ open, onOpenChange }) {
    // ===== State quản lý form =====
    const [name, setName] = useState("");             // Tên món
    const [price, setPrice] = useState("");           // Giá món
    const [category, setCategory] = useState("");     // Danh mục
    const [subCategory, setSubCategory] = useState(""); // Mô tả/sub-category
    const [options, setOptions] = useState([]);      // Options dạng array
    const [imageUrl, setImageUrl] = useState("");    // URL ảnh upload
    const [loading, setLoading] = useState(false);   // trạng thái loading
    const [error, setError] = useState("");          // lỗi hiển thị

    // ===== Hàm reset form =====
    const resetForm = () => {
        setName("");
        setPrice("");
        setCategory("");
        setSubCategory("");
        setOptions([]);
        setImageUrl("");
        setError("");
    };

    // ===== Hàm upload ảnh =====
    const handleImageUpload = async (file) => {
        if (!file) return;

        try {
            setLoading(true);

            // sanitize tên file: loại bỏ dấu, ký tự đặc biệt, khoảng trắng
            const sanitizeFileName = (name) =>
                name
                    .normalize("NFD")                       // tách dấu tiếng Việt
                    .replace(/[\u0300-\u036f]/g, "")       // bỏ dấu
                    .replace(/\s+/g, "_")                  // thay khoảng trắng bằng _
                    .replace(/[^a-zA-Z0-9._-]/g, "");     // loại ký tự đặc biệt

            // tạo file mới với tên đã sanitize
            const sanitizedFile = new File(
                [file],
                `${Date.now()}-${sanitizeFileName(file.name)}`,
                { type: file.type }
            );

            const formData = new FormData();
            formData.append("file", sanitizedFile);

            // gọi API upload ảnh
            const res = await fetch("/api/menu/upload-image", {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!res.ok) throw new Error(data.error || "Upload failed");

            // lưu URL public trả về vào state
            setImageUrl(data.url);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // ===== Hàm submit form =====
    const handleSubmit = async (e) => {
        e.preventDefault();   // ngăn reload trang
        setError("");

        // kiểm tra bắt buộc: tên, giá và danh mục
        if (!name || !price || !category) {
            setError("Tên món, giá và danh mục là bắt buộc");
            return;
        }

        try {
            setLoading(true);

            // gọi API tạo món mới
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

            // reset form và đóng modal
            resetForm();
            onOpenChange(false);

        } catch {
            setError("Không thể kết nối server");
        } finally {
            setLoading(false);
        }
    };

    // Nếu modal chưa mở thì không render
    if (!open) return null;

    return (
        <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
            onClick={() => onOpenChange(false)} // click ngoài modal sẽ đóng
        >
            <div
                className="bg-white rounded-lg p-6 w-full max-w-lg shadow-xl"
                onClick={(e) => e.stopPropagation()} // click trong modal không đóng
            >
                <h2 className="text-xl font-semibold mb-4">Thêm món ăn</h2>

                <form onSubmit={handleSubmit} className="space-y-3">
                    {/* Input Tên món */}
                    <input
                        type="text" placeholder="Tên món *"
                        value={name} onChange={e => setName(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Input Giá */}
                    <input
                        type="number" placeholder="Giá (VND) *"
                        value={price} onChange={e => setPrice(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Input Danh mục */}
                    <input
                        type="text" placeholder="Danh mục"
                        value={category} onChange={e => setCategory(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Input Sub-category */}
                    <input
                        type="text" placeholder="Mô tả (sub_category)"
                        value={subCategory} onChange={e => setSubCategory(e.target.value)}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Input Options dạng JSON */}
                    <input
                        type="text"
                        placeholder='OPTION JSON example: ["Size S","Size M","Size L"]'
                        onChange={e => {
                            try { setOptions(JSON.parse(e.target.value)); } // parse JSON
                            catch { setOptions([]); } // lỗi parse thì set empty array
                        }}
                        className="w-full border rounded px-3 py-2"
                    />

                    {/* Upload file */}
                    <input
                        type="file"
                        accept="image/*"
                        onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                    />

                    {/* Hiển thị lỗi */}
                    {error && <p className="text-red-600">{error}</p>}

                    {/* Nút Hủy / Lưu */} 
                    <div className="flex justify-end gap-2 pt-2">
                        <button
                            type="button"
                            className="px-4 py-2 bg-gray-200 rounded"
                            onClick={() => { resetForm(); onOpenChange(false); }}
                            disabled={loading}
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
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
