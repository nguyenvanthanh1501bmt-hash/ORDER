import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  const { email, password, name, role } = await req.json();

  try {
    // 1. Tạo user trong Supabase Auth
    const { data: authUser, error: authError } =
      await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
      });

    if (authError) throw authError;

    // authUser.user.id mới là UUID của user
    const authUserId = authUser.user.id;

    // 2. Thêm record vào bảng staff (sử dụng user_id)
    const { data, error: dbError } = await supabaseAdmin
      .from("staff")
      .insert([{ user_id: authUserId, email, name, role }]);

    if (dbError) throw dbError;

    return new Response(JSON.stringify(data), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), {
      status: 400,
    });
  }
}
