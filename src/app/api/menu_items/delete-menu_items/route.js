import { deleteMenuItemController } from "@/controllers/menuItemController";

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(JSON.stringify({ success: false, message: "Menu item ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  return deleteMenuItemController(id);
}
    );

  } catch (err) {
    return new Response(
      JSON.stringify({ message: err.message || "Server error" }),
      { status: 500 }
    );
  }
}
