import { deleteStaffController } from "@/controllers/staffController";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "Staff ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return deleteStaffController(id);
}
