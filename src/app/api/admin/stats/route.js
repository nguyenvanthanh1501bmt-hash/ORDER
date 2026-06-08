import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/api/adminClient";
import { requireRole } from "@/lib/auth";

function getVietnamTodayRange() {
  const now = new Date();

  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Ho_Chi_Minh",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(now);

  const year = Number(parts.find((p) => p.type === "year")?.value);
  const month = Number(parts.find((p) => p.type === "month")?.value);
  const day = Number(parts.find((p) => p.type === "day")?.value);

  const start = new Date(Date.UTC(year, month - 1, day, -7, 0, 0));
  const end = new Date(Date.UTC(year, month - 1, day + 1, -7, 0, 0));

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
}

function sumMoney(rows = [], field = "total_amount") {
  return rows.reduce((sum, row) => sum + Number(row?.[field] || 0), 0);
}

export async function GET(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  try {
    const { start, end } = getVietnamTodayRange();

    const [openBillsRes, closedBillsTodayRes, pendingOrdersRes, tableCountRes] =
      await Promise.all([
        supabaseAdmin
          .from("bills")
          .select("id")
          .eq("status", "open"),
        supabaseAdmin
          .from("bills")
          .select("id, total_amount, closed_at")
          .eq("status", "closed")
          .gte("closed_at", start)
          .lt("closed_at", end),
        supabaseAdmin
          .from("orders")
          .select("id")
          .in("status", ["pending_staff_approval", "accepted"]),
        supabaseAdmin.from("tables").select("id", {
          count: "exact",
          head: true,
        }),
      ]);

    const firstError =
      openBillsRes.error ||
      closedBillsTodayRes.error ||
      pendingOrdersRes.error ||
      tableCountRes.error;

    if (firstError) {
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 500 }
      );
    }

    const openBills = openBillsRes.data || [];
    const closedBillsToday = closedBillsTodayRes.data || [];
    const pendingOrders = pendingOrdersRes.data || [];

    return NextResponse.json({
      success: true,
      revenueToday: sumMoney(closedBillsToday),
      revenueChangePercent: 0,
      activeBills: openBills.length,
      pendingBills: pendingOrders.length,
      occupiedTables: openBills.length,
      totalTables: tableCountRes.count || 0,
      avgPrepTimeMinutes: 0,
      prepTimeChangeMinutes: 0,
    });
  } catch (error) {
    console.error("[ADMIN] admin/stats error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load admin stats",
      },
      { status: 500 }
    );
  }
}
