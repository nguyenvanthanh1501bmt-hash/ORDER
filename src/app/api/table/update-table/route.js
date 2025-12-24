import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  try {
    const { tableId, tableName } = await req.json();

    if (!tableId || !tableName) {
      return new Response(
        JSON.stringify({ message: "Missing tableId or tableName" }),
        { status: 400 }
      );
    }

    const { error } = await supabaseAdmin
      .from("tables")
      .update({ name: tableName })
      .eq("id", tableId);

    if (error) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 500 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Update table success" }),
      { status: 200 }
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message }),
      { status: 500 }
    );
  }
}
