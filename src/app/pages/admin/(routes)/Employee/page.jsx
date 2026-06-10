'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  RefreshCcw,
  UserPlus,
  Users,
  BadgeCheck,
  Search,
} from "lucide-react"

import { getEmployeeList } from "../../../../features/Employee/Employee_list"
import AddEmployeeModal from "../../../../features/Employee/AddEmployeeModal"
import UpdateEmployeeModal from "../../../../features/Employee/UpdateEmployeeModal"
import DeleteEmployeeModal from "../../../../features/Employee/DeleteEmployeeModal"
import ResetPasswordModal from "../../../../features/Employee/ResetEmployeePasswordModal"
import EmployeelistUI from "../../../../features/Employee/EmpolyeelistUI"
import Filterlist from "../../../../../components/layout/SearchBar"

export default function EmployeePage() {
  const [employees, setEmployees] = useState([])
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [isResetPassModalOpen, setIsResetPassModalOpen] = useState(false)

  const [searchName, setSearchName] = useState("")
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState("")

  // Fetch employee list from API.
  const fetchEmployeeList = useCallback(async (showLoading = true) => {
    try {
      setErrorText("")

      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const data = await getEmployeeList()
      setEmployees(data || [])
    } catch (error) {
      console.error("Error fetching employee list:", error)
      setErrorText("Cannot load employee list. Please try again.")
      setEmployees([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Load employees when the page is mounted.
  useEffect(() => {
    fetchEmployeeList(true)
  }, [fetchEmployeeList])

  // Filter employees by name.
  const filteredEmployeeList = useMemo(() => {
    const keyword = searchName.trim().toLowerCase()

    return employees.filter((emp) => {
      if (!keyword) return true

      const employeeName = emp?.name?.toLowerCase() || ""
      return employeeName.includes(keyword)
    })
  }, [employees, searchName])

  // Calculate overview stats.
  const employeeStats = useMemo(() => {
    return {
      total: employees.length,
      showing: filteredEmployeeList.length,
    }
  }, [employees.length, filteredEmployeeList.length])

  // Refresh data after closing a modal.
  const handleModalClose = async (state, setter) => {
    setter(state)

    if (!state) {
      setSelectedEmployee(null)
      await fetchEmployeeList(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-64 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-3 h-4 w-96 max-w-full animate-pulse rounded-lg bg-slate-100" />
          </section>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-28 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="space-y-4">
              {[1, 2, 3, 4].map((item) => (
                <div
                  key={item}
                  className="h-20 animate-pulse rounded-2xl bg-slate-100"
                />
              ))}
            </div>
          </section>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Page header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                  <Users size={14} />
                  Employee dashboard
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Employee Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Manage staff accounts, update employee details, reset passwords, and keep your team list organized.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fetchEmployeeList(false)}
                  disabled={refreshing}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-2.5 text-sm font-semibold text-white ring-1 ring-white/20 transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <RefreshCcw
                    size={16}
                    className={refreshing ? "animate-spin" : ""}
                  />
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>

                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  <UserPlus size={16} />
                  Add Employee
                </button>
              </div>
            </div>
          </div>

          {/* Overview stats */}
          <div className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Total employees
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {employeeStats.total}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <Users size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-emerald-700">
                    Showing results
                  </p>
                  <p className="mt-2 text-3xl font-bold text-emerald-900">
                    {employeeStats.showing}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <BadgeCheck size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Search keyword
                  </p>
                  <p className="mt-2 truncate text-lg font-bold text-amber-900">
                    {searchName.trim() || "None"}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                  <Search size={22} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Error message */}
        {errorText && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{errorText}</span>
          </div>
        )}

        {/* Employee list section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Employee List
              </h2>
              <p className="text-sm text-slate-500">
                Search, edit, delete, or reset passwords for employee accounts.
              </p>
            </div>

            {/* Search bar */}
            <div className="w-full lg:w-auto">
              <Filterlist
                className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-fit"
                showSearchName={true}
                searchName={searchName}
                setSearchName={setSearchName}
              />
            </div>
          </div>

          {filteredEmployeeList.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                👥
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No employees found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try changing your search keyword or add a new employee to the system.
              </p>

              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <UserPlus size={16} />
                Add Employee
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <EmployeelistUI
                employees={filteredEmployeeList}
                onEdit={(emp) => {
                  setSelectedEmployee(emp)
                  setIsUpdateModalOpen(true)
                }}
                onDelete={(emp) => {
                  setSelectedEmployee(emp)
                  setIsDeleteModalOpen(true)
                }}
                onResetPassword={(emp) => {
                  setSelectedEmployee(emp)
                  setIsResetPassModalOpen(true)
                }}
              />
            </div>
          )}
        </section>
      </div>

      {/* Add employee modal */}
      <AddEmployeeModal
        open={isAddModalOpen}
        onOpenChange={(state) => handleModalClose(state, setIsAddModalOpen)}
      />

      {/* Update employee modal */}
      {selectedEmployee && (
        <UpdateEmployeeModal
          open={isUpdateModalOpen}
          Employee={selectedEmployee}
          onOpenChange={(state) => handleModalClose(state, setIsUpdateModalOpen)}
        />
      )}

      {/* Delete employee modal */}
      {selectedEmployee && (
        <DeleteEmployeeModal
          open={isDeleteModalOpen}
          employee={selectedEmployee}
          onOpenChange={(state) => handleModalClose(state, setIsDeleteModalOpen)}
        />
      )}

      {/* Reset password modal */}
      {selectedEmployee && (
        <ResetPasswordModal
          open={isResetPassModalOpen}
          employee={selectedEmployee}
          onOpenChange={(state) => handleModalClose(state, setIsResetPassModalOpen)}
        />
      )}
    </main>
  )
}