import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/api/adminClient";

export async function GET() {
  try {
    // Lấy tất cả order pending, kèm bill và table name, cùng order_items
    const { data, error } = await supabaseAdmin
      .from("orders")
      .select(`
        id,
        created_at,
        status,
        order_items (
          id,
          menu_item_id,
          base_item_name,
          quantity,
          unit_price,
          note,
          selected_options
        ),
        bills (
          id,
          table_id,
          total_amount,
          tables!inner (
            id,
            name
          )
        )
      `)
      .eq("status", "pending_staff_approval")
      .order("created_at", { ascending: true });

    if (error) throw error;  

    return NextResponse.json(data || []);
  } catch (err) {
    console.error("GET PENDING ORDERS ERROR:", err);
    return NextResponse.json(
      { message: "Failed to fetch pending orders" },
      { status: 500 }
    );
  }
}
