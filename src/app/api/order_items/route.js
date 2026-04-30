import {
  deleteOrderItemController,
  updateOrderItemController,
} from "@/controllers/orderItemController";
import { requireRole } from "@/lib/auth";

/**
 * Order Items API Routes
 * DELETE /api/order_items?id={id} - Delete order item
 * PUT    /api/order_items?id={id} - Update order item
 */

function getOrderItemId(req) {
  const { searchParams } = new URL(req.url);
  return searchParams.get("id");
}

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  const id = getOrderItemId(req);

  if (!id) {
    return Response.json(
      { message: "Không tìm thấy order item cần xóa" },
      { status: 400 }
    );
  }

  return deleteOrderItemController(id);
}

export async function PUT(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  const id = getOrderItemId(req);

  if (!id) {
    return Response.json(
      { message: "Order item ID is required" },
      { status: 400 }
    );
  }

  return updateOrderItemController(req, id);
}