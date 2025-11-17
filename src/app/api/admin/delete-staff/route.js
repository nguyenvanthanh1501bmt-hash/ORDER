import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { user_id } = await req.json(); // đổi auth_id → user_id

    if (!user_id) {
      return new Response(JSON.stringify({ message: "Missing user_id" }), { status: 400 });
    }

    // 1. Xóa record trong bảng staff
    const { data, error: dbError } = await supabaseAdmin
      .from("staff")
      .delete()
      .eq("user_id", user_id)
      .select(); // trả về row vừa xóa (optional)

    if (dbError) throw dbError;

    // 2. Xóa user trong Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(user_id);
    if (authError) throw authError;

    return new Response(JSON.stringify({ message: "Staff deleted successfully", deleted: data }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}
