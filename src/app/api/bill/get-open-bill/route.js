import { supabaseAdmin } from "@/api/adminClient"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select("id, table_id, status")
    .eq("status", "open")

  if (error) {
    console.error("[ADMIN] getOpenBills error:", error)
    return NextResponse.json(
      { error: "Failed to fetch open bills" },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
