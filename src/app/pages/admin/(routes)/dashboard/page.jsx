"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Banknote,
  ClipboardList,
  Clock3,
  Pizza,
  Receipt,
  RefreshCcw,
  UtensilsCrossed,
} from "lucide-react";
import { authFetch } from "@/utils/authFetch";

// Format a number as Vietnamese Dong (VND) currency
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

// Format a date/time value into a short localized string
const formatDateTime = (value) => {
  if (!value) return "-";
  return new Intl.DateTimeFormat("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

// Map order status keys to human-readable English labels
const statusLabel = {
  pending_staff_approval: "Awaiting Staff",
  accepted: "Accepted",
  served: "Served",
  cancelled: "Cancelled",
};

// Reusable stat card component for the summary grid
function StatCard({ title, value, icon: Icon, hint }) {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 text-2xl font-bold text-gray-900">{value}</p>
          {hint && <p className="mt-1 text-xs text-gray-400">{hint}</p>}
        </div>

        {/* Icon badge */}
        <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const [data, setData] = useState(null);       // Dashboard data from API
  const [loading, setLoading] = useState(true); // Initial loading state
  const [refreshing, setRefreshing] = useState(false); // Manual refresh state
  const [error, setError] = useState("");       // Error message if fetch fails

  // Fetch dashboard data from the API
  const loadDashboard = async () => {
    try {
      setError("");

      const res = await authFetch("/api/dashboard", {
        method: "GET",
        cache: "no-store", // Always fetch fresh data
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || "Failed to load dashboard");
      }

      setData(json.data);
    } catch (err) {
      setError(err.message || "An error occurred");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Load dashboard on component mount
  useEffect(() => {
    loadDashboard();
  }, []);

  // Trigger a manual refresh
  const handleRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  // Show loading state while data is being fetched for the first time
  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-500">Loading data...</p>
      </div>
    );
  }

  // Destructure data with safe fallbacks
  const stats = data?.stats || {};
  const openBills = data?.openBills || [];
  const pendingOrders = data?.pendingOrders || [];
  const recentOrders = data?.recentOrders || [];

  return (
    <div className="space-y-6 p-4 md:p-6">

      {/* Page header with title and refresh button */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-1 text-sm text-gray-500">
            Overview of today's restaurant activity.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          disabled={refreshing}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {/* Spin the icon while refreshing */}
          <RefreshCcw size={16} className={refreshing ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Error banner — only shown when a fetch error occurs */}
      {error && (
        <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Summary stat cards grid */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Today's Revenue"
          value={formatCurrency(stats.revenueToday)}
          icon={Banknote}
          hint="From paid bills"
        />
        <StatCard
          title="Open Bills"
          value={stats.openBillCount || 0}
          icon={Receipt}
          hint={formatCurrency(stats.openRevenue)}
        />
        <StatCard
          title="Today's Orders"
          value={stats.ordersTodayCount || 0}
          icon={ClipboardList}
          hint={`${stats.pendingOrderCount || 0} orders processing`}
        />
        <StatCard
          title="Tables / Menu Items"
          value={`${stats.tableCount || 0} / ${stats.menuItemCount || 0}`}
          icon={UtensilsCrossed}
          hint="Total tables and menu items"
        />
      </div>

      {/* Two-column section: open bills and pending orders */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* Open bills panel */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Open Bills</h2>
              <p className="text-sm text-gray-500">
                Tables that haven't been paid yet.
              </p>
            </div>

            {/* Link to the full bills management page */}
            <Link
              href="/pages/admin/Bill"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View all
            </Link>
          </div>

          {openBills.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              No open bills.
            </div>
          ) : (
            <div className="space-y-3">
              {/* Show up to 6 open bills */}
              {openBills.slice(0, 6).map((bill) => (
                <div
                  key={bill.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {bill.tables?.name || `Table #${bill.table_id}`}
                    </p>
                    <p className="mt-1 text-xs text-gray-500">
                      Opened at {formatDateTime(bill.created_at)}
                    </p>
                  </div>

                  <p className="font-bold text-gray-900">
                    {formatCurrency(bill.total_amount)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Pending orders panel */}
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-gray-900">Processing Orders</h2>
            <p className="text-sm text-gray-500">
              Orders awaiting staff or currently accepted.
            </p>
          </div>

          {pendingOrders.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              No pending orders.
            </div>
          ) : (
            <div className="space-y-3">
              {pendingOrders.map((order) => (
                <div
                  key={order.id}
                  className="flex items-center justify-between rounded-xl border border-gray-100 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-900">
                      {order.bills?.tables?.name || "Unknown table"}
                    </p>
                    <p className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                      <Clock3 size={13} />
                      {formatDateTime(order.created_at)}
                    </p>
                  </div>

                  {/* Status badge */}
                  <span className="rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                    {statusLabel[order.status] || order.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Recent orders table for today */}
      <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center gap-2">
          <Pizza size={20} className="text-blue-600" />
          <h2 className="text-lg font-bold text-gray-900">Recent Orders Today</h2>
        </div>

        {recentOrders.length === 0 ? (
          <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
            No orders today.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[680px] text-left text-sm">
              <thead>
                <tr className="border-b text-xs uppercase text-gray-400">
                  <th className="px-3 py-3 font-semibold">Table</th>
                  <th className="px-3 py-3 font-semibold">Status</th>
                  <th className="px-3 py-3 font-semibold">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id} className="border-b last:border-0">
                    <td className="px-3 py-3 font-medium text-gray-900">
                      {order.bills?.tables?.name || "Unknown table"}
                    </td>
                    <td className="px-3 py-3 text-gray-600">
                      {statusLabel[order.status] || order.status}
                    </td>
                    <td className="px-3 py-3 text-gray-500">
                      {formatDateTime(order.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}