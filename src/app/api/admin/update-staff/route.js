import { supabaseAdmin } from "@/api/adminClient";

export async function PUT(req) {
  try {
    const { user_id, email, name, role } = await req.json();

    if (!user_id) {
      return new Response(JSON.stringify({ message: "user_id is required" }), { status: 400 });
    }

    // 1. Cập nhật Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.updateUserById(
      user_id,
      {
        ...(email && { email }),
        ...(name && { name }),
      }
    );
    if (authError) throw authError;

    // 2. Cập nhật bảng staff
    const { data: staffData, error: staffError } = await supabaseAdmin
      .from('staff')
      .update({
        ...(email && { email }),
        ...(name && { name }),
        ...(role && { role }),
      })
      .eq('user_id', user_id);
    if (staffError) throw staffError;

    return new Response(JSON.stringify({ authData, staffData }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}
