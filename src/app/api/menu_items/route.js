import {
  getAllMenuItemsController,
  createMenuItemController,
  updateMenuItemController,
  deleteMenuItemController,
} from "@/controllers/menuItemController";

/**
 * Consolidated Menu Items API Routes
 * GET    /api/menu_items - Get all menu items
 * POST   /api/menu_items - Create new menu item
 * PUT    /api/menu_items?id={id} - Update menu item
 * DELETE /api/menu_items?id={id} - Delete menu item
 */

export async function GET(req) {
  return getAllMenuItemsController();
}

export async function POST(req) {
  return createMenuItemController(req);
}

export async function PUT(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Menu item ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return updateMenuItemController(req, id);
}

export async function DELETE(req) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Menu item ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return deleteMenuItemController(id);
}
