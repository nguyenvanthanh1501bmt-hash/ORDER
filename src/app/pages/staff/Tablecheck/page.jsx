'use client'

import { getTableList } from "@/app/features/Table/Table_list"
import { getOpenBills } from "@/app/features/order/Get_Bill_For_Table"
import { getBillDetail } from "@/app/features/order/Get_Bill_Detail"
import { useCallback, useMemo, useState } from "react"
import TableListUIForTableCheck from "@/app/features/order/TableListUIForTableCheck"
import BillDetailModal from "@/app/features/order/Modal_Bill_Detail"
import CustomAlert from "@/components/CustomAlert"
import { authFetch } from "@/utils/authFetch"
import useOrderRealTime from "@/hooks/useOrderRealTime"

export default function TableCheck() {
  const [tableList, setTableList] = useState([])
  const [openBills, setOpenBills] = useState({})
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const [selectedBill, setSelectedBill] = useState(null)
  const [billDetail, setBillDetail] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [alerttext, setalerttext] = useState(null)
  const [errorText, setErrorText] = useState("")
  const [lastUpdated, setLastUpdated] = useState(null)

  const getBillByTable = useCallback((table) => {
    if (!table) return null

    return (
      openBills[String(table.id)] ||
      openBills[`name:${table.name}`] ||
      openBills[String(table.table_id)] ||
      null
    )
  }, [openBills])

  const tableStats = useMemo(() => {
    const total = tableList.length
    const occupied = tableList.filter((table) => getBillByTable(table)).length
    const available = Math.max(total - occupied, 0)

    return {
      total,
      occupied,
      available,
    }
  }, [tableList, getBillByTable])

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    } else {
      setRefreshing(true)
    }

    try {
      setErrorText("")

      const [tables, bills] = await Promise.all([
        getTableList(),
        getOpenBills(),
      ])

      setTableList(tables || [])

      const billMap = {}

      bills?.forEach((bill) => {
        if (bill.table_id) {
          billMap[String(bill.table_id)] = bill
        }

        if (bill.tables?.id) {
          billMap[String(bill.tables.id)] = bill
        }

        if (bill.tables?.name) {
          billMap[`name:${bill.tables.name}`] = bill
        }
      })

      setOpenBills(billMap)
      setLastUpdated(new Date())
    } catch (err) {
      console.error("Error fetching table check data:", err)
      setTableList([])
      setOpenBills({})
      setErrorText("Cannot load table data. Please try again.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [])

  const {
    realtimeStatus,
    isRealtimeConnected,
  } = useOrderRealTime(
    fetchData,
    setErrorText,
    "table-check-realtime"
  )

  const onViewBill = async (bill) => {
    if (!bill) return

    try {
      const detail = await getBillDetail(bill.id)

      setSelectedBill(bill)
      setBillDetail(detail)
      setShowModal(true)
    } catch (err) {
      console.error("Error fetching bill detail:", err)
      setalerttext("Cannot load bill detail")
    }
  }

  const handlePayment = async (bill) => {
    if (!bill?.id) return

    try {
      const res = await authFetch("/api/bill?action=status", {
        method: "PATCH",
        body: JSON.stringify({
          billId: bill.id,
          id: bill.id,
          tableId: bill.table_id,
          status: "closed",
        }),
      })

      const result = await res.json().catch(() => ({
        message: "Invalid server response",
      }))

      if (!res.ok) {
        console.error("Close bill failed:", result)
        setalerttext(result.message || "Cannot close bill")
        return
      }

      setShowModal(false)
      setSelectedBill(null)
      setBillDetail(null)

      setalerttext("Close bill successfully, now table is available")

      await fetchData(false)
    } catch (err) {
      console.error("System error during payment:", err)
      setalerttext("System error during payment")
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="h-8 w-48 animate-pulse rounded-xl bg-slate-200" />
            <div className="mt-3 h-4 w-80 max-w-full animate-pulse rounded-lg bg-slate-100" />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="h-4 w-24 animate-pulse rounded bg-slate-100" />
                <div className="mt-4 h-8 w-16 animate-pulse rounded bg-slate-200" />
              </div>
            ))}
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                <div
                  key={item}
                  className="h-36 animate-pulse rounded-3xl bg-slate-100"
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-50 p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-gradient-to-r from-slate-900 to-slate-700 p-6 text-white sm:p-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-medium text-white ring-1 ring-white/20">
                    Staff Dashboard
                  </span>

                  <span
                    className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-medium ring-1 ${
                      isRealtimeConnected
                        ? "bg-emerald-400/15 text-emerald-100 ring-emerald-300/30"
                        : "bg-amber-400/15 text-amber-100 ring-amber-300/30"
                    }`}
                  >
                    <span
                      className={`h-2 w-2 rounded-full ${
                        isRealtimeConnected ? "bg-emerald-300" : "bg-amber-300"
                      }`}
                    />
                    {isRealtimeConnected ? "Realtime connected" : realtimeStatus}
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                  Table Check
                </h1>

                <p className="mt-2 max-w-2xl text-sm text-slate-200">
                  Monitor occupied tables, view open bills, and close payments in realtime.
                </p>
              </div>

              <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                {lastUpdated && (
                  <p className="text-xs text-slate-300">
                    Last updated:{" "}
                    <span className="font-medium text-white">
                      {lastUpdated.toLocaleTimeString("vi-VN", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </p>
                )}

                <button
                  type="button"
                  onClick={() => fetchData(false)}
                  disabled={refreshing}
                  className="rounded-2xl bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {refreshing ? "Refreshing..." : "Refresh"}
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-4 sm:grid-cols-3 sm:p-6">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-medium text-slate-500">
                Total tables
              </p>
              <p className="mt-2 text-3xl font-bold text-slate-900">
                {tableStats.total}
              </p>
            </div>

            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <p className="text-sm font-medium text-emerald-700">
                Available
              </p>
              <p className="mt-2 text-3xl font-bold text-emerald-900">
                {tableStats.available}
              </p>
            </div>

            <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
              <p className="text-sm font-medium text-amber-700">
                Occupied
              </p>
              <p className="mt-2 text-3xl font-bold text-amber-900">
                {tableStats.occupied}
              </p>
            </div>
          </div>
        </section>

        {errorText && (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorText}
          </div>
        )}

        <section className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Table Overview
              </h2>
              <p className="text-sm text-slate-500">
                Click checkout on an occupied table to view bill details.
              </p>
            </div>

            {refreshing && (
              <span className="inline-flex w-fit items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
                Updating
              </span>
            )}
          </div>

          {tableList.length === 0 ? (
            <div className="flex min-h-72 flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white text-3xl shadow-sm">
                🪑
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-900">
                No tables found
              </h3>

              <p className="mt-2 max-w-sm text-sm text-slate-500">
                Tables will appear here after they are added to the system.
              </p>

              <button
                type="button"
                onClick={() => fetchData(false)}
                className="mt-5 rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Check again
              </button>
            </div>
          ) : (
            <TableListUIForTableCheck
              table={tableList}
              openBills={openBills}
              onCheckout={onViewBill}
            />
          )}
        </section>
      </div>

      {showModal && (
        <BillDetailModal
          bill={selectedBill}
          billDetail={billDetail}
          onClose={() => {
            setShowModal(false)
            setSelectedBill(null)
            setBillDetail(null)
          }}
          onPayment={handlePayment}
        />
      )}

      <CustomAlert
        text={alerttext}
        timeout={2000}
        onclose={() => setalerttext(null)}
      />
    </main>
  )
}