import * as OrderModel from "@/models/orderModel";
import { successResponse, errorResponse } from "@/utils/response";

// Create order
export async function createOrderController(req) {
  try {
    const { table_id, qr_token, items } = await req.json();

    if (
      !table_id ||
      !qr_token ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return errorResponse(
        "Missing required fields: table_id, qr_token, items (non-empty array)",
        400
      );
    }

    const result = await OrderModel.createOrder({
      table_id,
      qr_token,
      items,
    });

    return successResponse(result, "Order created successfully", 201);
  } catch (error) {
    return errorResponse(
      error.message || "Failed to create order",
      error.status || 500,
      error
    );
  }
}

// Get all pending orders
export async function getAllPendingOrdersController() {
  try {
    const orders = await OrderModel.getAllPendingOrders();
    return successResponse(orders, "Pending orders retrieved successfully");
  } catch (error) {
    return errorResponse("Failed to retrieve pending orders", 500, error);
  }
}

// Update order status
export async function updateOrderStatusController(req, id) {
  try {
    const { status } = await req.json();

    if (!status) {
      return errorResponse("Missing required field: status", 400);
    }

    const updatedOrder = await OrderModel.updateOrderStatus(id, status);
    return successResponse(updatedOrder, "Order status updated successfully");
  } catch (error) {
    return errorResponse("Failed to update order status", 500, error);
  }
}

// Delete order
export async function deleteOrderController(id) {
  try {
    const result = await OrderModel.deleteOrder(id);
    return successResponse(result, "Order deleted successfully");
  } catch (error) {
    return errorResponse("Failed to delete order", 500, error);
  }
}