import { supabaseAdmin } from "@/api/adminClient";

/**
 * PATCH /api/bills/close
 *
 * Body:
 * {
 *   "bill_id": number
 * }
 *
 * Purpose:
 * - Update bill status to CLOSED
 * - Set closed_at timestamp
 */
export async function PATCH(req) {
  try {
    const { bill_id } = await req.json();

    // Validate input
    if (!bill_id) {
      return new Response(
        JSON.stringify({ message: "bill_id is required" }),
        { status: 400 }
      );
    }

    // Update bill status
    const { data, error } = await supabaseAdmin
      .from("bills")
      .update({
        status: "closed",
        closed_at: new Date().toISOString(),
      })
      .eq("id", bill_id)
      .eq("status", "open") // prevent closing twice
      .select()
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ message: error.message }),
        { status: 500 }
      );
    }

    if (!data) {
      return new Response(
        JSON.stringify({
          message: "Bill not found or already closed",
        }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "Bill closed successfully",
        bill: data,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: "Invalid request body" }),
      { status: 400 }
    );
  }
}
