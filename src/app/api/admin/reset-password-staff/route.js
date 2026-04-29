import { resetPasswordController } from "@/controllers/staffController";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "Staff ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return resetPasswordController(req, id);
}
