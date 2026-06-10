'use client'

import Image from 'next/image'
import {
  BadgeDollarSign,
  Check,
  ImageOff,
  X,
} from 'lucide-react'

// Format price to Vietnamese currency style.
function formatPrice(price) {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return '0 ₫'
  }

  return `${value.toLocaleString('vi-VN')} ₫`
}

export default function ChosingSizeForm({
  item,
  selectedSize,
  onSelectSize,
  onClose,
  onConfirm,
}) {
  if (!item) return null

  const selectedIndex = item.options?.indexOf(selectedSize) ?? -1
  const currentPrice =
    selectedIndex >= 0
      ? Number(item.price || 0) + selectedIndex * 5000
      : Number(item.price || 0)

  return (
    <div className="fixed inset-0 z-[9999] flex items-end justify-center bg-slate-950/60 px-3 pb-3 backdrop-blur-sm sm:items-center sm:p-4">
      <div className="flex max-h-[92vh] w-full max-w-lg flex-col overflow-hidden rounded-3xl border border-white/20 bg-white shadow-2xl shadow-slate-950/30">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-100 px-5 py-4">
          <div className="min-w-0">
            <p className="mb-1 text-xs font-bold uppercase tracking-wide text-slate-400">
              Choose option
            </p>

            <h2 className="line-clamp-2 text-lg font-extrabold leading-6 text-slate-950">
              {item.name || 'Unnamed food'}
            </h2>
          </div>

          <button
            type="button"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-red-50 hover:text-red-600"
            onClick={onClose}
            aria-label="Close size modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5">
          {/* Image */}
          <div className="relative mb-5 h-48 overflow-hidden rounded-3xl bg-slate-100 sm:h-56">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name || 'Food image'}
                fill
                sizes="(max-width: 640px) 100vw, 512px"
                className="object-cover"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                <ImageOff size={34} />
                <span className="text-xs font-semibold">
                  No image
                </span>
              </div>
            )}

            {item.sub_category && (
              <div className="absolute left-4 top-4 max-w-[75%] rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                <p className="truncate">
                  {item.sub_category}
                </p>
              </div>
            )}
          </div>

          {/* Current price */}
          <div className="mb-5 rounded-3xl border border-emerald-200 bg-emerald-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">
                  Current price
                </p>

                <p className="mt-1 text-2xl font-extrabold text-emerald-800">
                  {formatPrice(currentPrice)}
                </p>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                <BadgeDollarSign size={24} />
              </div>
            </div>
          </div>

          {/* Size options */}
          <div>
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-extrabold text-slate-950">
                  Select size
                </h3>

                <p className="text-xs text-slate-500">
                  Each larger option adds 5.000 ₫.
                </p>
              </div>

              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {item.options?.length || 0} options
              </span>
            </div>

            <div className="grid gap-2">
              {item.options?.map((size, index) => {
                const isSelected = selectedSize === size
                const optionPrice = Number(item.price || 0) + index * 5000

                return (
                  <button
                    key={`${size}-${index}`}
                    type="button"
                    onClick={() => onSelectSize(size)}
                    className={`
                      flex items-center justify-between gap-3 rounded-2xl border p-4 text-left transition
                      ${
                        isSelected
                          ? 'border-slate-950 bg-slate-950 text-white shadow-lg shadow-slate-950/10'
                          : 'border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:bg-slate-50'
                      }
                    `}
                  >
                    <div className="min-w-0">
                      <p className="font-extrabold">
                        {size}
                      </p>

                      <p
                        className={`
                          mt-1 text-xs font-medium
                          ${isSelected ? 'text-slate-300' : 'text-slate-500'}
                        `}
                      >
                        Option price: {formatPrice(optionPrice)}
                      </p>
                    </div>

                    <div
                      className={`
                        flex h-8 w-8 shrink-0 items-center justify-center rounded-full border
                        ${
                          isSelected
                            ? 'border-white/30 bg-white text-slate-950'
                            : 'border-slate-200 bg-slate-50 text-transparent'
                        }
                      `}
                    >
                      <Check size={16} />
                    </div>
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="border-t border-slate-100 bg-white p-4">
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-2xl bg-slate-100 px-4 py-3 text-sm font-extrabold text-slate-700 transition hover:bg-slate-200"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="button"
              className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
              onClick={onConfirm}
              disabled={!selectedSize}
            >
              Confirm
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}