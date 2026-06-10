'use client'

import {
  CheckCircle2,
  ChevronDown,
  ClipboardList,
  Clock3,
  Hash,
  PackageCheck,
  Table2,
  Trash2,
  XCircle,
} from 'lucide-react'
import SupportShowOrderItems from '@/app/features/order/SupportOrderItems'

// Render order status badge.
function StatusBadge({ status }) {
  if (status === 'pending_staff_approval') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-extrabold text-amber-700">
        <Clock3 size={13} />
        Pending
      </span>
    )
  }

  if (status === 'accepted') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-extrabold text-emerald-700">
        <CheckCircle2 size={13} />
        Accepted
      </span>
    )
  }

  return (
    <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-100 px-3 py-1 text-xs font-extrabold text-slate-600">
      {status || 'Unknown'}
    </span>
  )
}

// Get table display name safely.
function getTableName(order) {
  return (
    order?.bills?.tables?.name ||
    order?.bills?.table_id ||
    order?.table_id ||
    'N/A'
  )
}

// Count order items safely.
function getItemCount(order) {
  return order?.order_items?.length || 0
}

export default function OrderAvailableUI({
  orders = [],
  expandedOrders,
  toggleOrder,
  onApprove,
  onReject,
  onDone,
}) {
  // Show empty state when there are no active orders.
  if (orders.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <ClipboardList size={30} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No active orders
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          New customer orders will appear here automatically when they are submitted.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4">
      {orders.map((order) => {
        const isOpen = expandedOrders.has(order.id)
        const isPending = order.status === 'pending_staff_approval'
        const isAccepted = order.status === 'accepted'
        const tableName = getTableName(order)
        const itemCount = getItemCount(order)

        return (
          <article
            key={order.id}
            className={`
              overflow-hidden rounded-3xl border bg-white shadow-sm transition
              ${
                isOpen
                  ? 'border-slate-300 shadow-lg shadow-slate-950/5'
                  : 'border-slate-200 hover:border-slate-300 hover:shadow-md'
              }
            `}
          >
            {/* Order header */}
            <button
              type="button"
              onClick={() => toggleOrder(order.id)}
              className="flex w-full items-center justify-between gap-4 p-4 text-left transition hover:bg-slate-50 sm:p-5"
            >
              <div className="flex min-w-0 flex-1 items-start gap-4">
                <div
                  className={`
                    flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl
                    ${
                      isPending
                        ? 'bg-amber-50 text-amber-700 ring-1 ring-amber-100'
                        : 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100'
                    }
                  `}
                >
                  {isPending ? <Clock3 size={22} /> : <PackageCheck size={22} />}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <h3 className="truncate text-base font-extrabold text-slate-950 sm:text-lg">
                      Table {tableName}
                    </h3>

                    <StatusBadge status={order.status} />
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-500">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
                      <Hash size={12} />
                      Order {order.id}
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
                      <ClipboardList size={12} />
                      {itemCount} items
                    </span>

                    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1">
                      <Table2 size={12} />
                      Staff review
                    </span>
                  </div>
                </div>
              </div>

              <div
                className={`
                  flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 transition
                  ${isOpen ? 'rotate-180 bg-slate-950 text-white' : ''}
                `}
              >
                <ChevronDown size={18} />
              </div>
            </button>

            {/* Dropdown content */}
            <div
              className={`
                overflow-hidden transition-[max-height,opacity,transform] duration-300 ease-out
                ${
                  isOpen
                    ? 'max-h-[1200px] opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-2'
                }
              `}
            >
              <div className="border-t border-slate-100 bg-slate-50 p-4 sm:p-5">
                {/* Order items */}
                <div className="rounded-3xl border border-slate-200 bg-white p-4">
                  <SupportShowOrderItems order={order} />
                </div>

                {/* Action bar */}
                <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:justify-end">
                  {isPending && (
                    <>
                      <button
                        type="button"
                        onClick={() => onReject(order.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50 px-4 py-3 text-sm font-extrabold text-red-600 ring-1 ring-red-100 transition hover:bg-red-100 sm:w-auto"
                      >
                        <XCircle size={17} />
                        Reject
                      </button>

                      <button
                        type="button"
                        onClick={() => onApprove(order.id)}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-emerald-700 sm:w-auto"
                      >
                        <CheckCircle2 size={17} />
                        Approve
                      </button>
                    </>
                  )}

                  {isAccepted && (
                    <button
                      type="button"
                      onClick={() => onDone(order.id)}
                      className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-slate-800 sm:w-auto"
                    >
                      <PackageCheck size={17} />
                      Mark as served
                    </button>
                  )}
                </div>
              </div>
            </div>
          </article>
        )
      })}
    </div>
  )
}