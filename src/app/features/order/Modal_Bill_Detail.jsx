'use client'

export default function BillDetailModal({ bill, billDetail, onClose, onPayment }) {
  if (!billDetail) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40">
      <div
        className="
          bg-white w-full sm:max-w-xl
          h-[85vh] sm:h-auto
          sm:rounded-xl
          rounded-t-2xl
          shadow-lg
          flex flex-col
        "
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b">
          <div>
            <h2 className="text-base sm:text-lg font-semibold">
              Bill Detail
            </h2>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Table {bill?.tables?.name}
            </p>
          </div>

          <button
            onClick={onClose}
            className="text-gray-500 hover:text-black text-xl leading-none"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 px-4 sm:px-6 py-3 sm:py-4 overflow-y-auto space-y-4">
          {billDetail.orders.map(order => (
            <div key={order.id} className="space-y-2">
              {order.order_items.map(item => (
                <div
                  key={item.id}
                  className="flex justify-between gap-4 border-b pb-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-sm sm:text-base truncate">
                      {item.base_item_name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm sm:text-base font-medium whitespace-nowrap">
                    {(item.unit_price * item.quantity).toLocaleString()}đ
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-4 sm:px-6 py-4 border-t bg-white">
          <div className="flex justify-between items-center text-sm sm:text-base font-semibold">
            <span>Total</span>
            <span className="text-red-600">
              {Number(billDetail.total_amount).toLocaleString()}đ
            </span>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onPayment(bill)}
              className="w-full sm:w-auto px-4 py-2 rounded-lg border text-sm hover:bg-gray-50"
            >
              Pay
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
