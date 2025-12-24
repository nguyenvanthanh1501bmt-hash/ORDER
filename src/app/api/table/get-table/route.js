import { supabaseAdmin } from "@/api/adminClient";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("tables")
      .select("id, qr_code_id, name");

    if (error) throw error;

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message ?? "Server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}

