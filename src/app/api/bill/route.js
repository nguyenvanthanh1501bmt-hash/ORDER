import {
  getOpenBillsController,
  getBillDetailController,
  closeBillController,
  closeBillByTableController,
} from "@/controllers/billController";
import { requireRole } from "@/lib/auth";

/**
 * Bills API Routes
 * GET    /api/bill - Get all open bills
 * POST   /api/bill - Get bill detail
 * PATCH  /api/bill?action=close - Close bill by bill_id
 * PATCH  /api/bill?action=status - Close bill by tableId and recalculate total
 */

export async function GET(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  return getOpenBillsController();
}

export async function POST(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  return getBillDetailController(req);
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  const { searchParams } = new URL(req.url);
  const action = searchParams.get("action");

  if (action === "close") {
    return closeBillController(req);
  }

  if (action === "status") {
    return closeBillByTableController(req);
  }

  return Response.json(
    { message: "Invalid action. Use 'close' or 'status'" },
    { status: 400 }
  );
}