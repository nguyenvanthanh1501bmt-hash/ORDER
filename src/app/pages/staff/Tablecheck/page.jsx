'use client'

import { getTableList } from "@/app/features/Table/Table_list"
import { getOpenBills } from "@/app/features/order/Get_Bill_For_Table"
import { getBillDetail } from "@/app/features/order/Get_Bill_Detail"
import { useCallback, useEffect, useState } from "react"
import TableListUIForTableCheck from "@/app/features/order/TableListUIForTableCheck"
import BillDetailModal from "@/app/features/order/Modal_Bill_Detail"
import CustomAlert from "@/components/CustomAlert"
import { authFetch } from "@/utils/authFetch"
import client from "@/api/client"

export default function TableCheck() {
  const [tableList, setTableList] = useState([])
  const [openBills, setOpenBills] = useState({})
  const [loading, setLoading] = useState(true)

  const [selectedBill, setSelectedBill] = useState(null)
  const [billDetail, setBillDetail] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [alerttext, setalerttext] = useState(null)

  const fetchData = useCallback(async (showLoading = true) => {
    if (showLoading) {
      setLoading(true)
    }

    try {
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
    } catch (err) {
      console.error("Error fetching table check data:", err)
      setTableList([])
      setOpenBills({})
    } finally {
      if (showLoading) {
        setLoading(false)
      }
    }
  }, [])

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

  useEffect(() => {
    let reloadTimer = null

    const scheduleReload = () => {
      clearTimeout(reloadTimer)

      reloadTimer = setTimeout(() => {
        fetchData(false)
      }, 300)
    }

    fetchData(true)

    const channel = client
      .channel("table-check-realtime")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "bills" },
        scheduleReload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders" },
        scheduleReload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_items" },
        scheduleReload
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "tables" },
        scheduleReload
      )
      .subscribe((status, err) => {
        if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error("Realtime error:", status, err)
        }
      })

    return () => {
      clearTimeout(reloadTimer)
      client.removeChannel(channel)
    }
  }, [fetchData])

  return (
    <div className="p-6">
      <h1 className="text-lg font-semibold mb-4">
        Table Check
      </h1>

      {loading ? (
        <p className="text-sm text-muted-foreground">
          Loading tables...
        </p>
      ) : (
        <TableListUIForTableCheck
          table={tableList}
          openBills={openBills}
          onCheckout={onViewBill}
        />
      )}

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
    </div>
  )
}