'use client'

import { useState } from 'react'
import Image from 'next/image'
import {
  ChefHat,
  ImageOff,
  Plus,
  ShoppingCart,
} from 'lucide-react'
import ChosingSizeForm from './ChosingSize'

// Format price to Vietnamese currency style.
function formatPrice(price) {
  const value = Number(price)

  if (!Number.isFinite(value)) {
    return '0 ₫'
  }

  return `${value.toLocaleString('vi-VN')} ₫`
}

export default function FoodlistUIatMainMenu({ foodItems = [], onFoodSelect }) {
  const [activeItem, setActiveItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  // Handle selecting a food item.
  const handleSelectFood = (item) => {
    const hasOptions = item.options && item.options.length > 0

    if (!hasOptions) {
      onFoodSelect?.({
        ...item,
        quantity: 1,
      })
      return
    }

    setActiveItem(item)
    setSelectedSize(item.options[0] || null)
  }

  // Handle confirming selected size.
  const handleConfirmSize = () => {
    if (!activeItem) return

    const sizeIndex = activeItem.options?.indexOf(selectedSize) ?? 0
    const extraPrice = Math.max(sizeIndex, 0) * 5000

    onFoodSelect?.({
      ...activeItem,
      quantity: 1,
      selectedSize,
      price: Number(activeItem.price || 0) + extraPrice,
    })

    setActiveItem(null)
    setSelectedSize(null)
  }

  // Show empty state when no food is available.
  if (foodItems.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <ChefHat size={30} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No food items available
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Please check again later or ask the staff for today&apos;s menu.
        </p>
      </div>
    )
  }

  return (
    <>
      {/* Food grid */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {foodItems.map((item) => {
          const hasOptions = item.options && item.options.length > 0

          return (
            <article
              key={item.id}
              role="button"
              tabIndex={0}
              onClick={() => handleSelectFood(item)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  handleSelectFood(item)
                }
              }}
              className="
                group flex h-full min-h-[410px] flex-col overflow-hidden
                rounded-3xl border border-slate-200 bg-white
                shadow-sm transition
                hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg
                active:scale-[0.99]
              "
            >
              {/* Food image */}
              <div className="relative h-40 shrink-0 overflow-hidden bg-slate-100 sm:h-44">
                {item.image_url ? (
                  <Image
                    src={item.image_url}
                    alt={item.name || 'Food image'}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    className="object-cover transition duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-2 text-slate-400">
                    <ImageOff size={28} />
                    <span className="text-xs font-medium">
                      No image
                    </span>
                  </div>
                )}

                {/* Category badge */}
                {item.sub_category && (
                  <div className="absolute left-3 top-3 max-w-[75%] rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-slate-700 shadow-sm backdrop-blur">
                    <p className="truncate">
                      {item.sub_category}
                    </p>
                  </div>
                )}

                {/* Floating add icon */}
                <div className="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-lg transition group-hover:scale-105">
                  <Plus size={19} />
                </div>
              </div>

              {/* Food content */}
              <div className="flex flex-1 flex-col p-4">
                {/* Name area */}
                <div className="min-h-[56px]">
                  <h2 className="line-clamp-2 text-base font-extrabold leading-6 text-slate-950">
                    {item.name || 'Unnamed food'}
                  </h2>

                  <p className="mt-1 text-xs font-medium text-slate-400">
                    Menu item
                  </p>
                </div>

                {/* Price area */}
                <div className="mt-4 rounded-2xl bg-emerald-50 px-3 py-3 ring-1 ring-emerald-100">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                    Price
                  </p>

                  <p className="mt-1 text-lg font-extrabold text-emerald-800">
                    {formatPrice(item.price)}
                  </p>
                </div>

                {/* Reserved options area to keep all cards equal */}
                <div className="mt-3 min-h-[38px]">
                  {hasOptions ? (
                    <div className="flex flex-wrap gap-1.5">
                      {item.options.slice(0, 3).map((size, index) => (
                        <span
                          key={`${item.id}-${size}-${index}`}
                          className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-600"
                        >
                          {size}
                        </span>
                      ))}

                      {item.options.length > 3 && (
                        <span className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                          +{item.options.length - 3}
                        </span>
                      )}
                    </div>
                  ) : (
                    <span className="inline-flex rounded-full bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-400 ring-1 ring-slate-100">
                      Standard
                    </span>
                  )}
                </div>

                {/* Bottom button */}
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation()
                    handleSelectFood(item)
                  }}
                  className="
                    mt-auto inline-flex w-full items-center justify-center gap-2
                    rounded-2xl bg-slate-950 px-4 py-3
                    text-sm font-extrabold text-white
                    transition hover:bg-slate-800
                  "
                >
                  <ShoppingCart size={16} />
                  {hasOptions ? 'Choose options' : 'Add to order'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* Size selection modal */}
      {activeItem && activeItem.options && (
        <ChosingSizeForm
          item={activeItem}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onClose={() => {
            setActiveItem(null)
            setSelectedSize(null)
          }}
          onConfirm={handleConfirmSize}
        />
      )}
    </>
  )
}