import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  const { name, price, category, sub_category, options, image_url } = await req.json();

  try {
    const { data: menuItem, error } = await supabaseAdmin
      .from("menu_items")
      .insert({ name, price, category, sub_category, options, image_url })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify({ menuItem }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 500 });
  }
}
