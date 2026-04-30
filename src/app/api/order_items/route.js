import { supabaseAdmin } from "@/api/adminClient";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Order Items API Routes
 * DELETE /api/order_items?id={id} - Delete order item (staff/admin only)
 * PUT    /api/order_items?id={id} - Update order item (staff/admin only)
 */

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy order item cần xóa" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("order_items")
      .delete()
      .eq("id", id)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: "Order item đã xóa thành công",
        deleted: data,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}

export async function PUT(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const updates = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Order item ID is required" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from("order_items")
      .update(updates)
      .eq("id", id)
      .select();

    if (error) throw error;

    return new Response(
      JSON.stringify({
        message: "Order item updated successfully",
        updated: data,
      }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
