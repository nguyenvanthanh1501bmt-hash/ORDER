import * as OrderItemModel from "@/models/orderItemModel";

// Delete order item
export async function deleteOrderItemController(id) {
  try {
    const deleted = await OrderItemModel.deleteOrderItem(id);

    return Response.json(
      {
        message: "Order item đã xóa thành công",
        deleted,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}

// Update order item
export async function updateOrderItemController(req, id) {
  try {
    const updates = await req.json();

    if (!updates || Object.keys(updates).length === 0) {
      return Response.json(
        { message: "No update data provided" },
        { status: 400 }
      );
    }

    const updated = await OrderItemModel.updateOrderItem(id, updates);

    return Response.json(
      {
        message: "Order item updated successfully",
        updated,
      },
      { status: 200 }
    );
  } catch (error) {
    return Response.json(
      { message: error.message || "Server error" },
      { status: 500 }
    );
  }
}