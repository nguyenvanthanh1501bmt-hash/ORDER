'use client'

import { useMemo, useState } from 'react'
import {
  ClipboardList,
  Minus,
  Plus,
  Send,
  ShoppingBag,
  StickyNote,
  Trash2,
} from 'lucide-react'
import { addOrder } from './CallingAddorderAPI'
import CustomAlert from '@/components/CustomAlert'

// Format price to Vietnamese currency style.
function formatPrice(price) {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return '0 ₫'
  }

  return `${value.toLocaleString('vi-VN')} ₫`
}

export default function OrderPreview({
  items = [],
  onUpdateNote,
  onUpdateQuantity,
  onDeleteItem,
  onClearItem,
  tableId,
}) {
  const [alertText, setAlertText] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // Calculate order total.
  const total = useMemo(() => {
    return items.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 1),
      0
    )
  }, [items])

  // Show temporary alert.
  const showAlert = (text) => {
    setAlertText(text)
    setTimeout(() => setAlertText(''), 2000)
  }

  // Submit current order to API.
  const handlesubmitOrder = async () => {
    if (submitting) return

    if (!tableId) {
      showAlert('Không tìm thấy bàn. Vui lòng quét lại QR.')
      return
    }

    if (items.length === 0) {
      showAlert('Chưa có món nào')
      return
    }

    try {
      setSubmitting(true)

      await addOrder({
        tableId,
        menuItems: items,
      })

      onClearItem?.()
      showAlert('Order submitted successfully')
    } catch (error) {
      console.error('Failed to submit order:', error)
      showAlert('Failed to submit order')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <aside className="flex h-full min-h-[520px] flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-950/5">
      {/* Header */}
      <div className="border-b border-slate-100 bg-slate-950 px-5 py-5 text-white sm:px-6">
        <div className="flex items-center justify-between gap-3">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 ring-1 ring-white/15">
              <ClipboardList size={14} />
              Current order
            </div>

            <h2 className="text-xl font-extrabold tracking-tight">
              Order Preview
            </h2>

            <p className="mt-1 text-xs text-slate-300">
              Review your items before sending to kitchen.
            </p>
          </div>

          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-white ring-1 ring-white/15">
            <ShoppingBag size={22} />
          </div>
        </div>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto bg-slate-50/70 px-3 py-4 sm:px-4">
        {items.length === 0 ? (
          <div className="flex h-full min-h-80 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-400 select-none">
            <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-slate-50 text-slate-400 ring-1 ring-slate-200">
              <ShoppingBag size={30} />
            </div>

            <h3 className="mt-5 text-base font-bold text-slate-800">
              No items added yet
            </h3>

            <p className="mt-2 max-w-xs text-sm text-slate-500">
              Select food from the menu to start your order.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item, index) => {
              const quantity = Number(item.quantity || 1)
              const itemTotal = Number(item.price || 0) * quantity

              return (
                <div
                  key={item.orderItemId}
                  className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="mb-2 inline-flex rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">
                        Item #{index + 1}
                      </div>

                      <h3 className="line-clamp-2 text-sm font-extrabold leading-5 text-slate-950 sm:text-base">
                        {item.name}
                      </h3>

                      <div className="mt-2 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 ring-1 ring-emerald-100">
                          {formatPrice(item.price)}
                        </span>

                        <span className="rounded-full bg-slate-50 px-2.5 py-1 text-xs font-semibold text-slate-500 ring-1 ring-slate-200">
                          Size: {item.selectedSize || 'Standard'}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => onDeleteItem?.(item.orderItemId)}
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-red-50 text-red-500 transition hover:bg-red-100"
                      aria-label="Remove item"
                    >
                      <Trash2 size={17} />
                    </button>
                  </div>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    {/* Quantity control */}
                    <div className="inline-flex items-center rounded-2xl border border-slate-200 bg-slate-50 p-1">
                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-slate-950"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.orderItemId,
                            Math.max(quantity - 1, 1)
                          )
                        }
                        aria-label="Decrease quantity"
                      >
                        <Minus size={15} />
                      </button>

                      <span className="min-w-10 rounded-xl bg-slate-950 px-3 py-2 text-center text-sm font-extrabold text-white">
                        {quantity}
                      </span>

                      <button
                        type="button"
                        className="flex h-9 w-9 items-center justify-center rounded-xl text-slate-600 transition hover:bg-white hover:text-slate-950"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.orderItemId,
                            quantity + 1
                          )
                        }
                        aria-label="Increase quantity"
                      >
                        <Plus size={15} />
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                        Subtotal
                      </p>

                      <p className="text-base font-extrabold text-slate-950">
                        {formatPrice(itemTotal)}
                      </p>
                    </div>
                  </div>

                  {/* Kitchen note */}
                  <div className="mt-4">
                    <label className="mb-1.5 flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <StickyNote size={13} />
                      Note for kitchen
                    </label>

                    <textarea
                      rows={2}
                      className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-slate-400 focus:bg-white focus:ring-4 focus:ring-slate-100"
                      placeholder="Less sugar, no ice, extra spicy..."
                      value={item.note || ''}
                      onChange={(event) =>
                        onUpdateNote?.(item.orderItemId, event.target.value)
                      }
                    />
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="border-t border-slate-200 bg-white p-4 sm:p-5">
        <div className="mb-4 rounded-3xl bg-slate-50 p-4 ring-1 ring-slate-200">
          <div className="flex items-center justify-between gap-3">
            <span className="text-sm font-bold text-slate-500">
              Total
            </span>

            <span className="text-2xl font-extrabold text-emerald-700">
              {formatPrice(total)}
            </span>
          </div>

          <p className="mt-1 text-xs text-slate-400">
            Final price may include selected size options.
          </p>
        </div>

        <button
          type="button"
          disabled={items.length === 0 || !tableId || submitting}
          onClick={handlesubmitOrder}
          className={`
            inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3.5
            text-sm font-extrabold transition
            ${
              items.length === 0 || !tableId || submitting
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-slate-950 text-white shadow-lg shadow-slate-950/10 hover:bg-slate-800 active:scale-[0.99]'
            }
          `}
        >
          <Send size={17} />
          {submitting ? 'Submitting...' : 'Confirm Order'}
        </button>
      </div>

      <CustomAlert
        text={alertText}
        timeout={2000}
        onclose={() => setAlertText('')}
      />
    </aside>
  )
}