import { supabaseAdmin } from "@/api/adminClient";

// Delete order item
export async function deleteOrderItem(id) {
  const { data, error } = await supabaseAdmin
    .from("order_items")
    .delete()
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}

// Update order item
export async function updateOrderItem(id, updates) {
  const { data, error } = await supabaseAdmin
    .from("order_items")
    .update(updates)
    .eq("id", id)
    .select();

  if (error) throw error;

  return data;
}