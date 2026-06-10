"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import {
  AlertCircle,
  Banknote,
  CheckCircle2,
  Clock3,
  FileText,
  ReceiptText,
  RefreshCcw,
  Search,
  Table2,
  WalletCards,
} from "lucide-react"
import { authFetch } from "@/utils/authFetch"
import { formatDate } from "@/app/features/helper"

const emptyStats = {
  total_bills: 0,
  open_bills: 0,
  closed_bills: 0,
  closed_revenue: 0,
  all_bill_amount: 0,
}

// Format money to Vietnamese currency style.
function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`
}

// Render bill status badge.
function StatusBadge({ status }) {
  const isClosed = status === "closed"

  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1
        ${
          isClosed
            ? "bg-emerald-50 text-emerald-700 ring-emerald-100"
            : "bg-blue-50 text-blue-700 ring-blue-100"
        }
      `}
    >
      {isClosed ? <CheckCircle2 size={13} /> : <Clock3 size={13} />}
      {isClosed ? "Closed" : "Open"}
    </span>
  )
}

// Render statistic card.
function StatCard({ title, value, icon: Icon, tone = "slate" }) {
  const toneClass = {
    slate: "bg-slate-50 text-slate-700 ring-slate-100",
    blue: "bg-blue-50 text-blue-700 ring-blue-100",
    emerald: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    amber: "bg-amber-50 text-amber-700 ring-amber-100",
    rose: "bg-rose-50 text-rose-700 ring-rose-100",
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            {title}
          </p>

          <p className="mt-2 truncate text-2xl font-extrabold text-slate-950">
            {value}
          </p>
        </div>

        <div
          className={`
            flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1
            ${toneClass[tone]}
          `}
        >
          <Icon size={23} />
        </div>
      </div>
    </div>
  )
}

// Render loading skeleton.
function LoadingState() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 5 }).map((_, index) => (
        <div
          key={index}
          className="h-20 animate-pulse rounded-3xl border border-slate-200 bg-white"
        />
      ))}
    </div>
  )
}

export default function Billpage() {
  const [bills, setBills] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTable, setSearchTable] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  // Fetch all bills from API.
  const fetchBills = useCallback(async () => {
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
        throw new Error(
          response.error || response.message || "Failed to load bills"
        )
      }

      setBills(response.data || [])
      setStats(response.stats || emptyStats)
    } catch (err) {
      console.error("Fetch bills error:", err)
      setError(err.message || "Failed to load bills")
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchBills()
  }, [fetchBills])

  // Filter bills by status and table name.
  const filteredBills = useMemo(() => {
    return bills.filter((bill) => {
      if (statusFilter !== "all" && bill.status !== statusFilter) {
        return false
      }

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

  const hasFilter = statusFilter !== "all" || searchTable.trim()

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-slate-950 px-5 py-7 text-white sm:px-7">
            <div className="absolute -right-20 -top-20 h-52 w-52 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-52 w-52 rounded-full bg-blue-400/20 blur-3xl" />

            <div className="relative z-10 flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                  <ReceiptText size={14} />
                  Bill management
                </div>

                <h1 className="text-2xl font-extrabold tracking-tight sm:text-3xl">
                  Bills
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Track all bills, open tables, closed payments, and restaurant
                  revenue from one dashboard.
                </p>
              </div>

              <button
                type="button"
                onClick={fetchBills}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
              >
                <RefreshCcw
                  size={17}
                  className={loading ? "animate-spin" : ""}
                />
                {loading ? "Refreshing..." : "Refresh"}
              </button>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <StatCard
            title="Total bills"
            value={stats.total_bills}
            icon={ReceiptText}
            tone="slate"
          />

          <StatCard
            title="Open bills"
            value={stats.open_bills}
            icon={Clock3}
            tone="blue"
          />

          <StatCard
            title="Closed bills"
            value={stats.closed_bills}
            icon={CheckCircle2}
            tone="emerald"
          />

          <StatCard
            title="Closed revenue"
            value={formatMoney(stats.closed_revenue)}
            icon={Banknote}
            tone="amber"
          />

          <StatCard
            title="All bill amount"
            value={formatMoney(stats.all_bill_amount)}
            icon={WalletCards}
            tone="rose"
          />
        </section>

        {/* Filters */}
        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2.5 transition focus-within:border-slate-400 focus-within:bg-white focus-within:ring-4 focus-within:ring-slate-100">
                <Search size={18} className="shrink-0 text-slate-400" />

                <input
                  value={searchTable}
                  onChange={(event) => setSearchTable(event.target.value)}
                  placeholder="Search by table name..."
                  className="w-full bg-transparent text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value)}
                className="h-11 rounded-2xl border border-slate-200 bg-slate-50 px-3 text-sm font-bold text-slate-700 outline-none transition focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100 sm:w-52"
              >
                <option value="all">All statuses</option>
                <option value="open">Open</option>
                <option value="closed">Closed</option>
              </select>
            </div>

            {hasFilter && (
              <button
                type="button"
                onClick={() => {
                  setSearchTable("")
                  setStatusFilter("all")
                }}
                className="rounded-2xl bg-slate-100 px-4 py-2.5 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200"
              >
                Clear filters
              </button>
            )}
          </div>

          <p className="mt-3 text-xs font-medium text-slate-400">
            Showing {filteredBills.length} of {bills.length} bills
          </p>
        </section>

        {/* Content */}
        <section>
          {loading ? (
            <LoadingState />
          ) : filteredBills.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-700 ring-1 ring-slate-200">
                <FileText size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No bills found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Try changing the table search or status filter.
              </p>
            </div>
          ) : (
            <>
              {/* Mobile cards */}
              <div className="grid gap-4 lg:hidden">
                {filteredBills.map((bill) => (
                  <article
                    key={bill.id}
                    className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Bill #{bill.id}
                        </p>

                        <h3 className="mt-1 truncate text-lg font-extrabold text-slate-950">
                          Table {bill.tables?.name || "-"}
                        </h3>
                      </div>

                      <StatusBadge status={bill.status} />
                    </div>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Orders
                        </p>
                        <p className="mt-1 text-sm font-extrabold text-slate-900">
                          {bill.order_count || 0}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Amount
                        </p>
                        <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
                          {formatMoney(bill.computed_amount)}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-3 text-xs text-slate-500">
                      <div className="flex items-center justify-between gap-3">
                        <span>Created</span>
                        <span className="font-semibold text-slate-700">
                          {bill.created_at ? formatDate(bill.created_at) : "-"}
                        </span>
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <span>Closed</span>
                        <span className="font-semibold text-slate-700">
                          {bill.closed_at ? formatDate(bill.closed_at) : "-"}
                        </span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm lg:block">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-left">
                    <tr className="border-b border-slate-200 text-xs font-extrabold uppercase tracking-wide text-slate-400">
                      <th className="px-5 py-4">Bill ID</th>
                      <th className="px-5 py-4">Table</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Orders</th>
                      <th className="px-5 py-4">Total Amount</th>
                      <th className="px-5 py-4">Created At</th>
                      <th className="px-5 py-4">Closed At</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredBills.map((bill) => (
                      <tr
                        key={bill.id}
                        className="transition hover:bg-slate-50/80"
                      >
                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 font-extrabold text-slate-950">
                            <ReceiptText size={16} className="text-slate-400" />
                            #{bill.id}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <span className="inline-flex items-center gap-2 font-bold text-slate-700">
                            <Table2 size={16} className="text-slate-400" />
                            {bill.tables?.name || "-"}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <StatusBadge status={bill.status} />
                        </td>

                        <td className="px-5 py-4 font-bold text-slate-700">
                          {bill.order_count || 0}
                        </td>

                        <td className="px-5 py-4 font-extrabold text-slate-950">
                          {formatMoney(bill.computed_amount)}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {bill.created_at ? formatDate(bill.created_at) : "-"}
                        </td>

                        <td className="px-5 py-4 text-slate-500">
                          {bill.closed_at ? formatDate(bill.closed_at) : "-"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  )
}