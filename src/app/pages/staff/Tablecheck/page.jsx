'use client'

import { getTableList } from "@/app/features/Table/Table_list"
import { getOpenBills } from "@/app/features/order/Get_Bill_For_Table"
import { getBillDetail } from "@/app/features/order/Get_Bill_Detail"
import { useEffect, useState } from "react"
import TableListUIForTableCheck from "@/app/features/order/TableListUIForTableCheck"
import BillDetailModal from "@/app/features/order/Modal_Bill_Detail"

export default function TableCheck() {
  const [tableList, setTableList] = useState([])
  const [openBills, setOpenBills] = useState({})
  const [loading, setLoading] = useState(true)

  const [selectedBill, setSelectedBill] = useState(null)
  const [billDetail, setBillDetail] = useState(null)
  const [showModal, setShowModal] = useState(false)

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

      if (!res.ok) throw new Error("Payment failed")
    
      // Close modal
      console.log("Bill id: ",bill.id)
      setShowModal(false)
      setSelectedBill(null)
      setBillDetail(null)

      // Reload data
      await fetchData()
    } catch (err) {
      console.error("Error during payment:", err)
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
    </div>
  )
}
