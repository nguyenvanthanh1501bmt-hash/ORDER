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
  Utensils,
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

const VN_TIME_ZONE = "Asia/Ho_Chi_Minh"

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

const toneStyle = {
  blue: {
    card: "from-blue-500/10 via-white to-white",
    icon: "bg-blue-600 text-white shadow-blue-200",
    badge: "bg-blue-50 text-blue-700 ring-blue-100",
    bar: "from-blue-500 to-sky-400",
  },
  green: {
    card: "from-emerald-500/10 via-white to-white",
    icon: "bg-emerald-600 text-white shadow-emerald-200",
    badge: "bg-emerald-50 text-emerald-700 ring-emerald-100",
    bar: "from-emerald-500 to-teal-400",
  },
  purple: {
    card: "from-purple-500/10 via-white to-white",
    icon: "bg-purple-600 text-white shadow-purple-200",
    badge: "bg-purple-50 text-purple-700 ring-purple-100",
    bar: "from-purple-500 to-indigo-400",
  },
  amber: {
    card: "from-amber-500/10 via-white to-white",
    icon: "bg-amber-500 text-white shadow-amber-200",
    badge: "bg-amber-50 text-amber-700 ring-amber-100",
    bar: "from-amber-400 to-orange-400",
  },
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

function toNumber(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function getPercent(value, total) {
  if (!total) return 0
  return Math.round((Number(value || 0) / Number(total || 0)) * 100)
}

function getBillItemTotal(bill) {
  const orders = Array.isArray(bill.orders) ? bill.orders : []

  return orders.reduce((orderTotal, order) => {
    const items = Array.isArray(order.order_items) ? order.order_items : []

    const itemTotal = items.reduce((sum, item) => {
      const quantity = toNumber(item.quantity)
      const price = toNumber(item.unit_price ?? item.price ?? item.menu_items?.price)

      return sum + quantity * price
    }, 0)

    return orderTotal + itemTotal
  }, 0)
}

function getBillAmount(bill) {
  const computedAmount = toNumber(bill.computed_amount)
  const savedTotalAmount = toNumber(bill.total_amount)
  const itemTotalAmount = getBillItemTotal(bill)

  if (bill.status === "closed") {
    if (savedTotalAmount > 0) return savedTotalAmount
    if (computedAmount > 0) return computedAmount
    return itemTotalAmount
  }

  if (computedAmount > 0) return computedAmount
  if (itemTotalAmount > 0) return itemTotalAmount
  return savedTotalAmount
}

function getOrderItemsFromBill(bill) {
  const orders = Array.isArray(bill.orders) ? bill.orders : []

  return orders.flatMap((order) => {
    return Array.isArray(order.order_items) ? order.order_items : []
  })
}

function getOrderItemName(item) {
  return (
    item.menu_items?.name ||
    item.menu_item?.name ||
    item.base_item_name ||
    item.menu_name ||
    item.name ||
    `Item #${item.menu_item_id || item.menu_id || item.id || "Unknown"}`
  )
}

function getOrderItemPrice(item) {
  return toNumber(item.unit_price ?? item.price ?? item.menu_items?.price)
}

function getTopSelectedDishes(bills, limit = 8) {
  const dishMap = new Map()

  bills.forEach((bill) => {
    const items = getOrderItemsFromBill(bill)

    items.forEach((item) => {
      const name = getOrderItemName(item)
      const quantity = toNumber(item.quantity)
      const price = getOrderItemPrice(item)

      if (!name || quantity <= 0) return

      const current = dishMap.get(name) || {
        name,
        quantity: 0,
        amount: 0,
      }

      current.quantity += quantity
      current.amount += quantity * price

      dishMap.set(name, current)
    })
  })

  return Array.from(dishMap.values())
    .sort((a, b) => {
      if (b.quantity !== a.quantity) return b.quantity - a.quantity
      return b.amount - a.amount
    })
    .slice(0, limit)
}

function getVietnamDateParts(date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: VN_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(date)

  return {
    year: parts.find((part) => part.type === "year")?.value,
    month: parts.find((part) => part.type === "month")?.value,
    day: parts.find((part) => part.type === "day")?.value,
  }
}

function getDateKey(value) {
  if (!value) return ""

  const date = value instanceof Date ? value : new Date(value)

  if (Number.isNaN(date.getTime())) return ""

  const { year, month, day } = getVietnamDateParts(date)

  if (!year || !month || !day) return ""

  return `${year}-${month}-${day}`
}

function getDateLabelFromKey(key) {
  const [year, month, day] = key.split("-").map(Number)

  if (!year || !month || !day) return key

  const date = new Date(Date.UTC(year, month - 1, day, 12, 0, 0))

  return new Intl.DateTimeFormat("en-US", {
    timeZone: VN_TIME_ZONE,
    month: "short",
    day: "numeric",
  }).format(date)
}

function getLast7VietnamDays() {
  const todayParts = getVietnamDateParts(new Date())

  const today = new Date(
    Date.UTC(
      Number(todayParts.year),
      Number(todayParts.month) - 1,
      Number(todayParts.day),
      12,
      0,
      0
    )
  )

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setUTCDate(today.getUTCDate() - (6 - index))

    const key = getDateKey(date)

    return {
      key,
      label: getDateLabelFromKey(key),
      revenue: 0,
      billCount: 0,
    }
  })
}

function StatCard({ title, value, icon: Icon, hint, tone = "blue" }) {
  const style = toneStyle[tone] || toneStyle.blue

  return (
    <div
      className={`group relative overflow-hidden rounded-[2rem] border border-slate-200/70 bg-gradient-to-br ${style.card} p-5 shadow-sm shadow-slate-200/70 transition duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200`}
    >
      <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-white/60" />

      <div className="relative flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-500">{title}</p>
          <p className="mt-3 truncate text-2xl font-black tracking-tight text-slate-950">
            {value}
          </p>
          {hint && <p className="mt-1 truncate text-xs font-medium text-slate-400">{hint}</p>}
        </div>

        <div className={`rounded-2xl p-3 shadow-lg ${style.icon}`}>
          <Icon size={22} />
        </div>
      </div>

      <div className="relative mt-5 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full w-2/3 rounded-full bg-gradient-to-r ${style.bar}`} />
      </div>
    </div>
  )
}

function ChartShell({ title, description, icon: Icon, children, action }) {
  return (
    <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm shadow-slate-200/70">
      <div className="border-b border-slate-100 bg-gradient-to-r from-white via-slate-50/80 to-white p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex min-w-0 items-start gap-3">
            <div className="rounded-2xl bg-slate-950 p-2.5 text-white shadow-sm">
              <Icon size={19} />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-black text-slate-950">{title}</h2>
              <p className="mt-1 text-sm leading-5 text-slate-500">{description}</p>
            </div>
          </div>

          {action}
        </div>
      </div>

      <div className="p-5">{children}</div>
    </section>
  )
}

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-xl shadow-slate-200/70 backdrop-blur">
      {label && <p className="mb-2 text-sm font-black text-slate-900">{label}</p>}

      <div className="space-y-1.5">
        {payload.map((item) => {
          const itemName = item.name?.toLowerCase() || ""
          const dataKey = item.dataKey?.toLowerCase() || ""

          const shouldFormatMoney =
            dataKey.includes("revenue") ||
            dataKey.includes("amount") ||
            itemName.includes("revenue") ||
            itemName.includes("amount")

          let dotColor = item.payload?.color || item.color || COLORS.blue
          if (String(dotColor).startsWith("url")) dotColor = COLORS.blue

          return (
            <div
              key={item.dataKey || item.name}
              className="flex items-center justify-between gap-5 text-sm"
            >
              <div className="flex items-center gap-2 text-slate-500">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: dotColor }}
                />
                <span>{item.name}</span>
              </div>

              <span className="font-bold text-slate-950">
                {typeof item.value === "number" && shouldFormatMoney
                  ? formatMoney(item.value)
                  : item.value}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function StatusChart({ openCount, closedCount }) {
  const total = openCount + closedCount
  const closedPercent = getPercent(closedCount, total)
  const openPercent = getPercent(openCount, total)

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

  return (
    <ChartShell
      title="Bill Status"
      description="Open and closed bill distribution."
      icon={WalletCards}
      action={
        <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
          {closedPercent}% closed
        </div>
      }
    >
      <div className="grid gap-6 lg:grid-cols-[240px_1fr]">
        <div className="relative h-60">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={70}
                outerRadius={98}
                paddingAngle={6}
                cornerRadius={12}
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
              <p className="text-4xl font-black text-slate-950">{total}</p>
              <p className="mt-1 text-xs font-bold uppercase tracking-wide text-slate-400">
                Bills
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-center gap-4">
          <div className="rounded-3xl border border-emerald-100 bg-emerald-50/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-emerald-800">Closed bills</p>
                <p className="mt-1 text-xs font-medium text-emerald-600">
                  Successfully paid
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-emerald-900">{closedCount}</p>
                <p className="text-xs font-bold text-emerald-600">{closedPercent}%</p>
              </div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-emerald-500"
                style={{ width: `${closedPercent}%` }}
              />
            </div>
          </div>

          <div className="rounded-3xl border border-blue-100 bg-blue-50/70 p-4">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-black text-blue-800">Open bills</p>
                <p className="mt-1 text-xs font-medium text-blue-600">
                  Waiting for payment
                </p>
              </div>

              <div className="text-right">
                <p className="text-2xl font-black text-blue-900">{openCount}</p>
                <p className="text-xs font-bold text-blue-600">{openPercent}%</p>
              </div>
            </div>

            <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
              <div
                className="h-full rounded-full bg-blue-500"
                style={{ width: `${openPercent}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </ChartShell>
  )
}

function BillAmountSplitChart({ openAmount, closedRevenue }) {
  const totalAmount = openAmount + closedRevenue
  const paidPercent = getPercent(closedRevenue, totalAmount)
  const openPercent = getPercent(openAmount, totalAmount)

  const items = [
    {
      name: "Paid Revenue",
      description: "Closed bills",
      amount: closedRevenue,
      percent: paidPercent,
      bar: "from-emerald-500 to-teal-400",
      box: "border-emerald-100 bg-emerald-50/70",
      text: "text-emerald-800",
    },
    {
      name: "Open Bill Amount",
      description: "Unpaid open bills",
      amount: openAmount,
      percent: openPercent,
      bar: "from-blue-500 to-sky-400",
      box: "border-blue-100 bg-blue-50/70",
      text: "text-blue-800",
    },
  ]

  return (
    <ChartShell
      title="Bill Amount Split"
      description="Paid revenue versus unpaid open amount."
      icon={CircleDollarSign}
      action={
        <div className="rounded-full bg-slate-50 px-3 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-100">
          {formatCompactMoney(totalAmount)}
        </div>
      }
    >
      <div className="space-y-4">
        <div className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
            Total bill amount
          </p>
          <p className="mt-2 text-3xl font-black tracking-tight">
            {formatMoney(totalAmount)}
          </p>

          <div className="mt-5 flex h-3 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-emerald-400"
              style={{ width: `${paidPercent}%` }}
            />
            <div
              className="h-full bg-blue-400"
              style={{ width: `${openPercent}%` }}
            />
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <div
              key={item.name}
              className={`rounded-3xl border p-4 ${item.box}`}
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className={`text-sm font-black ${item.text}`}>{item.name}</p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {item.description}
                  </p>
                </div>

                <span className="rounded-full bg-white px-2.5 py-1 text-xs font-black text-slate-700 shadow-sm">
                  {item.percent}%
                </span>
              </div>

              <p className="mt-4 text-xl font-black text-slate-950">
                {formatMoney(item.amount)}
              </p>

              <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-white">
                <div
                  className={`h-full rounded-full bg-gradient-to-r ${item.bar}`}
                  style={{ width: `${Math.max(item.percent, item.amount > 0 ? 6 : 0)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
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
      action={
        <div className="rounded-full bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 ring-1 ring-blue-100">
          7 days
        </div>
      }
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 14, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.blue} stopOpacity={0.32} />
                <stop offset="95%" stopColor={COLORS.blue} stopOpacity={0.02} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <YAxis
              tickFormatter={formatCompactMoney}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke={COLORS.blue}
              strokeWidth={3}
              fill="url(#revenueGradient)"
              activeDot={{
                r: 6,
                strokeWidth: 3,
                stroke: "#ffffff",
                fill: COLORS.blue,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

function BillCountChart({ data }) {
  const totalBills = data.reduce((sum, item) => sum + item.billCount, 0)

  return (
    <ChartShell
      title="Closed Bills"
      description="Number of closed bills grouped by day."
      icon={BadgeDollarSign}
      action={
        <div className="rounded-full bg-purple-50 px-3 py-1 text-xs font-bold text-purple-700 ring-1 ring-purple-100">
          {totalBills} bills
        </div>
      }
    >
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 14, right: 12, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="billCountGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={COLORS.purple} stopOpacity={0.95} />
                <stop offset="100%" stopColor={COLORS.purple} stopOpacity={0.45} />
              </linearGradient>
            </defs>

            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <YAxis
              allowDecimals={false}
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: "#64748b", fontWeight: 600 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar
              dataKey="billCount"
              name="Bills"
              fill="url(#billCountGradient)"
              radius={[14, 14, 6, 6]}
              maxBarSize={46}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartShell>
  )
}

function TopSelectedDishesChart({ data }) {
  const totalQuantity = data.reduce((sum, item) => sum + item.quantity, 0)
  const maxQuantity = Math.max(...data.map((item) => item.quantity), 0)
  const topDish = data[0]

  return (
    <ChartShell
      title="Top Selected Dishes"
      description="Most selected dishes ranked by total ordered quantity."
      icon={Utensils}
      action={
        <div className="rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-700 ring-1 ring-amber-100">
          {totalQuantity} items
        </div>
      }
    >
      {data.length === 0 ? (
        <div className="flex h-72 items-center justify-center rounded-3xl border border-dashed border-slate-200 bg-slate-50 text-sm font-semibold text-slate-500">
          No dish data yet.
        </div>
      ) : (
        <div className="grid gap-5 xl:grid-cols-[340px_1fr]">
          <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 p-6 text-white shadow-lg shadow-orange-200/60">
            <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-white/15" />
            <div className="absolute -bottom-16 -left-16 h-44 w-44 rounded-full bg-white/10" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-black ring-1 ring-white/20">
                <Utensils size={14} />
                Most Popular
              </div>

              <p className="mt-10 text-sm font-bold text-white/75">#1 Dish</p>

              <h3 className="mt-2 text-3xl font-black leading-tight tracking-tight">
                {topDish.name}
              </h3>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <div className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p className="text-xs font-bold text-white/70">Quantity</p>
                  <p className="mt-1 text-3xl font-black">{topDish.quantity}</p>
                </div>

                <div className="rounded-3xl bg-white/15 p-4 ring-1 ring-white/15 backdrop-blur">
                  <p className="text-xs font-bold text-white/70">Amount</p>
                  <p className="mt-2 text-xl font-black">
                    {formatCompactMoney(topDish.amount)}
                  </p>
                </div>
              </div>

              <p className="mt-5 text-xs font-medium leading-5 text-white/75">
                Ranked from all order items returned by the bills API.
              </p>
            </div>
          </div>

          <div className="space-y-3">
            {data.map((item, index) => {
              const percent = maxQuantity
                ? Math.max(6, Math.round((item.quantity / maxQuantity) * 100))
                : 0

              const rankStyle =
                index === 0
                  ? "bg-amber-100 text-amber-700 ring-amber-200"
                  : index === 1
                    ? "bg-slate-100 text-slate-700 ring-slate-200"
                    : index === 2
                      ? "bg-orange-100 text-orange-700 ring-orange-200"
                      : "bg-blue-50 text-blue-700 ring-blue-100"

              return (
                <div
                  key={item.name}
                  className="rounded-3xl border border-slate-100 bg-slate-50/70 p-4 transition duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-md hover:shadow-slate-200"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ring-1 ${rankStyle}`}
                    >
                      #{index + 1}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-black text-slate-950">
                            {item.name}
                          </p>
                          <p className="mt-0.5 text-xs font-semibold text-slate-400">
                            {formatMoney(item.amount)}
                          </p>
                        </div>

                        <div className="shrink-0 text-right">
                          <p className="text-lg font-black text-slate-950">
                            {item.quantity}
                          </p>
                          <p className="text-xs font-semibold text-slate-400">
                            selected
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white ring-1 ring-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
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

  useEffect(() => {
    fetchBills()
  }, [])

  const handleRefresh = () => {
    setRefreshing(true)
    fetchBills()
  }

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

  const amountSummary = useMemo(() => {
    const openAmount = bills
      .filter((bill) => bill.status === "open")
      .reduce((sum, bill) => sum + getBillAmount(bill), 0)

    const closedRevenue = bills
      .filter((bill) => bill.status === "closed")
      .reduce((sum, bill) => sum + getBillAmount(bill), 0)

    return {
      openAmount,
      closedRevenue,
      totalBillAmount: openAmount + closedRevenue,
    }
  }, [bills])

  const closedRevenueValue =
    amountSummary.closedRevenue > 0
      ? amountSummary.closedRevenue
      : toNumber(stats.closed_revenue)

  const topSelectedDishesData = useMemo(() => {
    return getTopSelectedDishes(bills, 8)
  }, [bills])

  const revenueChartData = useMemo(() => {
    const days = getLast7VietnamDays()
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
                  Track bill status, paid revenue, open bill amount, popular dishes,
                  and payment history in one clean dashboard.
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
            hint={formatMoney(amountSummary.openAmount)}
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
            value={formatMoney(closedRevenueValue)}
            icon={Banknote}
            hint="Paid revenue from closed bills"
            tone="purple"
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <StatusChart
            openCount={stats.open_bills || 0}
            closedCount={stats.closed_bills || 0}
          />

          <BillAmountSplitChart
            openAmount={amountSummary.openAmount}
            closedRevenue={closedRevenueValue}
          />
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <RevenueTrendChart data={revenueChartData} />
          <BillCountChart data={revenueChartData} />
        </div>

        <TopSelectedDishesChart data={topSelectedDishesData} />

        <section className="overflow-hidden rounded-[2rem] border border-slate-200/70 bg-white shadow-sm shadow-slate-200/70">
          <div className="border-b border-slate-100 bg-gradient-to-r from-white via-slate-50/80 to-white p-5">
            <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-center">
              <div>
                <h2 className="text-lg font-black text-slate-950">Bill History</h2>
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
                    className="w-full rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm font-semibold text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:w-72"
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
                    className="w-full appearance-none rounded-2xl border border-slate-200 bg-white py-2.5 pl-9 pr-8 text-sm font-semibold text-slate-700 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 md:w-48"
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
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-400">
                  <th className="px-5 py-4 font-black">Bill ID</th>
                  <th className="px-5 py-4 font-black">Table</th>
                  <th className="px-5 py-4 font-black">Status</th>
                  <th className="px-5 py-4 font-black">Orders</th>
                  <th className="px-5 py-4 font-black">Total Amount</th>
                  <th className="px-5 py-4 font-black">Created At</th>
                  <th className="px-5 py-4 font-black">Closed At</th>
                </tr>
              </thead>

              <tbody>
                {filteredBills.length === 0 ? (
                  <tr>
                    <td
                      colSpan={7}
                      className="px-5 py-12 text-center text-sm font-semibold text-slate-500"
                    >
                      No bills found.
                    </td>
                  </tr>
                ) : (
                  filteredBills.map((bill) => (
                    <tr
                      key={bill.id}
                      className="border-b border-slate-100 transition last:border-0 hover:bg-slate-50/80"
                    >
                      <td className="px-5 py-4 font-black text-slate-950">
                        #{bill.id}
                      </td>

                      <td className="px-5 py-4 font-bold text-slate-700">
                        {bill.tables?.name || "-"}
                      </td>

                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-black ${
                            bill.status === "closed"
                              ? "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100"
                              : "bg-blue-50 text-blue-700 ring-1 ring-blue-100"
                          }`}
                        >
                          {bill.status === "closed" ? "Closed" : "Open"}
                        </span>
                      </td>

                      <td className="px-5 py-4">
                        <span className="inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-black text-slate-600">
                          {bill.order_count || 0}
                        </span>
                      </td>

                      <td className="px-5 py-4 font-black text-slate-950">
                        {formatMoney(getBillAmount(bill))}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-500">
                        {formatDate(bill.created_at)}
                      </td>

                      <td className="px-5 py-4 font-medium text-slate-500">
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