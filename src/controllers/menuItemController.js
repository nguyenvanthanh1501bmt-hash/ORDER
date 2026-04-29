import * as MenuItemModel from "@/models/menuItemModel";
import { successResponse, errorResponse } from "@/utils/response";

// Get all menu items
export async function getAllMenuItemsController() {
  try {
    const menuItems = await MenuItemModel.getAllMenuItems();
    return successResponse(menuItems, "Menu items retrieved successfully");
  } catch (error) {
    return errorResponse("Failed to retrieve menu items", 500, error);
  }
}

// Create menu item
export async function createMenuItemController(req) {
  try {
    const menuData = await req.json();

    // Validation
    if (!menuData.name || menuData.price === undefined) {
      return errorResponse("Missing required fields: name, price", 400);
    }

    const newMenuItem = await MenuItemModel.createMenuItem(menuData);
    return successResponse(newMenuItem, "Menu item created successfully", 201);
  } catch (error) {
    return errorResponse("Failed to create menu item", 400, error);
  }
}

// Update menu item
export async function updateMenuItemController(req, id) {
  try {
    const updates = await req.json();
    const updatedMenuItem = await MenuItemModel.updateMenuItem(id, updates);
    return successResponse(updatedMenuItem, "Menu item updated successfully");
  } catch (error) {
    return errorResponse("Failed to update menu item", 400, error);
  }
}

// Delete menu item
export async function deleteMenuItemController(id) {
  try {
    const result = await MenuItemModel.deleteMenuItem(id);
    return successResponse(result, "Menu item deleted successfully");
  } catch (error) {
    return errorResponse("Failed to delete menu item", 400, error);
  }
}
