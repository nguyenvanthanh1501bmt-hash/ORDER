'use client'

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  CalendarDays,
  LayoutGrid,
  Plus,
  RefreshCcw,
  Search,
  UtensilsCrossed,
} from "lucide-react"

import { getTableList } from "../../../../features/Table/Table_list"
import AddTableModal from "../../../../features/Table/AddTableModal"
import UpdateTableModal from "../../../../features/Table/UpdateTableModal"
import DeleteTableModal from "../../../../features/Table/DeleteTableModal"
import TablelistUI from "../../../../features/Table/TablelistUI"
import Filterlist from "../../../../../components/layout/SearchBar"

export default function Tablepage() {
  const [tableList, setTableList] = useState([])
  const [selectedTable, setSelectedTable] = useState(null)

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isUpdateOpen, setIsUpdateOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  const [searchName, setSearchName] = useState("")
  const [searchCreate, setSearchCreate] = useState("")

  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [errorText, setErrorText] = useState("")

  // Fetch table list from API.
  const fetchTableList = useCallback(async (showLoading = true) => {
    try {
      setErrorText("")

      if (showLoading) {
        setLoading(true)
      } else {
        setRefreshing(true)
      }

      const data = await getTableList()
      setTableList(data || [])
    } catch (error) {
      console.error("Error fetching table list:", error)
      setErrorText("Cannot load table list. Please try again.")
      setTableList([])
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  // Load tables when the page is mounted.
  useEffect(() => {
    fetchTableList(true)
  }, [fetchTableList])

  // Filter tables by name and created date.
  const filteredTableList = useMemo(() => {
    const keyword = searchName.trim().toLowerCase()

    return tableList.filter((table) => {
      const tableName = table?.name?.toLowerCase() || ""

      if (keyword && !tableName.includes(keyword)) {
        return false
      }

      if (searchCreate && table?.created_at) {
        const tableDateStr = table.created_at.slice(0, 10)

        if (tableDateStr !== searchCreate) {
          return false
        }
      }

      return true
    })
  }, [tableList, searchName, searchCreate])

  // Calculate overview stats.
  const tableStats = useMemo(() => {
    return {
      total: tableList.length,
      showing: filteredTableList.length,
      filtered: Boolean(searchName.trim() || searchCreate),
    }
  }, [tableList.length, filteredTableList.length, searchName, searchCreate])

  // Refresh data after a modal is closed.
  const handleModalClose = async (state, setter, shouldClearSelected = false) => {
    setter(state)

    if (!state) {
      if (shouldClearSelected) {
        setSelectedTable(null)
      }

      await fetchTableList(false)
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
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
                  <UtensilsCrossed size={14} />
                  Table dashboard
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Table Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Create, update, delete, and organize restaurant tables from one clean dashboard.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={() => fetchTableList(false)}
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
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 active:scale-[0.98]"
                >
                  <Plus size={16} />
                  Add Table
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
                    Total tables
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900">
                    {tableStats.total}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 ring-1 ring-blue-100">
                  <LayoutGrid size={22} />
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
                    {tableStats.showing}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <Search size={22} />
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 sm:col-span-2 lg:col-span-1">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-amber-700">
                    Date filter
                  </p>
                  <p className="mt-2 truncate text-lg font-bold text-amber-900">
                    {searchCreate || "None"}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-100 text-amber-700 ring-1 ring-amber-200">
                  <CalendarDays size={22} />
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

        {/* Table list section */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Table List
              </h2>
              <p className="text-sm text-slate-500">
                Search by table name or filter by created date.
              </p>
            </div>

            {/* Filter bar */}
            <div className="w-full lg:w-auto">
              <Filterlist
                className="flex w-full flex-col gap-3 sm:flex-row sm:items-center lg:w-fit"
                showSearchName={true}
                searchName={searchName}
                setSearchName={setSearchName}
                showSearchCreate={true}
                searchCreate={searchCreate}
                setSearchCreate={setSearchCreate}
              />
            </div>
          </div>

          {filteredTableList.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                🪑
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No tables found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try changing your filters or add a new table to the restaurant.
              </p>

              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="mt-5 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                <Plus size={16} />
                Add Table
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-100">
              <TablelistUI
                tables={filteredTableList}
                onEdit={(table) => {
                  setSelectedTable(table)
                  setIsUpdateOpen(true)
                }}
                onDelete={(table) => {
                  setSelectedTable(table)
                  setIsDeleteOpen(true)
                }}
              />
            </div>
          )}
        </section>
      </div>

      {/* Add table modal */}
      <AddTableModal
        open={isModalOpen}
        onOpenChange={(state) => handleModalClose(state, setIsModalOpen)}
      />

      {/* Delete table modal */}
      <DeleteTableModal
        open={isDeleteOpen}
        table={selectedTable}
        onOpenChange={(state) =>
          handleModalClose(state, setIsDeleteOpen, true)
        }
      />

      {/* Update table modal */}
      <UpdateTableModal
        open={isUpdateOpen}
        table={selectedTable}
        onOpenChange={(state) =>
          handleModalClose(state, setIsUpdateOpen, true)
        }
      />
    </main>
  )
}