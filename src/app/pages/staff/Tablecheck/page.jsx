'use client'

import { getTableList } from "@/app/features/Table/Table_list"
import { getOpenBills } from "@/app/features/order/Get_Bill_For_Table"
import { getBillDetail } from "@/app/features/order/Get_Bill_Detail"
import { useEffect, useState } from "react"
import TableListUIForTableCheck from "@/app/features/order/TableListUIForTableCheck"
import BillDetailModal from "@/app/features/order/Modal_Bill_Detail"
import CustomAlert from "@/components/CustomAlert"
import { authFetch } from "@/utils/authFetch"

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

      console.log("TABLE LIST:", tables)
      console.log("OPEN BILLS:", bills)
      console.log("BILL MAP:", billMap)

      setOpenBills(billMap)
    } catch (err) {
      console.error("Error fetching table check data:", err)
      setTableList([])
      setOpenBills({})
    } finally {
      setLoading(false)
    }
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