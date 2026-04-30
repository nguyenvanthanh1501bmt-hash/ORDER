import {
  createOrderController,
  getAllPendingOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "@/controllers/orderController";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Orders API Routes
 * GET    /api/orders - Get all pending orders (staff/admin only)
 * POST   /api/orders - Create new order (PUBLIC)
 * PATCH  /api/orders?id={id} - Update order status (staff/admin only)
 * DELETE /api/orders?id={id} - Delete order (staff/admin only)
 */

export async function GET(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  return getAllPendingOrdersController();
}

export async function POST(req) {
  return createOrderController(req);
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Order ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return updateOrderStatusController(req, id);
}

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Order ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return deleteOrderController(id);
}
