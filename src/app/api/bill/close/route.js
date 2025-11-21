import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/api/adminClient";

export async function PATCH(req) {
  try {
    const { tableId } = await req.json();
    if (!tableId) {
      return NextResponse.json({ message: "Không tìm thấy bàn cần thanh toán" }, { status: 400 });
    }

    // Lấy bill đang mở
    const { data: bill, error: billError } = await supabaseAdmin
      .from("bills")
      .select(`
        id,
        table_id,
        status,
        created_at,
        orders (
          id,
          status,
          order_items (
            id,
            quantity,
            menu_items ( name, price )
          )
        )
      `)
      .eq("status", "open")
      .eq("table_id", tableId)
      .single();

    if (billError || !bill) {
      return NextResponse.json({ error: "Không có hóa đơn đang mở cho bàn này" }, { status: 404 });
    }

    // Tính tổng tiền
    const totalAmount = bill.orders
      .flatMap(o => o.order_items)
      .reduce((sum, item) => sum + item.quantity * item.menu_items.price, 0);

    // Update bill + trả chi tiết
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
            menu_items ( name, price )
          )
        )
      `)
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json(closedBill);
  } catch (err) {
    return NextResponse.json({ message: err.message || "Server error" }, { status: 500 });
  }
}
