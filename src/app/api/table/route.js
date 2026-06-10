import {
  getAllTablesController,
  createTableController,
  updateTableController,
  deleteTableController,
  updateTableQRCodeController,
} from "@/controllers/tableController";
import { requireRole } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

/**
 * Consolidated Tables API Routes
 * GET    /api/table - Get all tables (PUBLIC)
 * POST   /api/table - Create new table (admin only)
 * PUT    /api/table?id={id} - Update table (admin only)
 * DELETE /api/table?id={id} - Delete table (admin only)
 * PATCH  /api/table?id={id}&action=qr - Update table QR code (admin only)
 */

function jsonError(message, status = 400) {
  return new Response(
    JSON.stringify({
      success: false,
      message,
    }),
    {
      status,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

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
    return jsonError("Table ID is required", 400);
  }

  return updateTableController(req, id);
}

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return jsonError("Table ID is required", 400);
  }

  return deleteTableController(id);
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  const action = searchParams.get("action");

  if (!id) {
    return jsonError("Table ID is required", 400);
  }

  if (action === "qr") {
    return updateTableQRCodeController(req, id);
  }

  return updateTableController(req, id);
}