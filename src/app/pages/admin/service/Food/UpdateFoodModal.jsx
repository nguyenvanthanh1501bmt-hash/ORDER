'use client'

import { useState } from "react";

export default function UpdateFoodModal({ open, onOpenChange, food, onUpdated }) {
    // State quản lý dữ liệu form
    const [name, setName] = useState(food.name);                 // Tên món
    const [price, setPrice] = useState(food.price);             // Giá món
    const [category, setCategory] = useState(food.category);    // Danh mục
    const [subCategory, setSubCategory] = useState(food.sub_category || ""); // Sub-category
    const [options, setOptions] = useState(food.options || []); // Các option của món (array)
    const [imageUrl, setImageUrl] = useState(food.image_url || ""); // URL ảnh cũ
    const [newFile, setNewFile] = useState(null); // File mới nếu upload
    const [loading, setLoading] = useState(false); // trạng thái loading khi gửi request
    const [message, setMessage] = useState("");

    // Nếu modal chưa mở hoặc không có món được truyền xuống, không render gì
    if (!open || !food) return null;

    // Hàm lưu file mới khi người dùng chọn file
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) setNewFile(file);
    };

    // Hàm xử lý cập nhật món ăn
    const handleUpdate = async () => {
        setLoading(true);  // bật loading
        setMessage("");    // reset message

        try {
            let uploadedUrl = imageUrl; // mặc định dùng URL cũ

            // Nếu người dùng chọn file mới thì upload
            if (newFile) {
                const formData = new FormData();
                formData.append("file", newFile);

                // gọi API upload ảnh
                const uploadRes = await fetch("/api/menu/upload-image", {
                    method: "POST",
                    body: formData,
                });

                const uploadData = await uploadRes.json();

                if (!uploadRes.ok) {
                    // nếu upload lỗi thì dừng và hiện message lỗi
                    setMessage(uploadData.error || "Upload hình thất bại");
                    setLoading(false);
                    return;
                }

                uploadedUrl = uploadData.url; // URL mới từ API
            }

            // Gửi request cập nhật DB
            const res = await fetch("/api/menu_items/update-menu_items", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: food.id,
                    name,
                    price,
                    category,
                    sub_category: subCategory,
                    options,
                    image_url: uploadedUrl, // cập nhật ảnh mới nếu có
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                // hiển thị lỗi nếu API trả về lỗi
                setMessage(data.message || "Cập nhật thất bại");
            } else {
                setMessage(data.message || "Cập nhật thành công");
                if (onUpdated) onUpdated(); // callback để refresh list món ăn
                setTimeout(() => onOpenChange(false), 1000); // tự đóng modal sau 1s
            }
        } catch (err) {
            console.error(err);
            setMessage("Có lỗi xảy ra"); // lỗi JS/Network
        } finally {
            setLoading(false); // tắt loading
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            {/* Container modal */}
            <div className="flex flex-col gap-4 p-6 bg-white rounded shadow-lg max-w-md w-full">
                <h2 className="text-lg font-semibold">Update {food.name}</h2>

                {/* Input Tên món */}
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Tên món"
                    className="border p-2 rounded w-full"
                />

                {/* Input Giá */}
                <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    placeholder="Giá"
                    className="border p-2 rounded w-full"
                />

                {/* Input Danh mục */}
                <input
                    type="text"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Danh mục"
                    className="border p-2 rounded w-full"
                />

                {/* Input Sub-category */}
                <input
                    type="text"
                    value={subCategory}
                    onChange={(e) => setSubCategory(e.target.value)}
                    placeholder="Sub-category"
                    className="border p-2 rounded w-full"
                />

                {/* Input Options (nhập chuỗi, split thành array) */}
                <input
                    type="text"
                    value={options.join(", ")}
                    onChange={(e) => setOptions(e.target.value.split(",").map(o => o.trim()))}
                    placeholder="Options (ngăn cách bởi dấu ,)"
                    className="border p-2 rounded w-full"
                />

                {/* Upload/preview hình */}
                <div>
                    <label className="block mb-1">Hình ảnh</label>
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    {/* Hiển thị ảnh cũ nếu chưa chọn file mới */}
                    {imageUrl && !newFile && (
                        <img src={imageUrl} alt="preview" className="mt-2 w-32 h-32 object-contain" />
                    )}
                    {/* Hiển thị tên file mới nếu chọn */}
                    {newFile && (
                        <p className="mt-2 text-sm text-gray-500">File mới: {newFile.name}</p>
                    )}
                </div>

                {/* Hiển thị thông báo lỗi hoặc thành công */}
                {message && <p className="text-sm text-red-600">{message}</p>}

                {/* Nút Cancel / Update */}
                <div className="flex gap-4 mt-4 justify-end">
                    <button
                        className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                        disabled={loading}
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </button>
                    <button
                        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
                        disabled={loading}
                        onClick={handleUpdate}
                    >
                        {loading ? "Updating..." : "Update"}
                    </button>
                </div>
            </div>
        </div>
    );
}
