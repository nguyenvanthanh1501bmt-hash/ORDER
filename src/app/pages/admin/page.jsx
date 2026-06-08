'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  ArrowRight,
  BarChart3,
  ChefHat,
  ClipboardList,
  Clock3,
  CreditCard,
  LayoutDashboard,
  ReceiptText,
  Table2,
  Utensils,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { authFetch } from '@/utils/authFetch'

const fallbackStats = {
  revenueToday: 4800,
  revenueChangePercent: 12.4,
  activeBills: 24,
  pendingBills: 6,
  occupiedTables: 18,
  totalTables: 24,
  avgPrepTimeMinutes: 14,
  prepTimeChangeMinutes: -3,
}

const quickLinks = [
  {
    label: 'Dashboard',
    href: '/pages/admin/dashboard',
    description: 'View daily revenue, activity, and restaurant performance.',
    icon: LayoutDashboard,
  },
  {
    label: 'Bills',
    href: '/pages/admin/Bill',
    description: 'Manage customer bills, payments, and checkout status.',
    icon: ReceiptText,
  },
  {
    label: 'Tables',
    href: '/pages/admin/Table',
    description: 'Track table availability, seating, and current service status.',
    icon: Table2,
  },
  {
    label: 'Menu',
    href: '/pages/admin/Food',
    description: 'Update food items, pricing, categories, and availability.',
    icon: Utensils,
  },
]

const kitchenQueue = [
  {
    item: 'Grilled Salmon Set',
    location: 'Table 07',
    status: 'Preparing',
    progress: '78%',
  },
  {
    item: 'Truffle Pasta',
    location: 'Table 12',
    status: 'Cooking',
    progress: '54%',
  },
  {
    item: 'Signature Steak',
    location: 'VIP Room',
    status: 'Queued',
    progress: '32%',
  },
]

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}

function formatSignedPercent(value) {
  if (value > 0) {
    return `+${value}%`
  }

  return `${value}%`
}

function getPrepTimeDescription(value) {
  if (value < 0) {
    return `${Math.abs(value)}m faster than usual`
  }

  if (value > 0) {
    return `${value}m slower than usual`
  }

  return 'Same as usual'
}

export default function AdminPage() {
  const [adminStats, setAdminStats] = useState(fallbackStats)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [statsError, setStatsError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function fetchAdminStats() {
      try {
        setIsStatsLoading(true)
        setStatsError('')

        const response = await authFetch('/api/admin/stats', {
          method: 'GET',
          cache: 'no-store',
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          const message = errorData?.message || 'Failed to fetch admin stats'
          throw new Error(message)
        }

        const data = await response.json()

        if (isMounted) {
          setAdminStats({
            revenueToday: Number(data.revenueToday ?? 0),
            revenueChangePercent: Number(data.revenueChangePercent ?? 0),
            activeBills: Number(data.activeBills ?? 0),
            pendingBills: Number(data.pendingBills ?? 0),
            occupiedTables: Number(data.occupiedTables ?? 0),
            totalTables: Number(data.totalTables ?? 0),
            avgPrepTimeMinutes: Number(data.avgPrepTimeMinutes ?? 0),
            prepTimeChangeMinutes: Number(data.prepTimeChangeMinutes ?? 0),
          })
        }
      } catch (err) {
        if (isMounted) {
          setAdminStats(fallbackStats)
          setStatsError(
            err?.message || 'Using sample stats because the API is not available.'
          )
        }
      } finally {
        if (isMounted) {
          setIsStatsLoading(false)
        }
      }
    }

    fetchAdminStats()

    return () => {
      isMounted = false
    }
  }, [])

  const tableUsagePercent =
    adminStats.totalTables > 0
      ? Math.round((adminStats.occupiedTables / adminStats.totalTables) * 100)
      : 0

  const stats = [
    {
      label: "Today's revenue",
      value: formatCurrency(adminStats.revenueToday),
      description: `${formatSignedPercent(adminStats.revenueChangePercent)} from yesterday`,
      icon: CreditCard,
    },
    {
      label: 'Active bills',
      value: String(adminStats.activeBills),
      description: `${adminStats.pendingBills} waiting for payment`,
      icon: ReceiptText,
    },
    {
      label: 'Occupied tables',
      value: `${adminStats.occupiedTables}/${adminStats.totalTables}`,
      description: `${tableUsagePercent}% floor capacity`,
      icon: Table2,
    },
    {
      label: 'Avg. prep time',
      value: `${adminStats.avgPrepTimeMinutes}m`,
      description: getPrepTimeDescription(adminStats.prepTimeChangeMinutes),
      icon: Clock3,
    },
  ]

  return (
    <main className="min-h-screen bg-slate-50 text-slate-950">
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-medium text-amber-700">
                <ChefHat className="size-4" />
                Restaurant admin workspace
              </div>

              <div className="mt-5 max-w-2xl">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                  Manage restaurant operations in one place.
                </h1>

                <p className="mt-4 text-base leading-7 text-slate-600">
                  Monitor today&apos;s service, review bills, control tables,
                  and keep your menu ready for the next rush hour.
                </p>
              </div>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-slate-950 text-white hover:bg-slate-800"
                >
                  <Link href="/pages/admin/dashboard">
                    Open dashboard
                    <ArrowRight className="size-4" />
                  </Link>
                </Button>

                <Button asChild size="lg" variant="outline">
                  <Link href="/pages/admin/Bill">
                    Review bills
                    <ReceiptText className="size-4" />
                  </Link>
                </Button>
              </div>

              {statsError ? (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                  {statsError}
                </div>
              ) : null}
            </div>

            <div className="rounded-3xl border border-slate-900 bg-slate-950 p-5 text-white shadow-xl shadow-slate-200">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-400">Live service</p>
                  <h2 className="mt-1 text-xl font-semibold">Today overview</h2>
                </div>

                <div className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-medium text-emerald-300">
                  {isStatsLoading ? 'Syncing' : 'Open now'}
                </div>
              </div>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Revenue today</p>
                    <BarChart3 className="size-4 text-amber-300" />
                  </div>

                  <p className="mt-3 text-2xl font-semibold">
                    {formatCurrency(adminStats.revenueToday)}
                  </p>

                  <div className="mt-4 flex h-20 items-end gap-1.5">
                    {[42, 58, 36, 70, 52, 82, 64].map((height) => (
                      <div
                        key={height}
                        className="w-full rounded-full bg-white/20"
                        style={{ height }}
                      />
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-slate-400">Table usage</p>
                    <Table2 className="size-4 text-amber-300" />
                  </div>

                  <p className="mt-3 text-2xl font-semibold">
                    {tableUsagePercent}%
                  </p>

                  <div className="mt-5 space-y-3">
                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>Occupied tables</span>
                        <span>
                          {adminStats.occupiedTables}/{adminStats.totalTables}
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-2 rounded-full bg-amber-300"
                          style={{ width: `${tableUsagePercent}%` }}
                        />
                      </div>
                    </div>

                    <div>
                      <div className="mb-1 flex justify-between text-xs text-slate-400">
                        <span>Pending bills</span>
                        <span>{adminStats.pendingBills}</span>
                      </div>
                      <div className="h-2 rounded-full bg-white/10">
                        <div className="h-2 w-2/3 rounded-full bg-emerald-300" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-400">Kitchen queue</p>
                    <h3 className="font-medium">Active preparation</h3>
                  </div>
                  <ClipboardList className="size-4 text-amber-300" />
                </div>

                <div className="space-y-3">
                  {kitchenQueue.map((order) => (
                    <div key={`${order.item}-${order.location}`}>
                      <div className="flex items-start justify-between gap-3 text-sm">
                        <div>
                          <p className="font-medium text-white">{order.item}</p>
                          <p className="mt-0.5 text-xs text-slate-400">
                            {order.location} · {order.status}
                          </p>
                        </div>

                        <span className="text-xs font-medium text-slate-300">
                          {order.progress}
                        </span>
                      </div>

                      <div className="mt-2 h-1.5 rounded-full bg-white/10">
                        <div
                          className="h-1.5 rounded-full bg-amber-300"
                          style={{ width: order.progress }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon

            return (
              <div
                key={stat.label}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="rounded-xl bg-slate-100 p-2.5 text-slate-700">
                    <Icon className="size-5" />
                  </div>

                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                    {isStatsLoading ? 'Loading' : 'Live'}
                  </span>
                </div>

                <div className="mt-5">
                  <p className="text-sm font-medium text-slate-500">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-slate-950">
                    {stat.value}
                  </p>
                  <p className="mt-1 text-sm text-slate-500">
                    {stat.description}
                  </p>
                </div>
              </div>
            )
          })}
        </div>

        <div className="mt-5 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-medium text-amber-700">Quick access</p>
              <h2 className="mt-1 text-2xl font-semibold tracking-tight text-slate-950">
                Manage core restaurant modules
              </h2>
            </div>

            <Button asChild variant="outline">
              <Link href="/pages/admin/dashboard">
                View full dashboard
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {quickLinks.map((link) => {
              const Icon = link.icon

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:-translate-y-0.5 hover:border-amber-200 hover:bg-amber-50/60 hover:shadow-sm"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="rounded-xl bg-white p-2.5 text-slate-700 shadow-sm ring-1 ring-slate-200 transition group-hover:text-amber-700">
                      <Icon className="size-5" />
                    </div>

                    <ArrowRight className="size-4 text-slate-400 transition group-hover:translate-x-1 group-hover:text-amber-700" />
                  </div>

                  <h3 className="mt-4 font-semibold text-slate-950">
                    {link.label}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-slate-500">
                    {link.description}
                  </p>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}