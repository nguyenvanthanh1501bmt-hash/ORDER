'use client'

export default function OrderPreview({
  items = [],
  onUpdateNote,
  onUpdateQuantity,
  onDeleteItem,
}) {
  if (items.length === 0) {
    return <p className="text-gray-400 italic">No items in order</p>
  }

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  )

  return (
    <div className="border rounded-lg p-6 flex flex-col h-full bg-white shadow-md">
      <h2 className="font-bold text-xl mb-5 border-b pb-2">
        Order Preview
      </h2>

      <div className="flex-1 overflow-y-auto space-y-4">
        {items.map((item, index) => (
          <div key={item.id} className="flex justify-between items-start border-b pb-4">
            <div className="flex-1">
              <p className="text-gray-700 font-semibold">
                {index + 1}. {item.name}
              </p>

              {/* Quantity & Size */}
              <div className="flex items-center gap-6 mt-2">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-gray-600">Qty:</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={() =>
                      onUpdateQuantity?.(item.id, Math.max((item.quantity ?? 1) - 1, 1))
                    }
                  >
                    -
                  </button>
                  <span className="px-2">{item.quantity ?? 1}</span>
                  <button
                    className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300 transition"
                    onClick={() =>
                      onUpdateQuantity?.(item.id, (item.quantity ?? 1) + 1)
                    }
                  >
                    +
                  </button>
                </div>

                <div>
                  <span className="font-medium text-gray-600">Size:</span>
                  <span className="ml-1 text-gray-800">{item.selectedSize || 'N/A'}</span>
                </div>
              </div>

              {/* Note */}
              <textarea
                rows={1}
                className="mt-2 w-full border border-gray-300 rounded-lg px-3 py-1 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
                placeholder="Add a note..."
                value={item.note || ''}
                onChange={(e) =>
                  onUpdateNote?.(item.id, e.target.value)
                }
              />
            </div>

            {/* Price */}
            <p className="font-semibold text-gray-800 ml-4 whitespace-nowrap">
              {(item.price * (item.quantity ?? 1)).toLocaleString()} ₫
            </p>
          </div>
        ))}
      </div>

      {/* Total + Confirm */}
      <div className="border-t pt-4 mt-6">
        <div className="flex justify-between items-center mb-4">
          <span className="font-semibold text-lg">Total</span>
          <span className="font-bold text-xl text-gray-600">{total.toLocaleString()} ₫</span>
        </div>

        <button className="w-full bg-gray-600 text-white py-3 rounded-lg font-semibold hover:bg-gray-700 transition">
          Confirm Order
        </button>
      </div>
    </div>
  )
}
