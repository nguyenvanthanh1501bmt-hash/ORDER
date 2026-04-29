import * as TableModel from "@/models/tableModel";
import { successResponse, errorResponse } from "@/utils/response";

// Get all tables
export async function getAllTablesController() {
  try {
    const tables = await TableModel.getAllTables();
    return successResponse(tables, "Tables retrieved successfully");
  } catch (error) {
    return errorResponse("Failed to retrieve tables", 500, error);
  }
}

// Create table
export async function createTableController(req) {
  try {
    const tableData = await req.json();

    // Validation
    if (!tableData.name) {
      return errorResponse("Missing required field: name", 400);
    }

    const newTable = await TableModel.createTable(tableData);
    return successResponse(newTable, "Table created successfully", 201);
  } catch (error) {
    return errorResponse("Failed to create table", 400, error);
  }
}

// Update table
export async function updateTableController(req, id) {
  try {
    const updates = await req.json();
    const updatedTable = await TableModel.updateTable(id, updates);
    return successResponse(updatedTable, "Table updated successfully");
  } catch (error) {
    return errorResponse("Failed to update table", 400, error);
  }
}

// Delete table
export async function deleteTableController(id) {
  try {
    const result = await TableModel.deleteTable(id);
    return successResponse(result, "Table deleted successfully");
  } catch (error) {
    return errorResponse("Failed to delete table", 400, error);
  }
}

// Update table QR code
export async function updateTableQRCodeController(req, id) {
  try {
    const { qrCodeId } = await req.json();

    if (!qrCodeId) {
      return errorResponse("Missing required field: qrCodeId", 400);
    }

    const result = await TableModel.updateTableQRCode(id, qrCodeId);
    return successResponse(result, "QR code updated successfully");
  } catch (error) {
    return errorResponse("Failed to update QR code", 400, error);
  }
}
