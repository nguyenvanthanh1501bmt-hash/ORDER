import { supabaseAdmin } from "@/api/adminClient";

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
    .eq("status", "open");

  if (error) throw error;

  return data || [];
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
          menu_item_id
        )
      )
    `)
    .eq("id", billId)
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Close bill by bill_id
export async function closeBill(billId) {
  const { data, error } = await supabaseAdmin
    .from("bills")
    .update({
      status: "closed",
      closed_at: new Date().toISOString(),
    })
    .eq("id", billId)
    .eq("status", "open")
    .select()
    .maybeSingle();

  if (error) throw error;

  return data;
}

// Close bill by tableId and recalculate total
export async function closeBillByTable(tableId) {
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
          unit_price,
          menu_items (
            name,
            price
          )
        )
      )
    `)
    .eq("status", "open")
    .eq("table_id", tableId)
    .maybeSingle();

  if (billError) throw billError;

  if (!bill) {
    throw new Error("Không có hóa đơn đang mở cho bàn này");
  }

  const totalAmount = bill.orders
    .flatMap((order) => order.order_items)
    .reduce((sum, item) => {
      const quantity = Number(item.quantity || 0);

      // Ưu tiên unit_price trong order_items vì giá đã snapshot lúc order.
      // Nếu unit_price không có thì fallback menu_items.price.
      const price = Number(
        item.unit_price ?? item.menu_items?.price ?? 0
      );

      return sum + quantity * price;
    }, 0);

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
            name,
            price
          )
        )
      )
    `)
    .single();

  if (updateError) throw updateError;

  return closedBill;
}