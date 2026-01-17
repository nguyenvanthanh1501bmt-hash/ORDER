import { supabaseAdmin } from "@/api/adminClient"
import { NextResponse } from "next/server"

export async function POST(req) {
  const { billId } = await req.json()

  if (!billId) {
    return NextResponse.json(
      { error: "billId is required" },
      { status: 400 }
    )
  }

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
          menu_item_id
        )
      )
    `)
    .eq("id", billId)
    .maybeSingle()

  if (error) {
    console.error("[ADMIN] getBillDetail error:", error)
    return NextResponse.json(
      { error: "Failed to fetch bill detail" },
      { status: 500 }
    )
  }

  if (!data) {
    return NextResponse.json(
      { error: "Bill not found" },
      { status: 404 }
    )
  }

  return NextResponse.json(data)
}
