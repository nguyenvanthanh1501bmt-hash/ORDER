"use client"

import { useEffect, useMemo, useState } from "react"
import {
  BadgeDollarSign,
  Banknote,
  CircleDollarSign,
  Filter,
  Loader2,
  RefreshCcw,
  Receipt,
  Search,
  TrendingUp,
  WalletCards,
} from "lucide-react"
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"
import { authFetch } from "@/utils/authFetch"
import { formatDate } from "@/app/features/helper"

const emptyStats = {
  total_bills: 0,
  open_bills: 0,
  closed_bills: 0,
  closed_revenue: 0,
  all_bill_amount: 0,
}

const COLORS = {
  blue: "#2563eb",
  sky: "#0ea5e9",
  emerald: "#10b981",
  amber: "#f59e0b",
  purple: "#8b5cf6",
  slate: "#64748b",
  rose: "#f43f5e",
}

const cardToneClass = {
  blue: "bg-blue-50 text-blue-700 ring-blue-100",
  green: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  purple: "bg-purple-50 text-purple-700 ring-purple-100",
  amber: "bg-amber-50 text-amber-700 ring-amber-100",
}

function formatMoney(value) {
  return `${Number(value || 0).toLocaleString("vi-VN")} VND`
}

function formatCompactMoney(value) {
  const amount = Number(value || 0)

  if (amount >= 1_000_000_000) {
    return `${(amount / 1_000_000_000).toFixed(1)}B`
  }

  if (amount >= 1_000_000) {
    return `${(amount / 1_000_000).toFixed(1)}M`
  }

  if (amount >= 1_000) {
    return `${Math.round(amount / 1_000)}K`
  }

  return amount.toString()
}

function getBillAmount(bill) {
  return Number(bill.computed_amount ?? bill.total_amount ?? 0)
}

function getDateKey(value) {
  if (!value) return ""

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  return date.toISOString().slice(0, 10)
}

function StatCard({ title, value, icon: Icon, hint, tone = "blue" }) {
  return (
    <div className="group overflow-hidden rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-2 text-2xl font-bold tracking-tight text-slate-950">
            {value}
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
        </div>

        <div
          className={`rounded-2xl p-3 ring-1 ${
            cardToneClass[tone] || cardToneClass.blue
          }`}
        >
          <Icon size={22} />
        </div>
      </div>
    </div>
  )
}

function ChartShell({ title, description, icon: Icon, children, action }) {
  return (
    <section className="rounded-3xl border border-slate-200/70 bg-white p-5 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-700 ring-1 ring-blue-100">
            <Icon size={20} />
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-950">{title}</h2>
            <p className="mt-1 text-sm text-slate-500">{description}</p>
          </div>
        </div>

        {action}
      </div>

      {children}
    </section>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      {label && <p className="mb-2 text-sm font-bold text-slate-900">{label}</p>}

      <div className="space-y-1.5">
        {payload.map((item) => (
          <div
            key={item.dataKey || item.name}
            className="flex items-center justify-between gap-5 text-sm"
          >
            <div className="flex items-center gap-2 text-slate-500">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: item.color }}
              />
              <span>{item.name}</span>
            </div>

            <span className="font-semibold text-slate-950">
              {typeof item.value === "number"
                ? item.dataKey?.toLowerCase().includes("revenue") ||
                  item.name?.toLowerCase().includes("amount") ||
                  item.name?.toLowerCase().includes("revenue")
                  ? formatMoney(item.value)
                  : item.value
                : item.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

function StatusChart({ openCount, closedCount }) {
  const total = openCount + closedCount

  const data = [
    {
      name: "Closed",
      value: closedCount,
      color: COLORS.emerald,
    },
    {
      name: "Open",
      value: openCount,
      color: COLORS.blue,
    },
  ]

  const closedPercent = total ? Math.round((closedCount / total) * 100) : 0

  return (
    <ChartShell
      title="Bill Status"
      description="Open and closed bill distribution."
      icon={WalletCards}
      action={
        <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {closedPercent}% closed
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <div className="relative h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={72}
                outerRadius={104}
                paddingAngle={4}
                stroke="none"
              >
                {data.map((item) => (
                  <Cell key={item.name} fill={item.color} />
                ))}
              </Pie>

              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <p className="text-3xl font-bold text-slate-950">{total}</p>
              <p className="text-xs font-medium text-slate-400">Total bills</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center space-y-4">
          {data.map((item) => {
            const percent = total ? Math.round((item.value / total) * 100) : 0

            return (
              <div
                key={item.name}
                className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm font-semibold text-slate-700">
                      {item.name} bills
                    </span>
                  </div>

                  <span className="text-sm font-bold text-slate-950">
                    {item.value} · {percent}%
                  </span>
                </div>

                <div className="h-2 overflow-hidden rounded-full bg-white">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${percent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </ChartShell>
  )
}

function RevenueSplitChart({ openRevenue, closedRevenue }) {
  const data = [
    {
      name: "Closed Revenue",
      amount: closedRevenue,
      color: COLORS.emerald,
    },
    {
      name: "Open Amount",
      amount: openRevenue,
      color: COLORS.blue,
    },
  ]

  const total = openRevenue + closedRevenue

  return (
    <ChartShell
      title="Revenue Split"
      description="Comparison between paid revenue and open bill amount."
      icon={CircleDollarSign}
      action={
        <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600">
          {formatMoney(total)}
        </div>
      }
    >
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#e2e8f0" />
            <XAxis
              type="number"
              tickFormatter={formatCompactMoney}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              type="category"
              dataKey="name"
              width={120}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#475569" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="amount" name="Amount" radius={[0, 14, 14, 0]}>
              {data.map((item) => (
                <Cell key={item.name} fill={item.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

function RevenueTrendChart({ data }) {
  return (
    <ChartShell
      title="Revenue Trend"
      description="Closed bill revenue during the last 7 days."
      icon={TrendingUp}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.28} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              tickFormatter={formatCompactMoney}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={COLORS.blue}
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{ r: 6 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

function BillCountChart({ data }) {
  return (
    <ChartShell
      title="Closed Bills"
      description="Number of closed bills grouped by day."
      icon={BadgeDollarSign}
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 12, right: 12, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b" }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="billCount"
              name="Bills"
              fill={COLORS.purple}
              radius={[12, 12, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

export default function Billpage() {
  const [bills, setBills] = useState([])
  const [stats, setStats] = useState(emptyStats)
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchTable, setSearchTable] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [refreshing, setRefreshing] = useState(false)

  // Fetch all bills from the API, including open and closed bills.
  const fetchBills = async () => {
    try {
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
      setRefreshing(false)
    }
  }

  // Load bill data when the page is mounted.
  useEffect(() => {
    fetchBills()
  }, [])

  // Refresh bill data manually.
  const handleRefresh = () => {
    setRefreshing(true)
    fetchBills()
  }

  // Filter bills by status and table name.
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

  // Calculate revenue values for summary cards and charts.
  const revenueSummary = useMemo(() => {
    const openRevenue = bills
      .filter((bill) => bill.status === "open")
      .reduce((sum, bill) => sum + getBillAmount(bill), 0)

    const closedRevenue = bills
      .filter((bill) => bill.status === "closed")
      .reduce((sum, bill) => sum + getBillAmount(bill), 0)

    return {
      openRevenue,
      closedRevenue,
      totalRevenue: openRevenue + closedRevenue,
    }
  }, [bills])

  // Build the last 7 days chart data from closed bills.
  const revenueChartData = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const days = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(today)
      date.setDate(today.getDate() - (6 - index))

      return {
        key: date.toISOString().slice(0, 10),
        label: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        revenue: 0,
        billCount: 0,
      }
    })

    const dayMap = new Map(days.map((day) => [day.key, day]))

    bills
      .filter((bill) => bill.status === "closed")
      .forEach((bill) => {
        const dateKey = getDateKey(bill.closed_at || bill.created_at)
        const day = dayMap.get(dateKey)

        if (!day) return

        day.revenue += getBillAmount(bill)
        day.billCount += 1
      })

    return days
  }, [bills])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 p-4 md:p-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center gap-3">
            <Loader2 className="animate-spin text-blue-700" size={22} />
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Bills</h1>
              <p className="mt-1 text-sm text-slate-500">Loading bill data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-blue-950 p-6 text-white md:p-8">
            <div className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-blue-100 ring-1 ring-white/10">
                  <Receipt size={14} />
                  Billing dashboard
                </div>

                <h1 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                  Bills Overview
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-300">
                  Track bill status, closed revenue, open amount, and payment
                  history in one clean dashboard.
                </p>
              </div>

              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-4 py-2.5 text-sm font-bold text-slate-950 shadow-sm transition hover:bg-blue-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <RefreshCcw
                  size={16}
                  className={refreshing ? "animate-spin" : ""}
                />
                Refresh Data
              </button>
            </div>
          </div>

          {error && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-4 text-sm font-medium text-red-700">
              {error}
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            title="Total Bills"
            value={stats.total_bills || 0}
            icon={Receipt}
            hint="All bills ever created"
            tone="blue"
          />

          <StatCard
            title="Open Bills"
            value={stats.open_bills || 0}
            icon={WalletCards}
            hint={formatMoney(revenueSummary.openRevenue)}
            tone="amber"
          />

          <StatCard
            title="Closed Bills"
            value={stats.closed_bills || 0}
            icon={BadgeDollarSign}
            hint="Successfully paid bills"
            tone="green"
          />

          <StatCard
            title="Closed Revenue"
            value={formatMoney(stats.closed_revenue || revenueSummary.closedRevenue)}
            icon={Banknote}
            hint="Revenue from closed bills"
            tone="purple"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StatusChart
            openCount={stats.open_bills || 0}
            closedCount={stats.closed_bills || 0}
          />

          <RevenueSplitChart
            openRevenue={revenueSummary.openRevenue}
            closedRevenue={stats.closed_revenue || revenueSummary.closedRevenue}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RevenueTrendChart data={revenueChartData} />
          <BillCountChart data={revenueChartData} />
        </div>

        <section className="rounded-3xl border border-slate-200/70 bg-white shadow-sm">
          <div className="border-b border-slate-100 p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-bold text-slate-950">Bill History</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Search, filter, and review every bill record.
                </p>
              </div>

              <div className="flex flex-col gap-3 md:flex-row">
                <div className="relative">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    value={searchTable}
                    onChange={(e) => setSearchTable(e.target.value)}
                    placeholder="Search by table name..."
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:w-72"
                  />
                </div>

                <div className="relative">
                  <Filter
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:w-48"
                  >
                    <option value="all">All Statuses</option>
                    <option value="open">Open</option>
                    <option value="closed">Closed</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/80 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4 font-bold">Bill ID</th>
                  <th className="px-5 py-4 font-bold">Table</th>
                  <th className="px-5 py-4 font-bold">Status</th>
                  <th className="px-5 py-4 font-bold">Orders</th>
                  <th className="px-5 py-4 font-bold">Total Amount</th>
                  <th className="px-5 py-4 font-bold">Created At</th>
                  <th className="px-5 py-4 font-bold">Closed At</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm font-medium text-slate-500"
                    >
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50"
                    >
                      <td className="px-5 py-4 font-bold text-slate-950">
                        #{bill.id}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-700">
                        {bill.tables?.name || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                            bill.status === "closed"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                          }`}
                        >
                          {bill.status === "closed" ? "Closed" : "Open"}
                        </span>
                      </td>

                      <td className="px-5 py-4 text-slate-600">
                        {bill.order_count || 0}
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-950">
                        {formatMoney(getBillAmount(bill))}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(bill.created_at)}
                      </td>

                      <td className="px-5 py-4 text-slate-500">
                        {formatDate(bill.closed_at)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  )
}