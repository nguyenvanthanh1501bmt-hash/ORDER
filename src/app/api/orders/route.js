import {
  createOrderController,
  getAllPendingOrdersController,
  updateOrderStatusController,
  deleteOrderController,
} from "@/controllers/orderController";

/**
 * Consolidated Orders API Routes
 * GET    /api/orders - Get all pending orders
 * POST   /api/orders - Create new order
 * PATCH  /api/orders?id={id} - Update order status
 * DELETE /api/orders?id={id} - Delete order
 */

export async function GET(req) {
  return getAllPendingOrdersController();
}

export async function POST(req) {
  return createOrderController(req);
}

export async function PATCH(req) {
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
