import {
  getAllMenuItemsController,
  createMenuItemController,
  updateMenuItemController,
  deleteMenuItemController,
} from "@/controllers/menuItemController";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Menu Items API Routes
 * GET    /api/menu_items - Get all menu items (PUBLIC)
 * POST   /api/menu_items - Create new menu item (admin only)
 * PUT    /api/menu_items?id={id} - Update menu item (admin only)
 * DELETE /api/menu_items?id={id} - Delete menu item (admin only)
 */

export async function GET(req) {
  return getAllMenuItemsController();
}

export async function POST(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  return createMenuItemController(req);
}

export async function PUT(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

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
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

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
