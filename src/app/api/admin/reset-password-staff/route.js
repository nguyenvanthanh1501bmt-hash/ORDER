import { supabaseAdmin } from "@/api/adminClient";

export async function POST(req) {
  try {
    const { email } = await req.json();
    if (!email) return new Response(JSON.stringify({ message: "Email is required" }), { status: 400 });

    const { data, error } = await supabaseAdmin.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:3000/pages/reset-password" // tuyệt đối
    });

    if (error) throw error;

    return new Response(JSON.stringify({ message: "Reset email sent" }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ message: err.message }), { status: 400 });
  }
}
