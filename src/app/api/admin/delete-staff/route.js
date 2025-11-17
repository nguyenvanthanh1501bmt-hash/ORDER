import { supabaseAdmin } from "@/api/adminClient";

export async function DELETE(req) {
  try {
    const { auth_id } = await req.json();

    // 1. Xóa record trong bảng staff
    const { data, error: dbError } = await supabaseAdmin
      .from("staff")
      .delete()
      .eq("auth_id", auth_id);

    if (dbError) throw dbError;

    // 2. Xóa user trong Supabase Auth
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(auth_id);
    if (authError) throw authError;

    return new Response(JSON.stringify({ message: "Staff deleted successfully" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}
