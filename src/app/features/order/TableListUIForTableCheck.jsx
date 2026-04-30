'use client'

import { CreditCard, Table2 } from 'lucide-react'

export default function TableListUIForTableCheck({
  table = [],
  openBills = {},
  onCheckout,
}) {
  if (table.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No tables available
      </p>
    )
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {table.map((tb) => {
        const tableId = tb.id ?? tb.table_id

        const bill =
          openBills[String(tableId)] ||
          openBills[`name:${tb.name}`]

        const orders = bill?.orders || []

        const hasOpenBill = orders.some((order) =>
          ['accepted', 'served'].includes(order.status)
        )

        return (
          <div
            key={tb.id ?? tb.table_id ?? tb.name}
            className={`
              group relative rounded-xl border
              p-4 sm:p-5
              transition-all duration-200
              hover:shadow-md
              ${
                hasOpenBill
                  ? 'border-red-400 bg-red-50/60'
                  : 'border-emerald-400 bg-emerald-50/60'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table2
                  className={`w-4 h-4 ${
                    hasOpenBill
                      ? 'text-red-500'
                      : 'text-emerald-500'
                  }`}
                />

                <span className="font-semibold text-sm sm:text-base">
                  Table {tb.name ?? tb.id}
                </span>
              </div>

              <span
                className={`
                  text-[10px] sm:text-xs
                  px-2 py-0.5 rounded-full font-medium
                  ${
                    hasOpenBill
                      ? 'bg-red-100 text-red-600'
                      : 'bg-emerald-100 text-emerald-600'
                  }
                `}
              >
                {hasOpenBill ? 'Occupied' : 'Available'}
              </span>
            </div>

            <div className="my-3 border-t border-dashed" />

            {hasOpenBill ? (
              <button
                onClick={() => onCheckout(bill)}
                className="
                  w-full flex items-center justify-center gap-2
                  text-sm font-medium
                  bg-red-500 text-white
                  rounded-lg py-2
                  hover:bg-red-600
                  active:scale-[0.98]
                  transition
                "
              >
                <CreditCard className="w-4 h-4" />
                Checkout
              </button>
            ) : (
              <div className="text-center text-xs sm:text-sm text-muted-foreground">
                Ready to serve
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}