import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  const { orderId } = await req.json();

  if (!orderId) {
    return new Response(
      JSON.stringify({ message: "Không tìm thấy order cần xóa" }),
      { status: 400 }
    );
  }

  try {
    // 1. LẤY BILL_ID CỦA ORDER
    const { data: order, error: orderFetchError } = await supabaseAdmin
      .from("orders")
      .select("id, bill_id")
      .eq("id", orderId)
      .single();

    if (orderFetchError || !order) throw orderFetchError;

    const billId = order.bill_id;

    // 2. XÓA ORDER_ITEMS
    const { error: itemError } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("order_id", orderId);

    if (itemError) throw itemError;

    // 3. XÓA ORDER
    const { error: orderDeleteError } = await supabaseAdmin
      .from("orders")
      .delete()
      .eq("id", orderId);

    if (orderDeleteError) throw orderDeleteError;

    // 4. KIỂM TRA BILL CÒN ORDER KHÔNG
    const { data: remainOrders, error: remainError } = await supabaseAdmin
      .from("orders")
      .select("id")
      .eq("bill_id", billId)
      .limit(1);

    if (remainError) throw remainError;

    // 5. NẾU KHÔNG CÒN ORDER → XÓA BILL
    if (remainOrders.length === 0) {
      const { error: billDeleteError } = await supabaseAdmin
        .from("bills")
        .delete()
        .eq("id", billId);

      if (billDeleteError) throw billDeleteError;
    }

    return new Response(
      JSON.stringify({ message: "Delete success" }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "server error" }),
      { status: 500 }
    );
  }
}
