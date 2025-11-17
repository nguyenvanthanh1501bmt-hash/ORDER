import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  const { email, password, name, role } = await req.json();

  try {
    // 1. Tạo user Auth
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });
    if (authError) throw authError;

    // 2. Thêm record vào bảng staff
    const { data, error: dbError } = await supabaseAdmin
      .from("staff")
      .insert([{ auth_id: authUser.id, email, name, role }]);
    if (dbError) throw dbError;

    return new Response(JSON.stringify(data), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}
