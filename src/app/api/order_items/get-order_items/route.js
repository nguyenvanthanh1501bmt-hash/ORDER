import { supabaseAdmin } from "@/api/adminClient";

export async function GET(req) {
  try {
    // Lấy URL query params
    const { searchParams } = new URL(req.url);
    const order_id = searchParams.get("order_id"); // ?order_id=123

    let query = supabaseAdmin.from("order_items").select();

    if (order_id) {
      query = query.eq("order_id", order_id);
    }

    const { data, error } = await query;

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
