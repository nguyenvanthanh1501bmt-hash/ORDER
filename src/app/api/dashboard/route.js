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

    const [
      openBillsRes,
      closedBillsTodayRes,
      ordersTodayRes,
      pendingOrdersRes,
      menuCountRes,
      tableCountRes,
    ] = await Promise.all([
      supabaseAdmin
        .from("bills")
        .select(
          `
          id,
          table_id,
          status,
          total_amount,
          created_at,
          tables (
            id,
            name
          )
        `
        )
        .eq("status", "open")
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("bills")
        .select("id, total_amount, closed_at")
        .eq("status", "closed")
        .gte("closed_at", start)
        .lt("closed_at", end),

      supabaseAdmin
        .from("orders")
        .select(
          `
          id,
          status,
          created_at,
          bills (
            table_id,
            tables (
              id,
              name
            )
          )
        `
        )
        .gte("created_at", start)
        .lt("created_at", end)
        .order("created_at", { ascending: false }),

      supabaseAdmin
        .from("orders")
        .select(
          `
          id,
          status,
          created_at,
          bills (
            table_id,
            tables (
              id,
              name
            )
          )
        `
        )
        .in("status", ["pending_staff_approval", "accepted"])
        .order("created_at", { ascending: true })
        .limit(8),

      supabaseAdmin.from("menu_items").select("id", {
        count: "exact",
        head: true,
      }),

      supabaseAdmin.from("tables").select("id", {
        count: "exact",
        head: true,
      }),
    ]);

    const firstError =
      openBillsRes.error ||
      closedBillsTodayRes.error ||
      ordersTodayRes.error ||
      pendingOrdersRes.error ||
      menuCountRes.error ||
      tableCountRes.error;

    if (firstError) {
      return NextResponse.json(
        { success: false, message: firstError.message },
        { status: 500 }
      );
    }

    const openBills = openBillsRes.data || [];
    const closedBillsToday = closedBillsTodayRes.data || [];
    const ordersToday = ordersTodayRes.data || [];
    const pendingOrders = pendingOrdersRes.data || [];

    const orderStatusStats = ordersToday.reduce((acc, order) => {
      acc[order.status] = (acc[order.status] || 0) + 1;
      return acc;
    }, {});

    return NextResponse.json({
      success: true,
      data: {
        stats: {
          revenueToday: sumMoney(closedBillsToday),
          openRevenue: sumMoney(openBills),
          openBillCount: openBills.length,
          ordersTodayCount: ordersToday.length,
          pendingOrderCount: pendingOrders.length,
          menuItemCount: menuCountRes.count || 0,
          tableCount: tableCountRes.count || 0,
        },
        orderStatusStats,
        openBills,
        pendingOrders,
        recentOrders: ordersToday.slice(0, 8),
      },
    });
  } catch (error) {
    console.error("[ADMIN] dashboard error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error.message || "Failed to load dashboard",
      },
      { status: 500 }
    );
  }
}