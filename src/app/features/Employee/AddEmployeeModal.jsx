'use client';

import { useState } from "react";

export default function AddEmployeeModal({ open, onOpenChange }) {
    const [name, setName] = useState("");
    const [role, setRole] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const resetForm = () => {
        setName("");
        setRole("");
        setEmail("");
        setPassword("");
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setError("");

            const res = await fetch('/api/admin/create-staff', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, role, email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                setError(data.message || "Lỗi tạo nhân viên");
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
                    <h1 className="text-xl font-bold mb-4">Add Staff</h1>

                    <label>Name:</label>
                    <input 
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Tên nhân viên"
                        className="border p-2 w-full mb-3"
                        required
                    />

                    <label>Role:</label>
                    <select 
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border p-2 w-full mb-3"
                        required
                    >
                        <option value="">--Chọn vai trò--</option>
                        <option value="admin">Admin</option>
                        <option value="staff">Staff</option>
                    </select>

                    <label>Email:</label>
                    <input 
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email nhân viên"
                        className="border p-2 w-full mb-3"
                        required
                    />

                    <label>Password:</label>
                    <input 
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Mật khẩu"
                        className="border p-2 w-full mb-4"
                        required
                    />

                    {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

                    <div className="flex justify-between">
                        <button 
                            type="submit"
                            className="bg-blue-600 text-white px-4 py-2 rounded"
                            disabled={loading}
                        >
                            {loading ? "Đang tạo..." : "Tạo nhân viên"}
                        </button>

                        <button 
                            type="button"
                            className="bg-gray-300 px-4 py-2 rounded"
                            onClick={() => {
                                resetForm();
                                onOpenChange(false);
                            }}
                        >
                            Hủy
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
