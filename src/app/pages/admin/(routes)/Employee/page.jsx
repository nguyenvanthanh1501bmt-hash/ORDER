'use client';

import { useEffect, useState } from "react";
import { Pencil, Trash2, RotateCcw } from "lucide-react";

import { getEmployeeList } from "../../service/Employee/Employee_list";
import AddEmployeeModal from "../../service/Employee/AddEmployeeModal";
import UpdateEmployeeModal from "../../service/Employee/UpdateEmployeeModal";
import DeleteEmployeeModal from "../../service/Employee/DeleteEmployeeModal";
import ResetPasswordModal from "../../service/Employee/ResetEmployeePasswordModal";
import EmployeelistUI from "../../service/Employee/EmpolyeelistUI";
import Filterlist from "../../components/SearchBar";

export default function EmployeePage() {
    const [employees, setEmployees] = useState([]);
    const [selectedEmployee, setSelectedEmployee] = useState(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false);

    //filter state
    const [searchName, setSearchName] = useState("");

    const fetchEmployeeList = async () => {
        const data = await getEmployeeList();
        setEmployees(data || []);
    };

    useEffect(() => {
        fetchEmployeeList();
    }, []);

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
                    className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                >
                    Thêm nhân viên
                </button>
            </div>

            {/* Filter Bar */}
            <Filterlist
                className="flex items-center gap-4 mb-4 w-fit"
                showSearchName={true}
                searchName={searchName}
                setSearchName={setSearchName}
            />

            {/* Employee Table */}
            <EmployeelistUI
                employees={filteredEmployeeList}
                onEdit={(emp) => { setSelectedEmployee(emp); setIsUpdateModalOpen(true); }}
                onDelete={(emp) => { setSelectedEmployee(emp); setIsDeleteModalOpen(true); }}
                onResetPassword={(emp) => { setSelectedEmployee(emp); setIsResetPassModalOpen(true); }}
            />

            {/* Add Modal */}
            <AddEmployeeModal
                open={isAddModalOpen}
                onOpenChange={(state) => {
                    setIsAddModalOpen(state);
                    if (!state) fetchEmployeeList();
                }}
            />

            {/* Update Modal */}
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

            {/* Delete Modal */}
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

            {/* Reset Password Modal */}
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
