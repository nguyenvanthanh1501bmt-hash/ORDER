import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  try {
    const {
      order_id,
      quantity,
      unit_price,
      note,
      base_item_name,
      selected_options,
      menu_item_id
    } = await req.json();

    if (!order_id || !unit_price || !base_item_name) {
      return new Response(
        JSON.stringify({ message: "order_id, unit_price và base_item_name là bắt buộc" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("order_items")
      .insert({
        order_id,
        quantity: quantity && quantity > 0 ? quantity : 1,
        unit_price,
        note,
        base_item_name,
        selected_options,
        menu_item_id
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ orderItem: data }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
