'use client';

import { Pencil, Trash2, RotateCcw } from "lucide-react";

/* ===== helper render role badge ===== */
function RoleBadge({ role }) {
    const r = (role || "").toLowerCase();

    let className =
        "px-3 py-1 rounded-full text-xs font-semibold border inline-block";

    if (r === "admin") className += " bg-red-100 text-red-700 border-red-200";
    else if (r === "staff" || r === "employee") className += " bg-blue-100 text-blue-700 border-blue-200";
    else className += " bg-gray-100 text-gray-700 border-gray-200";

    return <span className={className}>{role || "N/A"}</span>;
}

export default function EmployeelistUI({ employees = [], onEdit, onDelete, onResetPassword }) {
    if (employees.length === 0) return <p className="text-gray-500">No employees</p>;

    return (
        <div className="overflow-x-auto rounded-lg border">
            <table className="w-full border-collapse bg-white text-sm">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="border px-4 py-3 text-left font-semibold">Tên</th>
                        <th className="border px-4 py-3 text-left font-semibold">Email</th>
                        <th className="border px-4 py-3 text-left font-semibold">Role</th>
                        <th className="border px-4 py-3 text-center font-semibold">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map((emp, index) => (
                        <tr key={emp.id} className={`hover:bg-gray-50 ${index % 2 === 1 ? "bg-gray-50/50" : ""}`}>
                            <td className="border px-4 py-2">{emp.name}</td>
                            <td className="border px-4 py-2 text-gray-600">{emp.email || "N/A"}</td>
                            <td className="border px-4 py-2">
                                <RoleBadge role={emp.role} />
                            </td>
                            <td className="border px-4 py-2">
                                <div className="flex justify-center gap-3">
                                    <button onClick={() => onEdit(emp)} className="p-2 rounded text-blue-600 hover:bg-blue-100">
                                        <Pencil size={16} />
                                    </button>
                                    <button onClick={() => onDelete(emp)} className="p-2 rounded text-red-600 hover:bg-red-100">
                                        <Trash2 size={16} />
                                    </button>
                                    <button onClick={() => onResetPassword(emp)} className="p-2 rounded text-yellow-600 hover:bg-yellow-100">
                                        <RotateCcw size={16} />
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
