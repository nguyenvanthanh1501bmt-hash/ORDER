import { supabaseAdmin } from "@/api/adminClient";
import { getSizeExtraPrice } from "@/app/features/helper";

function extractQrToken(value) {
  if (!value) return null;

  const text = String(value).trim();

  try {
    const url = new URL(text);
    return url.searchParams.get("table") || text;
  } catch {
    try {
      const url = new URL(text, "http://localhost");
      return url.searchParams.get("table") || text;
    } catch {
      return text;
    }
  }
}

function createHttpError(message, status) {
  const error = new Error(message);
  error.status = status;
  return error;
}

// Create new order with items
export async function createOrder({ table_id, qr_token, items }) {
  // STEP 0: Validate current QR before creating order.
  // This prevents old tabs / old QR links from ordering after checkout.
  const { data: table, error: tableError } = await supabaseAdmin
    .from("tables")
    .select("id, qr_code_id")
    .eq("id", table_id)
    .single();

  if (tableError || !table) {
    throw createHttpError("Table not found", 404);
  }

  const currentQrToken = extractQrToken(table.qr_code_id);
  const requestQrToken = extractQrToken(qr_token);

  if (
    !currentQrToken ||
    !requestQrToken ||
    String(currentQrToken) !== String(requestQrToken)
  ) {
    throw createHttpError(
      "QR code expired. Please scan the new QR again.",
      403
    );
  }

  // STEP 1: Find or create open bill
  let { data: bill } = await supabaseAdmin
    .from("bills")
    .select("*")
    .eq("table_id", table_id)
    .eq("status", "open")
    .maybeSingle();

  if (!bill) {
    const { data: newBill, error } = await supabaseAdmin
      .from("bills")
      .insert({ table_id })
      .select()
      .single();

    if (error) throw error;
    bill = newBill;
  }

  // STEP 2: Create order
  const { data: order, error: orderErr } = await supabaseAdmin
    .from("orders")
    .insert({
      bill_id: bill.id,
    })
    .select()
    .single();

  if (orderErr) throw orderErr;

  // STEP 3: Load menu items data
  const menuIds = items.map((i) => i.menu_item_id);

  const { data: menus, error: menuErr } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price")
    .in("id", menuIds);

  if (menuErr) throw menuErr;

  // STEP 4: Insert order items
  let totalAdded = 0;

  for (const item of items) {
    const menu = menus.find((m) => m.id === item.menu_item_id);
    if (!menu) continue;

    const sizeText = item.selected_options?.size;
    const sizeExtra = getSizeExtraPrice(item.option, sizeText);
    const finalUnitPrice = Number(menu.price || 0) + Number(sizeExtra || 0);
    const itemTotal = finalUnitPrice * Number(item.quantity || 1);

    totalAdded += itemTotal;

    const { error: itemInsertError } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id: order.id,
        menu_item_id: menu.id,
        base_item_name: menu.name,
        unit_price: finalUnitPrice,
        quantity: item.quantity,
        note: item.note || null,
        selected_options: {
          ...item.selected_options,
          size_extra: sizeExtra,
        },
      });

    if (itemInsertError) throw itemInsertError;
  }

  // STEP 5: Update bill total
  const currentTotal = Number(bill.total_amount || 0);

  const { error: billUpdateError } = await supabaseAdmin
    .from("bills")
    .update({
      total_amount: currentTotal + totalAdded,
    })
    .eq("id", bill.id);

  if (billUpdateError) throw billUpdateError;

  return {
    bill_id: bill.id,
    order_id: order.id,
  };
}

// Get all pending orders
export async function getAllPendingOrders() {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
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
    `
    )
    .in("status", ["pending_staff_approval", "accepted"])
    .order("created_at", { ascending: true });

  if (error) throw error;
  return data || [];
}

// Update order status
export async function updateOrderStatus(orderId, status) {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", orderId)
    .select("*")
    .single();

  if (error) throw error;
  return data;
}

// Delete order
export async function deleteOrder(orderId) {
  // Get bill_id
  const { data: order, error: orderFetchError } = await supabaseAdmin
    .from("orders")
    .select("id, bill_id")
    .eq("id", orderId)
    .single();

  if (orderFetchError || !order) throw orderFetchError;

  const billId = order.bill_id;

  // Delete order items
  const { error: itemError } = await supabaseAdmin
    .from("order_items")
    .delete()
    .eq("order_id", orderId);

  if (itemError) throw itemError;

  // Delete order
  const { error: orderDeleteError } = await supabaseAdmin
    .from("orders")
    .delete()
    .eq("id", orderId);

  if (orderDeleteError) throw orderDeleteError;

  // Check if bill has remaining orders
  const { data: remainOrders, error: remainError } = await supabaseAdmin
    .from("orders")
    .select("id")
    .eq("bill_id", billId)
    .limit(1);

  if (remainError) throw remainError;

  // Delete bill if no orders remain
  if (!remainOrders || remainOrders.length === 0) {
    const { error: billError } = await supabaseAdmin
      .from("bills")
      .delete()
      .eq("id", billId);

    if (billError) throw billError;
  }

  return { message: "Order deleted successfully" };
}