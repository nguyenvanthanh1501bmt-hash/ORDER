import { supabaseAdmin } from "@/api/adminClient"
import { NextResponse } from "next/server"

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .select(`
      id,
      status,
      table_id,
      tables (
        id,
        name
      )
    `)
    .eq("status", "open")

  if (error) {
    console.error("[ADMIN] getOpenBills error:", error)
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json(data)
}
