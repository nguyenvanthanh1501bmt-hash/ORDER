import { supabaseAdmin } from "@/api/adminClient"

function getAppBaseUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "")

  const baseUrl = appUrl.replace(/\/$/, "")

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_APP_URL. Please set NEXT_PUBLIC_APP_URL in .env.local"
    )
  }

  return baseUrl
}

function generateNewTableQRCode(tableId) {
  const baseUrl = getAppBaseUrl()
  const randomText = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const token = `table-${tableId}-${randomText}`

  return `${baseUrl}/?table=${encodeURIComponent(token)}`
}

async function refreshTableQRCode(tableId) {
  if (!tableId) return null

  const newQRCode = generateNewTableQRCode(tableId)

  const { data, error } = await supabaseAdmin
    .from("tables")
    .update({ qr_code_id: newQRCode })
    .eq("id", tableId)
    .select("id, name, qr_code_id")
    .single()

  if (error) throw error

  console.log("UPDATED TABLE QR:", data)

  return data.qr_code_id
}

// Get all open bills
export async function getOpenBills() {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      status,
      table_id,
      tables (
        id,
        name
      ),
      orders (
        id,
        status
      )
    `)
    .eq("status", "open")

  if (error) throw error

  return data || []
}

// Get bill detail by billId
export async function getBillDetail(billId) {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      closed_at,
      orders (
        id,
        status,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          note,
          base_item_name,
          selected_options,
          menu_item_id,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .eq("id", billId)
    .maybeSingle()

  if (error) throw error

  return data
}

function calcOrderItemsTotal(orders = []) {
  return orders
    .flatMap((order) => order.order_items || [])
    .reduce((sum, item) => {
      const quantity = Number(item.quantity || 0)
      const price = Number(item.unit_price ?? item.menu_items?.price ?? 0)

      return sum + quantity * price
    }, 0)
}

function calcBillAmount(bill) {
  const itemTotal = calcOrderItemsTotal(bill.orders || [])
  const savedTotal = Number(bill.total_amount || 0)

  if (bill.status === "closed") {
    return savedTotal > 0 ? savedTotal : itemTotal
  }

  return itemTotal > 0 ? itemTotal : savedTotal
}

// Close bill by bill_id
export async function closeBill(billId) {
  const { data: bill, error: billError } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .eq("id", billId)
    .eq("status", "open")
    .maybeSingle()

  if (billError) throw billError

  if (!bill) return null

  const totalAmount = calcBillAmount(bill)

  const { data: closedBill, error: updateError } = await supabaseAdmin
    .from("bills")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      total_amount: totalAmount,
    })
    .eq("id", bill.id)
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      closed_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .maybeSingle()

  if (updateError) throw updateError

  if (closedBill?.table_id) {
    const newQRCode = await refreshTableQRCode(closedBill.table_id)

    return {
      ...closedBill,
      new_qr_code_id: newQRCode,
    }
  }

  return closedBill
}

// Close bill by tableId and recalculate total
export async function closeBillByTable(tableId) {
  const { data: bill, error: billError } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .eq("status", "open")
    .eq("table_id", tableId)
    .maybeSingle()

  if (billError) throw billError

  if (!bill) {
    throw new Error("Không có hóa đơn đang mở cho bàn này")
  }

  const totalAmount = calcBillAmount(bill)

  const { data: closedBill, error: updateError } = await supabaseAdmin
    .from("bills")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
      total_amount: totalAmount,
    })
    .eq("id", bill.id)
    .select(`
      id,
      table_id,
      status,
      total_amount,
      created_at,
      closed_at,
      orders (
        id,
        status,
        order_items (
          id,
          quantity,
          unit_price,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .single()

  if (updateError) throw updateError

  const newQRCode = await refreshTableQRCode(closedBill.table_id)

  return {
    ...closedBill,
    new_qr_code_id: newQRCode,
  }
}

export async function getAllBillsWithStats() {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      status,
      table_id,
      total_amount,
      created_at,
      closed_at,
      tables (
        id,
        name
      ),
      orders (
        id,
        status,
        created_at,
        order_items (
          id,
          quantity,
          unit_price,
          note,
          base_item_name,
          selected_options,
          menu_item_id,
          menu_items (
            id,
            name,
            price
          )
        )
      )
    `)
    .order("created_at", { ascending: false })

  if (error) throw error

  const bills = (data || []).map((bill) => ({
    ...bill,
    computed_amount: calcBillAmount(bill),
    order_count: bill.orders?.length || 0,
  }))

  const stats = {
    total_bills: bills.length,

    open_bills: bills.filter((bill) => bill.status === "open").length,

    closed_bills: bills.filter((bill) => bill.status === "closed").length,

    closed_revenue: bills
      .filter((bill) => bill.status === "closed")
      .reduce((sum, bill) => sum + Number(bill.computed_amount || 0), 0),

    all_bill_amount: bills.reduce(
      (sum, bill) => sum + Number(bill.computed_amount || 0),
      0
    ),
  }

  return {
    data: bills,
    stats,
  }
}