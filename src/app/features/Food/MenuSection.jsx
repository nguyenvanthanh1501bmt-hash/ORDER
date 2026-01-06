'use client'

import { useState } from 'react'
import Image from 'next/image'
import ChosingSizeForm from '../MainMenu/ChosingSize'

export default function FoodlistUIatMainMenu({ foodItems = [], onFoodSelect }) {
  const [activeItem, setActiveItem] = useState(null)
  const [selectedSize, setSelectedSize] = useState(null)

  if (foodItems.length === 0) {
    return <p className="text-gray-500">No food items available</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {foodItems.map((item) => (
        <div
          key={item.id}
          className="border rounded-lg p-4 flex flex-col gap-2 bg-white hover:shadow-md transition-shadow cursor-pointer"
          onClick={() => {
            if (!item.options || item.options.length === 0) {
              onFoodSelect?.({ ...item, quantity: 1 })
            } else {
              setActiveItem(item)
              setSelectedSize(null)
            }
          }}
        >
          <div className="w-full h-40 relative">
            {item.image_url ? (
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover rounded"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400">
                No image
              </div>
            )}
          </div>

          <h2 className="font-semibold">{item.name}</h2>
          <p className="text-sm text-gray-600 line-clamp-2">{item.sub_category}</p>

          {/* Sizes */}
          {item.options && item.options.length > 0 && (
            <div className="mt-2 flex gap-2 flex-wrap">
              {item.options.map((size, index) => (
                <span key={index} className="text-sm bg-gray-100 px-2 py-1 rounded">
                  {size} - {(item.price + index * 5000).toLocaleString()} ₫
                </span>
              ))}
            </div>
          )}

          {/* Price without size */}
          {(!item.options || item.options.length === 0) && (
            <p className="font-bold">{item.price?.toLocaleString()} ₫</p>
          )}
        </div>
      ))}

      {/* Modal form chọn size */}
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
