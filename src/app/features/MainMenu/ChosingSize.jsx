'use client'

import Image from 'next/image'

export default function ChosingSizeForm({
  item,
  selectedSize,
  onSelectSize,
  onClose,
  onConfirm,
}) {
  if (!item) return null

  const selectedIndex = item.options.indexOf(selectedSize)
  const currentPrice =
    selectedIndex >= 0 ? item.price + selectedIndex * 5000 : item.price

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center px-3">
      <div
        className="
          bg-white rounded-xl
          shadow-xl
          w-full sm:w-[420px]
          max-h-[90vh]
          flex flex-col
        "
      >
        {/* Header */}
        <div className="relative p-4 border-b">
          <h2 className="text-lg font-semibold pr-8">{item.name}</h2>
          <button
            className="absolute top-3 right-3 text-gray-500 hover:text-red-600 font-bold"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4">
          {/* Image */}
          {item.image_url && (
            <div className="w-full h-40 sm:h-48 relative rounded-lg overflow-hidden mb-4">
              <Image
                src={item.image_url}
                alt={item.name}
                fill
                className="object-cover"
              />
            </div>
          )}

          {/* Category */}
          <p className="text-sm text-gray-500 mb-2">
            {item.sub_category}
          </p>

          {/* Price */}
          <p className="text-lg font-semibold mb-4">
            {currentPrice.toLocaleString()} ₫
          </p>

          {/* Size options */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            {item.options.map((size, index) => (
              <button
                key={index}
                onClick={() => onSelectSize(size)}
                className={`
                  px-3 py-2 rounded-lg text-sm font-medium border
                  ${
                    selectedSize === size
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
                  }
                `}
              >
                {size} – {(item.price + index * 5000).toLocaleString()} ₫
              </button>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="p-4 border-t flex gap-3">
          <button
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            onClick={onConfirm}
            disabled={!selectedSize}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  )
}
