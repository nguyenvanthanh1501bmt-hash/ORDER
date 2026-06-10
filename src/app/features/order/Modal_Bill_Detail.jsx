'use client'

import { useMemo, useState } from "react"
import {
  CreditCard,
  ReceiptText,
  X,
} from "lucide-react"

// Format price to Vietnamese currency style.
function formatPrice(price) {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return "0 đ"
  }

  return `${value.toLocaleString("vi-VN")} đ`
}

export default function BillDetailModal({
  bill,
  billDetail,
  onClose,
  onPayment,
}) {
  const [loading, setLoading] = useState(false)

  // Flatten order items to make rendering simpler.
  const billItems = useMemo(() => {
    return (
      billDetail?.orders?.flatMap((order) =>
        order.order_items?.map((item) => ({
          ...item,
          orderId: order.id,
        })) || []
      ) || []
    )
  }, [billDetail])

  // Calculate total from bill detail.
  const totalAmount = Number(billDetail?.total_amount || 0)

  // Submit payment action.
  const handlePay = async () => {
    if (!bill || loading) return

    try {
      setLoading(true)
      await onPayment(bill)
    } finally {
      setLoading(false)
    }
  }

  if (!billDetail) return null

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/30 sm:rounded-3xl">
        {/* Header */}
        <div className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
                <ReceiptText size={14} />
                Bill Detail
              </div>

              <h2 className="truncate text-xl font-extrabold tracking-tight">
                Table {bill?.tables?.name || bill?.table_id || "N/A"}
              </h2>

              <p className="mt-1 text-xs text-slate-300">
                Review order items before closing the bill.
              </p>
            </div>

            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white transition hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-50"
              aria-label="Close bill detail"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto bg-white p-4 sm:p-5">
          {billItems.length === 0 ? (
            <div className="flex min-h-64 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
                <ReceiptText size={30} />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No bill items
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                This bill does not have any order items yet.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {billItems.map((item, index) => {
                const quantity = Number(item.quantity || 1)
                const unitPrice = Number(item.unit_price || 0)
                const itemTotal = unitPrice * quantity

                return (
                  <div
                    key={item.id}
                    className="rounded-3xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-2 inline-flex rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-500 ring-1 ring-slate-200">
                          Item #{index + 1}
                        </div>

                        <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-950 sm:text-base">
                          {item.base_item_name || "Unnamed item"}
                        </h3>

                        <div className="mt-2 flex flex-wrap items-center gap-2">
                          <span className="rounded-full bg-white px-2.5 py-1 text-xs font-bold text-slate-600 ring-1 ring-slate-200">
                            Qty: {quantity}
                          </span>

                          <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                            Unit: {formatPrice(unitPrice)}
                          </span>
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                          Subtotal
                        </p>
                        <p className="mt-1 text-base font-extrabold text-slate-950">
                          {formatPrice(itemTotal)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-100 bg-white p-4 sm:p-5">
          <div className="mb-4 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm font-bold text-slate-500">
                Grand total
              </span>

              <span className="text-2xl font-extrabold text-red-600">
                {formatPrice(totalAmount)}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handlePay}
              disabled={loading || billItems.length === 0}
              className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
            >
              <CreditCard size={17} />
              {loading ? "Processing..." : "Pay bill"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}