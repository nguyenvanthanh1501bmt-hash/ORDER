export default function SupportOrderItems({ order }) {
  if (!order?.order_items?.length) return null

  return (
    <div className="mt-3 space-y-2 rounded-lg border border-gray-200 bg-white p-2">
      {order.order_items.map(item => (
        <div
          key={item.id}
          className="rounded-md border border-gray-100 bg-gray-50 px-3 py-2"
        >
          <div className="flex items-start gap-3">
            <span className="flex h-7 min-w-8 items-center justify-center rounded-md bg-gray-200 text-sm font-semibold text-gray-900">
              {item.quantity}×
            </span>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-semibold text-gray-900">
                  {item.base_item_name}
                </span>

                {item.selected_options?.size && (
                  <span className="rounded-full bg-white px-2 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-300">
                    {item.selected_options.size}
                  </span>
                )}
              </div>

              {item.note && (
                <div className="mt-1 text-sm text-gray-500 italic">
                  <span className="font-medium not-italic text-gray-600">
                    Note:
                  </span>{' '}
                  {item.note}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
