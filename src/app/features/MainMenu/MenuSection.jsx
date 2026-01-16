'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus } from 'lucide-react'
import ChosingSizeForm from './ChosingSize'

export default function FoodlistUIatMainMenu({ foodItems = [], onFoodSelect }) {
  const [activeItem, setActiveItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  if (foodItems.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-400 italic">
        No food items available
      </div>
    )
  }

  return (
    <>
      {/* GRID: 2 món / dòng trên mobile */}
      <div
        className="
          grid
          grid-cols-2
          sm:grid-cols-2
          md:grid-cols-3
          lg:grid-cols-3
          xl:grid-cols-4
          gap-4
        "
      >
        {foodItems.map((item) => (
          <div
            key={item.id}
            onClick={() => {
              if (!item.options || item.options.length === 0) {
                onFoodSelect?.({ ...item, quantity: 1 })
              } else {
                setActiveItem(item)
                setSelectedSize(null)
              }
            }}
            className="
              group bg-white rounded-xl border
              shadow-sm hover:shadow-md
              transition cursor-pointer
              overflow-hidden
            "
          >
            {/* Image */}
            <div className="relative h-36 sm:h-40 bg-gray-100">
              {item.image_url ? (
                <Image
                  src={item.image_url}
                  alt={item.name}
                  fill
                  sizes="(max-width: 640px) 50vw,
                         (max-width: 1024px) 33vw,
                         25vw"
                  className="
                    object-cover
                    group-hover:scale-105
                    transition-transform duration-300
                  "
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">
                  No image
                </div>
              )}

              {/* Add button */}
              <div
                className="
                  absolute bottom-2 right-2
                  bg-white text-gray-800
                  p-2 rounded-full shadow
                  opacity-100
                  hover:bg-gray-800 hover:text-white
                  transition
                "
              >
                <Plus size={16} />
              </div>
            </div>

            {/* Content */}
            <div className="p-3 flex flex-col gap-1">
              <h2 className="font-semibold text-gray-900 text-sm line-clamp-2">
                {item.name}
              </h2>

              <p className="text-xs text-gray-500 line-clamp-1">
                {item.sub_category}
              </p>

              <span className="text-sm font-bold text-gray-900 mt-1">
                {item.price?.toLocaleString()} ₫
              </span>

              {/* Sizes */}
              {item.options && item.options.length > 0 && (
                <div className="mt-1 flex gap-1 flex-wrap">
                  {item.options.map((size, index) => (
                    <span
                      key={index}
                      className="
                        text-[10px]
                        px-2 py-0.5
                        rounded-full
                        bg-gray-100 text-gray-700
                        border
                      "
                    >
                      {size}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Modal chọn size */}
      {activeItem && activeItem.options && (
        <ChosingSizeForm
          item={activeItem}
          selectedSize={selectedSize}
          onSelectSize={setSelectedSize}
          onClose={() => setActiveItem(null)}
          onConfirm={() => {
            onFoodSelect({
              ...activeItem,
              quantity: 1,
              selectedSize,
              price:
                activeItem.price +
                (activeItem.options.indexOf(selectedSize) || 0) * 5000,
            })
            setActiveItem(null)
          }}
        />
      )}
    </>
  )
}
