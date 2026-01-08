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

        if (!name || !price || !category) {
            setError("Food name, price and category are required");
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
                setError(data.message || "Something went wrong");
                return;
            }

            resetForm();
            onOpenChange(false);
        } catch {
            setError("Cannot connect to server");
        } finally {
            setLoading(false);
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center"
            onClick={() => onOpenChange(false)}
        >
            <div
                className="bg-white w-full max-w-xl rounded-xl shadow-xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="px-6 py-4 border-b">
                    <h2 className="text-lg font-semibold text-gray-800">
                        Add New Food
                    </h2>
                    <p className="text-sm text-gray-500 mt-1">
                        Fill in the information below to create a new menu item
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
                    {/* Food name */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Food name *
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={e => setName(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Price */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Price (VND) *
                        </label>
                        <input
                            type="number"
                            value={price}
                            onChange={e => setPrice(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <input
                            type="text"
                            value={category}
                            onChange={e => setCategory(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Sub category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description / Sub category
                        </label>
                        <input
                            type="text"
                            value={subCategory}
                            onChange={e => setSubCategory(e.target.value)}
                            className="w-full rounded-lg border px-3 py-2 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Options */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Options (JSON)
                        </label>
                        <input
                            type="text"
                            placeholder='Example: ["Size S","Size M","Size L"]'
                            onChange={e => {
                                try { setOptions(JSON.parse(e.target.value)); }
                                catch { setOptions([]); }
                            }}
                            className="w-full rounded-lg border px-3 py-2 text-sm
                                       focus:ring-2 focus:ring-blue-500 focus:outline-none"
                        />
                    </div>

                    {/* Image upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Food image
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={e => e.target.files && handleImageUpload(e.target.files[0])}
                            className="text-sm"
                        />
                        {imageUrl && (
                            <p className="text-xs text-green-600 mt-1">
                                Image uploaded successfully
                            </p>
                        )}
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 pt-4 border-t">
                        <button
                            type="button"
                            className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
                            onClick={() => { resetForm(); onOpenChange(false); }}
                            disabled={loading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`px-4 py-2 rounded-lg text-white font-semibold
                              ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                              }`}
                        >
                            {loading ? "Saving..." : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
