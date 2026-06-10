import * as TableModel from "@/models/tableModel";
import { successResponse, errorResponse } from "@/utils/response";

function noStoreResponse(response) {
  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");

  return response;
}

// Get all tables
export async function getAllTablesController() {
  try {
    const tables = await TableModel.getAllTables();

    return noStoreResponse(
      successResponse(tables, "Tables retrieved successfully")
    );
  } catch (error) {
    return noStoreResponse(
      errorResponse("Failed to retrieve tables", 500, error)
    );
  }
}

// Create table
export async function createTableController(req) {
  try {
    const tableData = await req.json();

    if (!tableData.name) {
      return noStoreResponse(
        errorResponse("Missing required field: name", 400)
      );
    }

    const newTable = await TableModel.createTable(tableData);

    return noStoreResponse(
      successResponse(newTable, "Table created successfully", 201)
    );
  } catch (error) {
    return noStoreResponse(
      errorResponse("Failed to create table", 400, error)
    );
  }
}

// Update table
export async function updateTableController(req, id) {
  try {
    const updates = await req.json();

    const updatedTable = await TableModel.updateTable(id, updates);

    return noStoreResponse(
      successResponse(updatedTable, "Table updated successfully")
    );
  } catch (error) {
    return noStoreResponse(
      errorResponse("Failed to update table", 400, error)
    );
  }
}

// Delete table
export async function deleteTableController(id) {
  try {
    const result = await TableModel.deleteTable(id);

    return noStoreResponse(
      successResponse(result, "Table deleted successfully")
    );
  } catch (error) {
    return noStoreResponse(
      errorResponse("Failed to delete table", 400, error)
    );
  }
}

// Update table QR code
export async function updateTableQRCodeController(req, id) {
  try {
    const body = await req.json();

    // Hỗ trợ cả 2 kiểu payload:
    // { qrCodeId: "..." }
    // { qr_code_id: "..." }
    const qrCodeId = body.qrCodeId || body.qr_code_id;

    if (!qrCodeId) {
      return noStoreResponse(
        errorResponse("Missing required field: qrCodeId", 400)
      );
    }

    const updatedTable = await TableModel.updateTableQRCode(id, qrCodeId);

    return noStoreResponse(
      successResponse(updatedTable, "QR code updated successfully")
    );
  } catch (error) {
    return noStoreResponse(
      errorResponse("Failed to update QR code", 400, error)
    );
  }
}