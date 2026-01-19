'use client';

import { useEffect, useState } from "react";
import { Pencil, Trash2, RotateCcw } from "lucide-react";

import { getEmployeeList } from "../../../../features/Employee/Employee_list";
import AddEmployeeModal from "../../../../features/Employee/AddEmployeeModal";
import UpdateEmployeeModal from "../../../../features/Employee/UpdateEmployeeModal";
import DeleteEmployeeModal from "../../../../features/Employee/DeleteEmployeeModal";
import ResetPasswordModal from "../../../../features/Employee/ResetEmployeePasswordModal";
import EmployeelistUI from "../../../../features/Employee/EmpolyeelistUI";
import Filterlist from "../../../../components/layout/SearchBar";

export default function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

    //filter state
    const [searchName, setSearchName] = useState("");

    // ============= FETCH EMPLOYEE LIST =============
    const fetchEmployeeList = async () => {
        const data = await getEmployeeList();
        setEmployees(data || []);
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

    // ============= FILTER LOGIC ===================
    const filteredEmployeeList = employees.filter((emp) => {
        if (searchName.toLocaleLowerCase() && !emp.name.toLocaleLowerCase().includes(searchName.toLocaleLowerCase()))
            return false;
        return true;
    });

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">Employee Management</h1>
                <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="
                        inline-flex items-center gap-2
                        px-4 py-2.5
                        bg-blue-600 text-white text-sm font-medium
                        rounded-lg
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        focus:outline-none focus:ring-2 focus:ring-blue-500/40 cursor-pointer
                        active:scale-[0.98]
                    "
                    >
                    <span className="text-lg leading-none">+</span>
                    Add Employee
                </button>

            </div>

            {/* FILTER BAR */}
            <Filterlist
                className="flex items-center gap-4 mb-4 w-fit"
                showSearchName={true}
                searchName={searchName}
                setSearchName={setSearchName}
            />

            {/* EMPLOYEE UI */}
            <EmployeelistUI
                employees={filteredEmployeeList}
                onEdit={(emp) => { setSelectedEmployee(emp); setIsUpdateModalOpen(true); }}
                onDelete={(emp) => { setSelectedEmployee(emp); setIsDeleteModalOpen(true); }}
                onResetPassword={(emp) => { setSelectedEmployee(emp); setIsResetPassModalOpen(true); }}
            />

            {/* ADD MODAL */}
            <AddEmployeeModal
                open={isAddModalOpen}
                onOpenChange={(state) => {
                    setIsAddModalOpen(state);
                    if (!state) fetchEmployeeList();
                }}
            />

            {/* UPDATE MODAL */}
            {selectedEmployee && (
                <UpdateEmployeeModal
                    open={isUpdateModalOpen}
                    Employee={selectedEmployee}
                    onOpenChange={(state) => {
                        setIsUpdateModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* DELETE MODAL */}
            {selectedEmployee && (
                <DeleteEmployeeModal
                    open={isDeleteModalOpen}
                    employee={selectedEmployee}
                    onOpenChange={(state) => {
                        setIsDeleteModalOpen(state);
                        if (!state) fetchEmployeeList();
                    }}
                />
            )}

            {/* RESET PASSWORD MODAL */}
            {selectedEmployee && (
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
