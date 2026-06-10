'use client'

import Link from 'next/link'
import {
  ArrowRight,
  ClipboardList,
  Clock3,
  ShieldCheck,
  UtensilsCrossed,
  Zap,
} from 'lucide-react'

export default function StaffPage() {
  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Hero section */}
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-700 px-6 py-10 text-white sm:px-8 sm:py-14 lg:px-10 lg:py-16">
            <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute -bottom-24 left-10 h-56 w-56 rounded-full bg-emerald-400/20 blur-3xl" />

            <div className="relative z-10 grid gap-10 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
              <div>
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                  <Zap size={14} />
                  Staff workspace
                </div>

                <h1 className="max-w-3xl text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl">
                  Manage orders and tables in realtime.
                </h1>

                <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-300 sm:text-base">
                  Use this dashboard to receive incoming customer orders, approve or reject requests,
                  track table status, and close bills quickly.
                </p>

                <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/pages/staff/order"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-extrabold text-slate-950 shadow-sm transition hover:bg-slate-100 active:scale-[0.99]"
                  >
                    View Orders
                    <ArrowRight size={17} />
                  </Link>

                  <Link
                    href="/pages/staff/Tablecheck"
                    className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white/10 px-5 py-3 text-sm font-extrabold text-white ring-1 ring-white/20 transition hover:bg-white/15 active:scale-[0.99]"
                  >
                    Check Tables
                    <UtensilsCrossed size={17} />
                  </Link>
                </div>
              </div>

              {/* Hero card */}
              <div className="rounded-3xl border border-white/15 bg-white/10 p-5 shadow-2xl shadow-slate-950/20 backdrop-blur-xl">
                <div className="rounded-3xl bg-white p-5 text-slate-950">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-slate-500">
                        Today&apos;s focus
                      </p>
                      <h2 className="mt-1 text-2xl font-extrabold">
                        Fast service
                      </h2>
                    </div>

                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                      <ClipboardList size={25} />
                    </div>
                  </div>

                  <div className="mt-6 grid gap-3">
                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                        <ShieldCheck size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Confirm new orders
                        </p>
                        <p className="text-xs text-slate-500">
                          Approve, reject, or mark served.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                        <UtensilsCrossed size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Monitor tables
                        </p>
                        <p className="text-xs text-slate-500">
                          View open bills and close payment.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 rounded-2xl bg-slate-50 p-4 ring-1 ring-slate-100">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 ring-1 ring-amber-100">
                        <Clock3 size={19} />
                      </div>

                      <div>
                        <p className="text-sm font-bold text-slate-900">
                          Realtime updates
                        </p>
                        <p className="text-xs text-slate-500">
                          New orders appear automatically.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Quick action cards */}
        <section className="grid gap-4 md:grid-cols-2">
          <Link
            href="/pages/staff/order"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 ring-1 ring-blue-100">
                  <ClipboardList size={23} />
                </div>

                <h3 className="text-lg font-extrabold text-slate-950">
                  Incoming Orders
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View new orders from customers and update their status.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-900"
              />
            </div>
          </Link>

          <Link
            href="/pages/staff/Tablecheck"
            className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100">
                  <UtensilsCrossed size={23} />
                </div>

                <h3 className="text-lg font-extrabold text-slate-950">
                  Table Check
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Check open bills, review bill details, and complete payments.
                </p>
              </div>

              <ArrowRight
                size={20}
                className="mt-1 text-slate-300 transition group-hover:translate-x-1 group-hover:text-slate-900"
              />
            </div>
          </Link>
        </section>
      </div>
    </main>
  )
}