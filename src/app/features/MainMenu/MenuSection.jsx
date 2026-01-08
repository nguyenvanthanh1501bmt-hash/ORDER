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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
            group relative bg-white rounded-2xl border
            shadow-sm hover:shadow-xl
            transition-all duration-300
            cursor-pointer overflow-hidden
          "
        >
          {/* Image */}
          <div className="relative h-48 bg-gray-100">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                sizes="(max-width: 768px) 100vw,
                      (max-width: 1024px) 50vw,
                      33vw"
                className="
                  object-cover
                  group-hover:scale-105
                  transition-transform duration-300
                "
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400 text-sm">
                No image
              </div>
            )}

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />

            {/* Add button */}
            <div className="
              absolute bottom-4 right-4
              bg-white text-gray-800
              p-3 rounded-full shadow-lg
              opacity-0 scale-90
              group-hover:opacity-100 group-hover:scale-100 hover:bg-blue-400 hover:text-white 
              transition-all
            ">
              <Plus size={20} />
            </div>
          </div>

          {/* Content */}
          <div className="p-5 flex flex-col gap-2">
            <h2 className="font-semibold text-gray-900 text-base leading-tight line-clamp-1">
              {item.name}
            </h2>

            <p className="text-xs text-gray-500 line-clamp-1">
              {item.sub_category}
            </p>

            {/* Price */}
            <div className="mt-1">
              <span className="text-lg font-bold text-gray-900">
                {item.price?.toLocaleString()} ₫
              </span>
            </div>

            {/* Sizes */}
            {item.options && item.options.length > 0 && (
              <div className="mt-2 flex gap-2 flex-wrap">
                {item.options.map((size, index) => (
                  <span
                    key={index}
                    className="
                      text-xs px-3 py-1 rounded-full
                      bg-gray-100 text-gray-700
                      border border-gray-200
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
    </div>
  )
}
