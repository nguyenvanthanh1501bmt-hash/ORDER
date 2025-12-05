import { supabaseAdmin } from "@/api/adminClient";

export async function GET() {
  try {
    const { data: menuItemList, error } = await supabaseAdmin
      .from("menu_items")
      .select("*");

    if (error) throw error;

    return new Response(JSON.stringify(menuItemList), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
