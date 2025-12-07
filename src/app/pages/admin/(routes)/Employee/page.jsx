'use client';
import { useEffect, useState } from "react";
import { getEmployeeList } from "../../service/Employee/Employee_list";
import AddEmployeeModal from "../../service/Employee/AddEmployeeModal";
import UpdateEmployeeModal from "../../service/Employee/UpdateEmployeeModal";
import DeleteEmployeeModal from "../../service/Employee/DeleteEmployeeModal";
import ResetPasswordModal from "../../service/Employee/ResetEmployeePasswordModal"

export default function Employeepage() {
    const [Employee, setEmployee] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false)

    const fetchEmployeeList = async () => {
        const data = await getEmployeeList();
        setEmployee(data || []);
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold">Employee Page</h1>

            <div className="mt-5">
                {Employee.length === 0 ? (
                    <p>Chưa có nhân viên</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {Employee.map((emp) => (
                            <div 
                                key={emp.id}
                                className="border shadow-md p-4 rounded-lg bg-white hover:shadow-lg transition"
                            >
                                <p className="font-semibold text-lg">{emp.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="text-gray-600 font-medium">Role:</span>
                                    <span className="px-2 py-1 rounded-full text-xs font-semibold
                                        bg-blue-100 text-blue-700">
                                        {emp.role || "N/A"}
                                    </span>
                                </div>
                                <p className="text-gray-600 mb-4">Email: {emp.email || "N/A"}</p>

                                <div className="flex gap-2">
                                    <button
                                        className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                                        onClick={() => {
                                            setSelectedEmployee(emp); // giữ nguyên user_id từ emp
                                            setIsUpdateModalOpen(true);
                                        }}
                                    >
                                        Update
                                    </button>

                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                                        onClick={() => {
                                            setIsDeleteModalOpen(true)
                                            setSelectedEmployee(emp);
                                        }}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-600"
                                        onClick={() => {
                                            setIsResetPassModalOpen(true)
                                            setSelectedEmployee(emp)
                                        }}
                                    >
                                        Reset Password
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <button
                className="mt-6 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                onClick={() => setIsAddModalOpen(true)}
            >
                Thêm nhân viên
            </button>
            
            {/* Modal update */}
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

            {/* modal delete */}
            {isDeleteModalOpen && (
                <DeleteEmployeeModal
                    open={isDeleteModalOpen}
                    onOpenChange={(state) => {
                        setIsDeleteModalOpen(state)
                        if(!state) fetchEmployeeList()
                    }}
                    employee={selectedEmployee}

                />
            )}

            {/* Modal add */}
            {isAddModalOpen && (
                <AddEmployeeModal
                    open={isAddModalOpen}
                    onOpenChange={(state) => {
                        setIsAddModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* modal reset password */}
            {isResetPassModalOpen && (
                <ResetPasswordModal
                    open={isResetPassModalOpen}
                    onOpenChange={(state) =>{
                        setIsResetPassModalOpen(state)
                        if(!state) fetchEmployeeList();
                    }}
                    employee={selectedEmployee}
                />
            )}
        </div>
    );
}
