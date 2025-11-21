import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { menuItemId } = await req.json();

    if (!menuItemId) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy món ăn cần xóa" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('menu_items')
      .delete()
      .eq('id', menuItemId)
      .select(); // trả về món vừa xóa

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "Món ăn không tồn tại" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Món ăn đã xóa thành công", deleted: data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
