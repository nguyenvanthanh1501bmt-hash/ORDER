import {
  getAllTablesController,
  createTableController,
  updateTableController,
  deleteTableController,
  updateTableQRCodeController,
} from "@/controllers/tableController";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Tables API Routes
 * GET    /api/table - Get all tables (PUBLIC)
 * POST   /api/table - Create new table (admin only)
 * PUT    /api/table?id={id} - Update table (admin only)
 * DELETE /api/table?id={id} - Delete table (admin only)
 * PATCH  /api/table?id={id} - Update table or QR code (admin only)
 */

export async function GET(req) {
  return getAllTablesController();
}

export async function POST(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  return createTableController(req);
}

export async function PUT(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Table ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return updateTableController(req, id);
}

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Table ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return deleteTableController(id);
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action"); // "qr" for QR code update

  if (!id) {
    return new Response(    
      JSON.stringify({ success: false, message: "Table ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  // If action is 'qr', update QR code; otherwise just update the table
  if (action === "qr") {
    return updateTableQRCodeController(req, id);
  }

  // Default to regular update
  return updateTableController(req, id);
}
