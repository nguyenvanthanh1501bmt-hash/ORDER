import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { tableId } = await req.json();

    if (!tableId) {
      return new Response(
        JSON.stringify({ message: "Không tìm thấy bàn cần xóa" }),
        { status: 400 }
      );
    }

    const { data, error } = await supabaseAdmin
      .from('tables')
      .delete()
      .eq('id', tableId)
      .select();

    if (error) throw error;

    if (!data || data.length === 0) {
      return new Response(
        JSON.stringify({ message: "Bàn không tồn tại" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Xóa thành công", data }),
      { status: 200 }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Lỗi server" }),
      { status: 500 }
    );
  }
}
