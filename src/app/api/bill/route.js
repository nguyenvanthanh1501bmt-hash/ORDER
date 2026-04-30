import { supabaseAdmin } from "@/api/adminClient";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

/**
 * Consolidated Bills API Routes
 * GET    /api/bill - Get all open bills (staff/admin only)
 * POST   /api/bill - Get bill detail (staff/admin only)
 * PATCH  /api/bill?action=close - Close bill (staff/admin only)
 * PATCH  /api/bill?action=status - Update bill status for table (staff/admin only)
 */

export async function GET(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  try {
    const { data, error } = await supabaseAdmin
      .from("bills")
      .select(`
        id,
        status,
        table_id,
        tables (
          id,
          name
        ),
        orders (
          id,
          status
        )
      `)
      .eq("status", "open");

    if (error) {
      console.error("[ADMIN] getOpenBills error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data || []);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function POST(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  try {
    const { billId } = await req.json();

    if (!billId) {
      return NextResponse.json({ error: "billId is required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("bills")
      .select(`
        id,
        table_id,
        status,
        total_amount,
        created_at,
        closed_at,
        orders (
          id,
          status,
          created_at,
          order_items (
            id,
            quantity,
            unit_price,
            note,
            base_item_name,
            selected_options,
            menu_item_id
          )
        )
      `)
      .eq("id", billId)
      .maybeSingle();

    if (error) {
      console.error("[ADMIN] getBillDetail error:", error);
      return NextResponse.json(
        { error: "Failed to fetch bill detail" },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json({ error: "Bill not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json(
      { error: err.message || "Server error" },
      { status: 500 }
    );
  }
}

export async function PATCH(req) {
  const auth = await requireRole(req, ["admin", "staff"]);
  if (auth.error) return auth.error;

  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get("action"); // "close" or "status"
    const body = await req.json();

    if (action === "close") {
      // Close bill
      const { bill_id } = body;

      if (!bill_id) {
        return NextResponse.json(
          { message: "bill_id is required" },
          { status: 400 }
        );
      }

      const { data, error } = await supabaseAdmin
        .from("bills")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
        })
        .eq("id", bill_id)
        .eq("status", "open")
        .select()
        .single();

      if (error) {
        return NextResponse.json(
          { message: error.message },
          { status: 500 }
        );
      }

      if (!data) {
        return NextResponse.json(
          { message: "Bill not found or already closed" },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { message: "Bill closed successfully", bill: data },
        { status: 200 }
      );
    } else if (action === "status") {
      // Update bill status for table
      const { tableId } = body;

      if (!tableId) {
        return NextResponse.json(
          { message: "Không tìm thấy bàn cần thanh toán" },
          { status: 400 }
        );
      }

      const { data: bill, error: billError } = await supabaseAdmin
        .from("bills")
        .select(`
          id,
          table_id,
          status,
          created_at,
          orders (
            id,
            status,
            order_items (
              id,
              quantity,
              menu_items ( name, price )
            )
          )
        `)
        .eq("status", "open")
        .eq("table_id", tableId)
        .single();

      if (billError || !bill) {
        return NextResponse.json(
          { error: "Không có hóa đơn đang mở cho bàn này" },
          { status: 404 }
        );
      }

      const totalAmount = bill.orders
        .flatMap((o) => o.order_items)
        .reduce((sum, item) => sum + item.quantity * item.menu_items.price, 0);

      const { data: closedBill, error: updateError } = await supabaseAdmin
        .from("bills")
        .update({
          status: "closed",
          closed_at: new Date().toISOString(),
          total_amount: totalAmount,
        })
        .eq("id", bill.id)
        .select(`
          id,
          table_id,
          status,
          total_amount,
          created_at,
          closed_at,
          orders (
            id,
            status,
            order_items (
              id,
              quantity,
              menu_items ( name, price )
            )
          )
        `)
        .single();

      if (updateError) {
        return NextResponse.json(
          { error: updateError.message },
          { status: 500 }
        );
      }

      return NextResponse.json(closedBill);
    } else {
      return NextResponse.json(
        { message: "Invalid action. Use 'close' or 'status'" },
        { status: 400 }
      );
    }
  } catch (err) {
    return NextResponse.json(
      { message: err.message || "Server error" },
      { status: 500 }
    );
  }
}
