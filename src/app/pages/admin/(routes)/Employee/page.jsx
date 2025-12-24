'use client';

import { useEffect, useState } from "react";
import { Pencil, Trash2, RotateCcw } from "lucide-react";

import { getEmployeeList } from "../../service/Employee/Employee_list";
import AddEmployeeModal from "../../service/Employee/AddEmployeeModal";
import UpdateEmployeeModal from "../../service/Employee/UpdateEmployeeModal";
import DeleteEmployeeModal from "../../service/Employee/DeleteEmployeeModal";
import ResetPasswordModal from "../../service/Employee/ResetEmployeePasswordModal";

/* ===== helper render role badge ===== */
function RoleBadge({ role }) {
    const r = (role || "").toLowerCase();

    let className =
        "px-3 py-1 rounded-full text-xs font-semibold border inline-block";

    if (r === "admin") {
        className += " bg-red-100 text-red-700 border-red-200";
    } else if (r === "manager") {
        className += " bg-purple-100 text-purple-700 border-purple-200";
    } else if (r === "staff" || r === "employee") {
        className += " bg-blue-100 text-blue-700 border-blue-200";
    } else {
        className += " bg-gray-100 text-gray-700 border-gray-200";
    }

    return <span className={className}>{role || "N/A"}</span>;
}

export default function Employeepage() {
    const [Employee, setEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

    const fetchEmployeeList = async () => {
        const data = await getEmployeeList();
        setEmployee(data || []);
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Thêm nhân viên
                </button>
            </div>

            {Employee.length === 0 ? (
                <p>Chưa có nhân viên</p>
            ) : (
                <div className="overflow-x-auto rounded-lg border">
                    <table className="w-full border-collapse bg-white text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="border px-4 py-3 text-left font-semibold">
                                    Tên
                                </th>
                                <th className="border px-4 py-3 text-left font-semibold">
                                    Email
                                </th>
                                <th className="border px-4 py-3 text-left font-semibold">
                                    Role
                                </th>
                                <th className="border px-4 py-3 text-center font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {Employee.map((emp, index) => (
                                <tr
                                    key={emp.id}
                                    className={`hover:bg-gray-50 ${
                                        index % 2 === 1 ? "bg-gray-50/50" : ""
                                    }`}
                                >
                                    <td className="border px-4 py-2">
                                        {emp.name}
                                    </td>

                                    <td className="border px-4 py-2 text-gray-600">
                                        {emp.email || "N/A"}
                                    </td>

                                    {/* ROLE – đẹp, rõ quyền */}
                                    <td className="border px-4 py-2">
                                        <RoleBadge role={emp.role} />
                                    </td>

                                    <td className="border px-4 py-2">
                                        <div className="flex justify-center gap-3">
                                            <button
                                                title="Update"
                                                onClick={() => {
                                                    setSelectedEmployee(emp);
                                                    setIsUpdateModalOpen(true);
                                                }}
                                                className="p-2 rounded text-blue-600 hover:bg-blue-100"
                                            >
                                                <Pencil size={16} />
                                            </button>

                                            <button
                                                title="Delete"
                                                onClick={() => {
                                                    setSelectedEmployee(emp);
                                                    setIsDeleteModalOpen(true);
                                                }}
                                                className="p-2 rounded text-red-600 hover:bg-red-100"
                                            >
                                                <Trash2 size={16} />
                                            </button>

                                            <button
                                                title="Reset Password"
                                                onClick={() => {
                                                    setSelectedEmployee(emp);
                                                    setIsResetPassModalOpen(true);
                                                }}
                                                className="p-2 rounded text-yellow-600 hover:bg-yellow-100"
                                            >
                                                <RotateCcw size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Add */}
            {isAddModalOpen && (
                <AddEmployeeModal
                    open={isAddModalOpen}
                    onOpenChange={(state) => {
                        setIsAddModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* Update */}
            {isUpdateModalOpen && selectedEmployee && (
                <UpdateEmployeeModal
                    open={isUpdateModalOpen}
                    Employee={selectedEmployee}
                    onOpenChange={(state) => {
                        setIsUpdateModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* Delete */}
            {isDeleteModalOpen && selectedEmployee && (
                <DeleteEmployeeModal
                    open={isDeleteModalOpen}
                    employee={selectedEmployee}
                    onOpenChange={(state) => {
                        setIsDeleteModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* Reset Password */}
            {isResetPassModalOpen && selectedEmployee && (
                <ResetPasswordModal
                    open={isResetPassModalOpen}
                    employee={selectedEmployee}
                    onOpenChange={(state) => {
                        setIsResetPassModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}
        </div>
    );
}
