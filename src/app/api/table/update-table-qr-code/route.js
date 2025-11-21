import { supabaseAdmin } from "@/api/adminClient";

export async function PATCH(req) {
  try {
    const { tableId, tableQRCode } = await req.json();

    if (!tableId) {
      return new Response(
        JSON.stringify({ message: "tableId missing or invalid" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('tables')
      .update({ qr_code_id: tableQRCode })
      .eq('id', tableId)
      .select()
      .single();

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Update table successfully", data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
