'use client'

import { CreditCard, Table2 } from 'lucide-react'

/**
 * TableListUIForTableCheck
 *
 * Purpose:
 * - Display list of tables
 * - Show table status (Available / Occupied)
 * - Allow checkout action for tables with open bills
 *
 * Props:
 * @param {Array} table       - List of tables
 * @param {Object} openBills  - Map: tableId -> bill object
 * @param {Function} onCheckout - Trigger checkout for selected bill
 */
export default function TableListUIForTableCheck({
  table = [],
  openBills = {},
  onCheckout,
}) {
  // Empty state
  if (table.length === 0) {
    return (
      <p className="text-sm text-muted-foreground italic">
        No tables available
      </p>
    )
  }

  return (
    /**
     * Responsive grid
     * - 2 columns on mobile
     * - 3 columns on small screens
     * - 4 columns on desktop
     */
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4">
      {table.map((tb) => {
        // Get open bill for current table (if exists)
        const bill = openBills[tb.id]

        // Determine table status
        const hasOpenBill = bill?.status === 'open'

        return (
          /**
           * Table Card
           * - Green: Available
           * - Red: Occupied
           */
          <div
            key={tb.id}
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
            {/* ================= Header ================= */}
            <div className="flex items-center justify-between">
              {/* Table name + icon */}
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

              {/* Status badge */}
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

            {/* Divider between header and action */}
            <div className="my-3 border-t border-dashed" />

            {/* ================= Footer / Action ================= */}
            {hasOpenBill ? (
              /**
               * Checkout button
               * Visible only when table has an open bill
               */
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
              /**
               * Available state (no action)
               */
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
