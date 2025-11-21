import { supabaseAdmin } from "@/api/adminClient";

export async function GET() {
  try {
    const { data: tableList, error } = await supabaseAdmin
      .from('tables')
      .select('id, qr_code_id, name');

    if (error) throw error;

    return new Response(JSON.stringify(tableList), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
