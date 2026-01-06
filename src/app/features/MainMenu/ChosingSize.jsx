'use client'

import Image from 'next/image'

export default function ChosingSizeForm({ item, selectedSize, onSelectSize, onClose, onConfirm }) {
  if (!item) return null

  const selectedIndex = item.options.indexOf(selectedSize)
  const currentPrice = selectedIndex >= 0 ? item.price + selectedIndex * 5000 : item.price

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-96 p-6 relative">
        {/* Close button */}
        <button
            className="absolute top-2 right-2 text-gray-500 hover:text-red-600 transition cursor-pointer font-bold"
            onClick={onClose}
        >
            ✕
        </button>

        {/* Image */}
        {item.image_url && (
          <div className="w-full h-48 relative rounded-lg overflow-hidden mb-4">
            <Image
              src={item.image_url}
              alt={item.name}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Name & category */}
        <h2 className="text-xl font-bold mb-1">{item.name}</h2>
        <p className="text-sm text-gray-500 mb-4">{item.sub_category}</p>

        {/* Price */}
        <p className="text-lg font-semibold mb-4">
          {currentPrice.toLocaleString()} ₫
        </p>

        {/* Size options */}
        <div className="flex flex-wrap gap-2 mb-6">
          {item.options.map((size, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded-lg font-medium border cursor-pointer ${
                selectedSize === size
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200'
              } transition`}
              onClick={() => onSelectSize(size)}
            >
              {size} - {(item.price + index * 5000).toLocaleString()} ₫
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex justify-end gap-3">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition cursor-pointer"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
