import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  try {
    const { tableName, qr_code_id } = await req.json();

    if (!tableName || !qr_code_id) {
      return new Response(
        JSON.stringify({ message: "Missing tableName or qr_code_id" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tables")
      .insert({
        name: tableName,
        qr_code_id: qr_code_id,
      })
      .select()
      .single();

    if (error) throw error;

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message }),
      { status: 400 }
    );
  }
}
