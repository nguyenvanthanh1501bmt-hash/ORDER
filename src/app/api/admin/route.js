import {
  getStaffController,
  createStaffController,
  updateStaffController,
  deleteStaffController,
  resetPasswordController,
} from "@/controllers/staffController";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Admin/Staff API Routes
 * GET    /api/admin - Get all staff
 * POST   /api/admin - Create new staff
 * PUT    /api/admin?id={id} - Update staff
 * DELETE /api/admin?id={id} - Delete staff
 * PATCH  /api/admin?id={id} - Reset staff password
 *
 * All endpoints require admin role.
 */

export async function GET(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  return getStaffController();
}

export async function POST(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  return createStaffController(req);
}

export async function PUT(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Staff ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return updateStaffController(req, id);
}

export async function DELETE(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Staff ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return deleteStaffController(id);
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");

  if (!id) {
    return new Response(
      JSON.stringify({ success: false, message: "Staff ID is required" }),
      { status: 400, headers: { "Content-Type": "application/json" } }
    );
  }

  return resetPasswordController(req, id);
}
