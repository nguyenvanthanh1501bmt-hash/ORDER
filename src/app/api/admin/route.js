import {
  getStaffController,
  createStaffController,
  updateStaffController,
  deleteStaffController,
  resetPasswordController,
} from "@/controllers/staffController";

/**
 * Consolidated Admin/Staff API Routes
 * GET    /api/admin - Get all staff
 * POST   /api/admin - Create new staff
 * PUT    /api/admin?id={id} - Update staff
 * DELETE /api/admin?id={id} - Delete staff
 * PATCH  /api/admin?id={id} - Reset staff password
 */

export async function GET(req) {
  return getStaffController();
}

export async function POST(req) {
  return createStaffController(req);
}

export async function PUT(req) {
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
