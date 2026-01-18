'use client'

import { Trash2, ShoppingBag } from 'lucide-react'
import { addOrder } from './CallingAddorderAPI'
import CustomAlert from '@/app/components/CustomAlert'
import { useState } from 'react'

export default function OrderPreview({
  items = [],
  onUpdateNote,
  onUpdateQuantity,
  onDeleteItem,
  onClearItem,
  tableId,
}) {
  const [alertText, setAlertText] = useState('')

  const total = items.reduce(
    (sum, item) => sum + item.price * (item.quantity ?? 1),
    0
  )

  const handlesubmitOrder = async () => {
    try {
      await addOrder({ tableId: tableId, menuItems: items })
      onClearItem?.()
      setAlertText('Order submitted successfully')
      setTimeout(() => setAlertText(''), 2000)
    } catch (error) {
      console.error('Failed to submit order:', error)
      setAlertText('Failed to submit order')
    }
  }

  return (
    <div className="flex flex-col h-full bg-white rounded-xl shadow-lg border">

      {/* Header */}
      <div className="px-6 py-4 border-b">
        <h2 className="text-xl font-bold text-gray-800">
          Order Preview
        </h2>
      </div>

      {/* Item list */}
      <div className="flex-1 overflow-y-auto px-4 py-4">
        {items.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400 select-none">
            <ShoppingBag size={48} className="mb-3 opacity-40" />
            <p className="text-sm italic">No items added yet</p>
            <p className="text-xs mt-1">Select food from menu to start order</p>
          </div>
        ) : (
          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.orderItemId}
                className="rounded-lg border bg-gray-50 p-4"
              >
                <div className="flex justify-between items-start">
                  <p className="font-semibold text-gray-800">
                    {index + 1}. {item.name}
                  </p>
                  <button
                    onClick={() => onDeleteItem?.(item.orderItemId)}
                    className="text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="flex justify-between items-center mt-3">
                  <div className="flex items-center gap-3">
                    <div className="flex items-center border rounded-md overflow-hidden">
                      <button
                        className="px-3 py-1"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.orderItemId,
                            Math.max(item.quantity - 1, 1)
                          )
                        }
                      >
                        −
                      </button>

                      <span className="px-4 py-1 text-sm font-semibold bg-gray-800 text-white rounded-md min-w-9 text-center">
                        {item.quantity}
                      </span>

                      <button
                        className="px-3 py-1"
                        onClick={() =>
                          onUpdateQuantity?.(
                            item.orderItemId,
                            item.quantity + 1
                          )
                        }
                      >
                        +
                      </button>
                    </div>

                    <span className="text-sm text-gray-600">
                      Size: <b>{item.selectedSize || 'N/A'}</b>
                    </span>
                  </div>

                  <p className="font-semibold text-gray-700">
                    {(item.price * item.quantity).toLocaleString()} ₫
                  </p>
                </div>

                <textarea
                  rows={1}
                  className="mt-3 w-full rounded-md border px-3 py-2 text-sm resize-none"
                  placeholder="Note for kitchen..."
                  value={item.note || ''}
                  onChange={(e) =>
                    onUpdateNote?.(item.orderItemId, e.target.value)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Footer — DÍNH SÁT ĐÁY */}
      <div className="border-t bg-white px-6 py-4 sticky bottom-0">
        <div className="flex justify-between items-center mb-4">
          <span className="text-lg font-semibold text-gray-700">Total</span>
          <span className="text-2xl font-bold text-gray-800">
            {total.toLocaleString()} ₫
          </span>
        </div>

        <button
          disabled={items.length === 0}
          onClick={handlesubmitOrder}
          className={`w-full py-3 rounded-lg font-semibold
            ${items.length === 0
              ? 'bg-gray-300 text-gray-500'
              : 'bg-gray-800 text-white hover:bg-gray-900'
            }`}
        >
          Confirm Order
        </button>
      </div>

      <CustomAlert text={alertText} />
    </div>
  )
}
