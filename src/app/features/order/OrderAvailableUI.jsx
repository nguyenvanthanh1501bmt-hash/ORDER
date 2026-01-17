'use client'

import SupportShowOrderItems from '@/app/features/order/SupportOrderItems'

export default function OrderAvailableUI({
  orders,
  expandedOrders,
  toggleOrder,
  onApprove,
  onReject,
  onDone,
}) {
  return (
    <div className="mx-auto w-full max-w-3xl px-3 sm:px-0">
      {/* Page title */}
      <h1 className="mb-6 text-xl sm:text-2xl font-bold">
        Orders Pending Staff Approval
      </h1>

      {/* Empty state */}
      {orders.length === 0 ? (
        <p className="text-sm text-gray-500">
          No pending orders for staff approval.
        </p>
      ) : (
        orders.map(order => {
          const isOpen = expandedOrders.has(order.id)
          const isPending = order.status === 'pending_staff_approval'
          const isAccepted = order.status === 'accepted'

          return (
            <div
              key={order.id}
              className={`
                mb-4 rounded-xl border bg-white
                transition-shadow
                ${isOpen
                  ? 'border-gray-300 shadow-md'
                  : 'border-gray-200 hover:shadow-sm'}
              `}
            >
              {/* ================= HEADER ================= */}
              <div
                onClick={() => toggleOrder(order.id)}
                className="
                  flex items-center justify-between
                  cursor-pointer select-none
                  px-4 py-3
                "
              >
                <div className="space-y-1">
                  {/* Table info */}
                  <p className="text-sm text-gray-500">
                    Table
                    <span className="ml-1 font-medium text-gray-800">
                      {order.bills?.tables?.name}
                    </span>
                  </p>

                  {/* Order ID + Status */}
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-xs text-gray-400">
                      Order ID: {order.id}
                    </p>

                    {isPending && (
                      <span className="rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-medium text-yellow-700">
                        PENDING
                      </span>
                    )}

                    {isAccepted && (
                      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                        ACCEPTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Arrow indicator */}
                <span
                  className={`
                    text-gray-400 transition-transform duration-300
                    ${isOpen ? 'rotate-180' : ''}
                  `}
                >
                  ▼
                </span>
              </div>

              {/* ================= DROPDOWN ================= */}
              <div
                className={`
                  overflow-hidden
                  transition-[max-height,opacity,transform]
                  duration-300 ease-out
                  ${isOpen
                    ? 'max-h-[800px] opacity-100 translate-y-0'
                    : 'max-h-0 opacity-0 -translate-y-2'}
                `}
              >
                <div className="border-t bg-gray-50 px-4 pb-4">
                  {/* Order items */}
                  <SupportShowOrderItems order={order} />

                  {/* ================= ACTION BAR ================= */}
                  <div
                    className="
                      mt-4 flex flex-col gap-2
                      sm:flex-row sm:justify-end
                    "
                  >
                    {/* Pending actions */}
                    {isPending && (
                      <>
                        <button
                          onClick={() => onApprove(order.id)}
                          className="
                            w-full sm:w-auto
                            rounded-md bg-green-600
                            px-4 py-2 text-sm font-medium text-white
                            hover:bg-green-700
                          "
                        >
                          Approve
                        </button>

                        <button
                          onClick={() => onReject(order.id)}
                          className="
                            w-full sm:w-auto
                            rounded-md bg-red-500
                            px-4 py-2 text-sm font-medium text-white
                            hover:bg-red-600
                          "
                        >
                          Reject
                        </button>
                      </>
                    )}

                    {/* Accepted → Done */}
                    {isAccepted && (
                      <button
                        onClick={() => onDone(order.id)}
                        className="
                          w-full sm:w-auto
                          rounded-md bg-gray-300
                          px-4 py-2 text-sm font-medium text-gray-700
                        "
                      >
                        Done
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
