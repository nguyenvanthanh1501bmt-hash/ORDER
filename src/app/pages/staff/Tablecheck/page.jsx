'use client'

import { getTableList } from "@/app/features/Table/Table_list"
import { getOpenBills } from "@/app/features/order/Get_Bill_For_Table"
import { getBillDetail } from "@/app/features/order/Get_Bill_Detail"
import { useEffect, useState } from "react"
import TableListUIForTableCheck from "@/app/features/order/TableListUIForTableCheck"
import BillDetailModal from "@/app/features/order/Modal_Bill_Detail"
import CustomAlert from "@/app/components/CustomAlert"

export default function TableCheck() {
  const [tableList, setTableList] = useState([])
  const [openBills, setOpenBills] = useState({})
  const [loading, setLoading] = useState(true)

  const [selectedBill, setSelectedBill] = useState(null)
  const [billDetail, setBillDetail] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const [alerttext, setalerttext] = useState(null)

  const fetchData = async () => {
    setLoading(true)

    const [tables, bills] = await Promise.all([
      getTableList(),
      getOpenBills(),
    ])

    if (tables) setTableList(tables)

    const billMap = {}
    bills?.forEach(bill => {
      billMap[bill.table_id] = bill
    })

    setOpenBills(billMap)
    setLoading(false)
  }

  const onViewBill = async (bill) => {
    if (!bill) return

    const detail = await getBillDetail(bill.id)

    setSelectedBill(bill)
    setBillDetail(detail)
    setShowModal(true)
  }

  const handlePayment = async (bill) => {
    if (!bill?.id) return

    try {
      const res = await fetch("/api/bill/update-bill-status", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bill_id: bill.id }),
      })

      const result = await res.json()

      if (!res.ok) {
        setalerttext(result.message || "Cannot close bill")
        return
      }

      // SUCCESS
      setShowModal(false)
      setSelectedBill(null)
      setBillDetail(null)

      setalerttext("closeBill successfully, now table are available")

      await fetchData()
    } catch (err) {
      console.error("System error during payment:", err)
      setalerttext("System error during payment")
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

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
