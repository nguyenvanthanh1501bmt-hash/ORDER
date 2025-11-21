import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { id } = await req.json();

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
      .select(); // trả về bản ghi vừa xóa

    if (error) throw error;

    return new Response(
      JSON.stringify({ message: "Order item đã xóa thành công", deleted: data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
