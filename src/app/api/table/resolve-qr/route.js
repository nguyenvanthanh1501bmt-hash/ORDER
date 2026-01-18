import { supabaseAdmin } from "@/api/adminClient";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const qr = searchParams.get("qr");

    if (!qr) {
      return new Response(
        JSON.stringify({ message: "QR code is required" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("tables")
      .select("id")
      .eq("qr_code_id", qr)
      .single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ message: "Invalid table QR code" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify({ table_id: data.id }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Server error" }),
      { status: 500 }
    );
  }
}
