import { updateTableController } from "@/controllers/tableController";

export async function POST(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "Table ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return updateTableController(req, id);
}
