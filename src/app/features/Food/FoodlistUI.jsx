'use client'

import Image from "next/image"
import {
  BadgeDollarSign,
  ChefHat,
  Hash,
  ImageOff,
  Pencil,
  Trash2,
} from "lucide-react"

// Format food price to Vietnamese currency style.
function formatPrice(price) {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return "0 ₫"
  }

  return `${value.toLocaleString("vi-VN")} ₫`
}

export default function FoodTable({ foods = [], onEdit, onDelete }) {
  // Show empty state when there are no food items.
  if (foods.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <ChefHat size={30} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No food items found
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Food items will appear here after they are added to the menu.
        </p>
      </div>
    )
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {foods.map((food) => (
        <article
          key={food.id}
          className="group overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
        >
          {/* Food image */}
          <div className="relative h-44 overflow-hidden bg-slate-100">
            {food.image_url ? (
              <Image
                src={food.image_url}
                alt={food.name || "Food image"}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                className="object-cover transition duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                <ImageOff size={34} />
                <span className="text-xs font-medium">
                  No image
                </span>
              </div>
            )}

            <div className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
              <Hash size={12} />
              {food.id}
            </div>
          </div>

          {/* Food content */}
          <div className="space-y-4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h3 className="truncate text-base font-bold text-slate-900">
                  {food.name || "Unnamed food"}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Menu item
                </p>
              </div>

              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-900 text-white">
                <ChefHat size={18} />
              </div>
            </div>

            {/* Price */}
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
                    Base price
                  </p>

                  <p className="mt-1 text-xl font-bold text-emerald-900">
                    {formatPrice(food.price)}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200">
                  <BadgeDollarSign size={22} />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => onEdit(food)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-50 px-3 py-2.5 text-sm font-semibold text-blue-600 transition hover:bg-blue-100"
              >
                <Pencil size={16} />
                Edit
              </button>

              <button
                type="button"
                onClick={() => onDelete(food)}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100"
              >
                <Trash2 size={16} />
                Delete
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  )
}