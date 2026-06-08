"use client"

import { useEffect, useMemo, useState } from "react"
import { authFetch } from "@/utils/authFetch"
import { formatDate } from "@/app/features/helper"

const emptyStats = {
  total_bills: 0,
  open_bills: 0,
  closed_bills: 0,
  closed_revenue: 0,
  all_bill_amount: 0,
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`
}

export default function Billpage() {
  const [bills, setBills] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTable, setSearchTable] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  const fetchBills = async () => {
    try {
      setLoading(true)
      setError("")

      const res = await authFetch("/api/bill?scope=all", {
        method: "GET",
        cache: "no-store",
      })

      const text = await res.text()

      let response
      try {
        response = text ? JSON.parse(text) : {}
      } catch {
        console.error("API returned non-JSON response:", text)
        throw new Error(
          `The server returned an invalid response. Status: ${res.status}`
        )
      }

      if (!res.ok) {
        throw new Error(response.error || response.message || "Failed to load bills")
      }

      setBills(response.data || [])
      setStats(response.stats || emptyStats)
    } catch (err) {
      console.error("Fetch bills error:", err)
      setError(err.message || "Failed to load bills")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBills()
  }, [])

  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (statusFilter !== "all" && bill.status !== statusFilter) return false

      const tableName = bill.tables?.name || ""

      if (
        searchTable &&
        !tableName.toLowerCase().includes(searchTable.toLowerCase())
      ) {
        return false
      }

      return true
    })
  }, [bills, statusFilter, searchTable])

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Bills</h1>
          <p className="text-sm text-gray-500">
            Track all bills that have ever existed in the system
          </p>
        </div>

        <button
          onClick={fetchBills}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Total Bills</p>
          <p className="mt-2 text-2xl font-bold">{stats.total_bills}</p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Open Bills</p>
          <p className="mt-2 text-2xl font-bold text-blue-600">
            {stats.open_bills}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Closed Bills</p>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {stats.closed_bills}
          </p>
        </div>

        <div className="rounded-xl border bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">Closed Bill Revenue</p>
          <p className="mt-2 text-2xl font-bold">
            {formatMoney(stats.closed_revenue)}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <input
          value={searchTable}
          onChange={(e) => setSearchTable(e.target.value)}
          placeholder="Search by table name..."
          className="w-full md:w-72 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full md:w-48 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500/30"
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-600">
            <tr>
              <th className="px-4 py-3">Bill ID</th>
              <th className="px-4 py-3">Table</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Orders</th>
              <th className="px-4 py-3">Total Amount</th>
              <th className="px-4 py-3">Created At</th>
              <th className="px-4 py-3">Closed At</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  Loading bills...
                </td>
              </tr>
            ) : filteredBills.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                  No bills found
                </td>
              </tr>
            ) : (
              filteredBills.map((bill) => (
                <tr key={bill.id} className="border-t">
                  <td className="px-4 py-3 font-medium">#{bill.id}</td>
                  <td className="px-4 py-3">{bill.tables?.name || "-"}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`rounded-full px-2 py-1 text-xs font-medium ${
                        bill.status === "closed"
                          ? "bg-green-100 text-green-700"
                          : "bg-blue-100 text-blue-700"
                      }`}
                    >
                      {bill.status === "closed" ? "Closed" : "Open"}
                    </span>
                  </td>
                  <td className="px-4 py-3">{bill.order_count || 0}</td>
                  <td className="px-4 py-3">
                    {formatMoney(bill.computed_amount)}
                  </td>
                  <td className="px-4 py-3">{formatDate(bill.created_at)}</td>
                  <td className="px-4 py-3">{formatDate(bill.closed_at)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}