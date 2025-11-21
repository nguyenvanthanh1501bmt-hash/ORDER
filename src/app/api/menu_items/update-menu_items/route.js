import { supabaseAdmin } from "@/api/adminClient";

export async function PUT(req) {
  try {
    const { id, name, price, category, sub_category, options } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy món ăn cần cập nhật" }),
        { status: 400 }
      );
    }

    if (!name && !price && !category && !sub_category && !options) {
      return new Response(
        JSON.stringify({ message: "Không có trường nào để cập nhật" }),
        { status: 400 }
      );
    }

    const { data: menuItem, error } = await supabaseAdmin
      .from('menu_items')
      .update({
        ...(name && { name }),
        ...(price && { price }),
        ...(category && { category }),
        ...(sub_category && { sub_category }),
        ...(options && { options })
      })
      .eq('id', id)
      .select(); // trả về bản ghi đã cập nhật

    if (error) throw error;

    return new Response(JSON.stringify({ menuItem }), { status: 200 });
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
