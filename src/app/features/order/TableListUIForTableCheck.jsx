'use client'

import { useMemo, useState } from 'react'
import {
  CheckCircle2,
  Copy,
  CreditCard,
  ExternalLink,
  QrCode,
  ReceiptText,
  Table2,
  UtensilsCrossed,
  X,
} from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

// Get bill by table id or table name.
function getBillForTable(tb, openBills) {
  const tableId = tb.id ?? tb.table_id

  return (
    openBills[String(tableId)] ||
    openBills[`name:${tb.name}`] ||
    null
  )
}

// Check if table has an active bill.
function hasActiveBill(bill) {
  const orders = bill?.orders || []

  return orders.some((order) =>
    ['accepted', 'served'].includes(order.status)
  )
}

// Count active orders in a bill.
function getActiveOrderCount(bill) {
  const orders = bill?.orders || []

  return orders.filter((order) =>
    ['accepted', 'served'].includes(order.status)
  ).length
}

function buildOrderUrl(qrCodeId) {
  if (!qrCodeId) return ''

  const value = String(qrCodeId).trim()

  try {
    const url = new URL(value)
    return url.toString()
  } catch {
    if (typeof window === 'undefined') return value

    try {
      const url = new URL(value, window.location.origin)

      // Nếu qr_code_id đang là "/?table=xxx" hoặc "/menu?table=xxx"
      if (url.searchParams.get('table')) {
        return url.toString()
      }
    } catch {
      // ignore
    }

    // Nếu qr_code_id chỉ là token, build thành link order.
    return `${window.location.origin}/?table=${encodeURIComponent(value)}`
  }
}

export default function TableListUIForTableCheck({
  table = [],
  openBills = {},
  onCheckout,
}) {
  const [qrTable, setQrTable] = useState(null)
  const [copied, setCopied] = useState(false)

  const qrOrderUrl = useMemo(() => {
    return buildOrderUrl(qrTable?.qr_code_id)
  }, [qrTable])

  const handleCopyQrLink = async () => {
    if (!qrOrderUrl) return

    try {
      await navigator.clipboard.writeText(qrOrderUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch (error) {
      console.error('Copy QR link failed:', error)
    }
  }

  if (table.length === 0) {
    return (
      <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-slate-700 shadow-sm ring-1 ring-slate-200">
          <UtensilsCrossed size={30} />
        </div>

        <h3 className="mt-5 text-lg font-semibold text-slate-900">
          No tables available
        </h3>

        <p className="mt-2 max-w-sm text-sm text-slate-500">
          Tables will appear here after they are added to the system.
        </p>
      </div>
    )
  }

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {table.map((tb) => {
          const tableId = tb.id ?? tb.table_id
          const tableName = tb.name ?? tableId
          const qrCodeId = tb.qr_code_id || null

          const bill = getBillForTable(tb, openBills)
          const occupied = hasActiveBill(bill)
          const activeOrderCount = getActiveOrderCount(bill)

          return (
            <article
              key={tableId ?? tableName}
              className={`
                group flex min-h-[220px] flex-col overflow-hidden rounded-3xl border bg-white shadow-sm transition
                hover:-translate-y-0.5 hover:shadow-lg
                ${
                  occupied
                    ? 'border-red-200 ring-1 ring-red-100'
                    : 'border-emerald-200 ring-1 ring-emerald-100'
                }
              `}
            >
              {/* Card header */}
              <div
                className={`
                  border-b p-5
                  ${
                    occupied
                      ? 'border-red-100 bg-red-50'
                      : 'border-emerald-100 bg-emerald-50'
                  }
                `}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex min-w-0 items-center gap-3">
                    <div
                      className={`
                        flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ring-1
                        ${
                          occupied
                            ? 'bg-white text-red-600 ring-red-100'
                            : 'bg-white text-emerald-600 ring-emerald-100'
                        }
                      `}
                    >
                      <Table2 size={23} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-500">
                        Restaurant table
                      </p>

                      <h3 className="truncate text-xl font-extrabold text-slate-950">
                        Table {tableName}
                      </h3>
                    </div>
                  </div>

                  <span
                    className={`
                      inline-flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1 text-xs font-extrabold ring-1
                      ${
                        occupied
                          ? 'bg-white text-red-700 ring-red-200'
                          : 'bg-white text-emerald-700 ring-emerald-200'
                      }
                    `}
                  >
                    {occupied ? (
                      <>
                        <ReceiptText size={13} />
                        Occupied
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={13} />
                        Available
                      </>
                    )}
                  </span>
                </div>
              </div>

              {/* Card body */}
              <div className="flex flex-1 flex-col p-5">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Bill
                    </p>
                    <p className="mt-1 truncate text-sm font-extrabold text-slate-900">
                      {bill?.id ? `#${bill.id}` : 'None'}
                    </p>
                  </div>

                  <div className="rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                      Orders
                    </p>
                    <p className="mt-1 text-sm font-extrabold text-slate-900">
                      {activeOrderCount}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex-1 rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-4">
                  {occupied ? (
                    <p className="text-sm leading-6 text-slate-600">
                      This table has an open bill. Click checkout to view bill detail and close payment.
                    </p>
                  ) : (
                    <p className="text-sm leading-6 text-slate-500">
                      This table is available and ready to serve the next customer.
                    </p>
                  )}
                </div>

                {/* Show QR button */}
                <button
                  type="button"
                  disabled={!qrCodeId}
                  onClick={() => {
                    setCopied(false)
                    setQrTable(tb)
                  }}
                  className={`
                    mt-4 inline-flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold shadow-sm transition active:scale-[0.99]
                    ${
                      qrCodeId
                        ? 'bg-slate-900 text-white hover:bg-slate-700'
                        : 'cursor-not-allowed bg-slate-200 text-slate-500'
                    }
                  `}
                >
                  <QrCode size={17} />
                  Show QR for customer
                </button>

                {/* Checkout action */}
                {occupied ? (
                  <button
                    type="button"
                    onClick={() => onCheckout?.(bill)}
                    className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-red-600 px-4 py-3 text-sm font-extrabold text-white shadow-sm transition hover:bg-red-700 active:scale-[0.99]"
                  >
                    <CreditCard size={17} />
                    Checkout
                  </button>
                ) : (
                  <div className="mt-3 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-extrabold text-emerald-700 ring-1 ring-emerald-100">
                    <CheckCircle2 size={17} />
                    Ready to serve
                  </div>
                )}
              </div>
            </article>
          )
        })}
      </div>

      {/* QR Modal */}
      {qrTable && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Customer order QR
                </p>
                <h2 className="text-lg font-extrabold text-slate-950">
                  Table {qrTable.name ?? qrTable.id}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setQrTable(null)}
                className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-5">
              <div className="flex justify-center rounded-3xl border border-slate-200 bg-white p-5">
                {qrOrderUrl ? (
                  <QRCodeSVG
                    value={qrOrderUrl}
                    size={240}
                    level="H"
                    includeMargin
                  />
                ) : (
                  <div className="flex h-60 w-60 items-center justify-center rounded-2xl bg-slate-100 text-sm font-semibold text-slate-500">
                    No QR available
                  </div>
                )}
              </div>

              <div className="mt-4 rounded-2xl bg-slate-50 p-3 ring-1 ring-slate-100">
                <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                  Order link
                </p>
                <p className="mt-1 break-all text-xs font-semibold text-slate-700">
                  {qrOrderUrl || 'No QR link'}
                </p>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!qrOrderUrl}
                  onClick={handleCopyQrLink}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-extrabold text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-200 disabled:text-slate-500"
                >
                  <Copy size={16} />
                  {copied ? 'Copied' : 'Copy link'}
                </button>

                <a
                  href={qrOrderUrl || '#'}
                  target="_blank"
                  rel="noreferrer"
                  className={`
                    inline-flex items-center justify-center gap-2 rounded-2xl px-4 py-3 text-sm font-extrabold transition
                    ${
                      qrOrderUrl
                        ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-100 hover:bg-emerald-100'
                        : 'pointer-events-none bg-slate-100 text-slate-400'
                    }
                  `}
                >
                  <ExternalLink size={16} />
                  Open
                </a>
              </div>

              <p className="mt-4 text-center text-xs text-slate-400">
                Show this screen to the customer so they can scan the QR code and order at this table.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}