"use client";

import { useEffect, useMemo, useState } from "react";
import {
  CheckCircle2,
  Clock3,
  Receipt,
  RefreshCcw,
  Search,
  XCircle,
} from "lucide-react";
import { authFetch } from "@/utils/authFetch";

// Format a number as Vietnamese Dong currency.
const formatCurrency = (value) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(Number(value || 0));

// Format date and time values for display.
const formatDateTime = (value) => {
  if (!value) return "-";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(value));
};

// Display labels for bill and order statuses.
const statusLabel = {
  pending_staff_approval: "Waiting for staff",
  accepted: "Accepted",
  served: "Served",
  cancelled: "Cancelled",
  open: "Open",
  closed: "Paid",
};

// Normalize API response data.
function getResponseData(json) {
  if (Array.isArray(json)) return json;
  return json?.data ?? json;
}

export default function BillPage() {
  const [bills, setBills] = useState([]);
  const [selectedBillId, setSelectedBillId] = useState(null);
  const [billDetail, setBillDetail] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [loadingBills, setLoadingBills] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [closing, setClosing] = useState(false);
  const [error, setError] = useState("");

  // Fetch all open bills from the API.
  const fetchBills = async () => {
    try {
      setError("");

      const res = await authFetch("/api/bill", {
        method: "GET",
        cache: "no-store",
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error || "Unable to load bills");
      }

      const data = getResponseData(json) || [];
      setBills(data);

      // Automatically select the first bill if no bill is selected.
      if (!selectedBillId && data.length > 0) {
        setSelectedBillId(data[0].id);
      }
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoadingBills(false);
    }
  };

  // Fetch detail information for the selected bill.
  const fetchBillDetail = async (billId) => {
    if (!billId) return;

    try {
      setError("");
      setLoadingDetail(true);

      const res = await authFetch("/api/bill", {
        method: "POST",
        body: JSON.stringify({ billId }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(
          json.message || json.error || "Unable to load bill details"
        );
      }

      setBillDetail(getResponseData(json));
    } catch (err) {
      setError(err.message || "Something went wrong");
      setBillDetail(null);
    } finally {
      setLoadingDetail(false);
    }
  };

  // Load bills when the page is mounted.
  useEffect(() => {
    fetchBills();
  }, []);

  // Load bill details whenever the selected bill changes.
  useEffect(() => {
    if (selectedBillId) {
      fetchBillDetail(selectedBillId);
    }
  }, [selectedBillId]);

  // Get the summary data of the currently selected bill.
  const selectedBillSummary = useMemo(() => {
    return bills.find((bill) => bill.id === selectedBillId);
  }, [bills, selectedBillId]);

  // Filter bills by table name or bill ID.
  const filteredBills = useMemo(() => {
    const keyword = searchText.trim().toLowerCase();

    if (!keyword) return bills;

    return bills.filter((bill) => {
      const tableName = bill.tables?.name || "";

      return (
        tableName.toLowerCase().includes(keyword) ||
        String(bill.id).toLowerCase().includes(keyword)
      );
    });
  }, [bills, searchText]);

  // Flatten all order items from all orders in the selected bill.
  const orderItems = useMemo(() => {
    if (!billDetail?.orders) return [];

    return billDetail.orders.flatMap((order) =>
      (order.order_items || []).map((item) => ({
        ...item,
        orderId: order.id,
        orderStatus: order.status,
        orderCreatedAt: order.created_at,
      }))
    );
  }, [billDetail]);

  // Calculate total amount from order items if the bill total is missing.
  const calculatedTotal = useMemo(() => {
    return orderItems.reduce((sum, item) => {
      const price = Number(item.unit_price || 0);
      const quantity = Number(item.quantity || 0);

      return sum + price * quantity;
    }, 0);
  }, [orderItems]);

  const displayTotal = Number(billDetail?.total_amount || 0) || calculatedTotal;

  // Close the current bill after payment confirmation.
  const handleCloseBill = async () => {
    if (!billDetail?.id) return;

    const ok = window.confirm("Confirm payment and close this bill?");
    if (!ok) return;

    try {
      setClosing(true);
      setError("");

      const res = await authFetch("/api/bill?action=close", {
        method: "PATCH",
        body: JSON.stringify({ bill_id: billDetail.id }),
      });

      const json = await res.json();

      if (!res.ok) {
        throw new Error(json.message || json.error || "Unable to close bill");
      }

      setBillDetail(null);
      setSelectedBillId(null);
      await fetchBills();
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setClosing(false);
    }
  };

  // Refresh bills and reload the selected bill details.
  const handleRefresh = async () => {
    setLoadingBills(true);
    await fetchBills();

    if (selectedBillId) {
      await fetchBillDetail(selectedBillId);
    }
  };

  const tableName =
    selectedBillSummary?.tables?.name ||
    selectedBillSummary?.table?.name ||
    (billDetail?.table_id ? `Table #${billDetail.table_id}` : "No bill selected");

  return (
    <div className="space-y-6 p-4 md:p-6">
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bills</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage open bills and payments for each table.
          </p>
        </div>

        <button
          onClick={handleRefresh}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
        >
          <RefreshCcw size={16} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-700">
          <XCircle size={17} />
          {error}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[380px_1fr]">
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-gray-900">Open Bills</h2>
              <p className="text-sm text-gray-500">{bills.length} bills</p>
            </div>

            <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
              <Receipt size={22} />
            </div>
          </div>

          <div className="relative mb-4">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by table name or bill ID..."
              className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-3 text-sm outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {loadingBills ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              Loading bills...
            </div>
          ) : filteredBills.length === 0 ? (
            <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
              No open bills found.
            </div>
          ) : (
            <div className="max-h-[620px] space-y-3 overflow-y-auto pr-1">
              {filteredBills.map((bill) => {
                const active = bill.id === selectedBillId;

                return (
                  <button
                    key={bill.id}
                    onClick={() => setSelectedBillId(bill.id)}
                    className={`w-full rounded-xl border p-4 text-left transition ${
                      active
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-100 bg-white hover:bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-gray-900">
                          {bill.tables?.name || `Table #${bill.table_id}`}
                        </p>
                        <p className="mt-1 text-xs text-gray-500">
                          #{String(bill.id).slice(0, 8)}
                        </p>
                      </div>

                      <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                        {statusLabel[bill.status] || bill.status}
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between text-sm">
                      <span className="flex items-center gap-1 text-gray-500">
                        <Clock3 size={14} />
                        {formatDateTime(bill.created_at)}
                      </span>

                      <span className="font-bold text-gray-900">
                        {formatCurrency(bill.total_amount)}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          {!selectedBillId ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
              Select a bill to view details.
            </div>
          ) : loadingDetail ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
              Loading bill details...
            </div>
          ) : !billDetail ? (
            <div className="flex min-h-[420px] items-center justify-center rounded-xl bg-gray-50 text-sm text-gray-500">
              Bill details not found.
            </div>
          ) : (
            <div className="space-y-5">
              <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row md:items-start">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tableName}
                  </h2>

                  <div className="mt-2 space-y-1 text-sm text-gray-500">
                    <p>Bill ID: #{String(billDetail.id).slice(0, 8)}</p>
                    <p>Opened at: {formatDateTime(billDetail.created_at)}</p>
                    <p>Status: {statusLabel[billDetail.status]}</p>
                  </div>
                </div>

                <div className="rounded-2xl bg-gray-50 p-4 text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="mt-1 text-2xl font-bold text-gray-900">
                    {formatCurrency(displayTotal)}
                  </p>
                </div>
              </div>

              {billDetail.orders?.length === 0 ? (
                <div className="rounded-xl bg-gray-50 p-5 text-center text-sm text-gray-500">
                  This bill has no orders.
                </div>
              ) : (
                <div className="space-y-5">
                  {billDetail.orders?.map((order) => (
                    <div
                      key={order.id}
                      className="rounded-2xl border border-gray-100"
                    >
                      <div className="flex flex-col justify-between gap-2 border-b bg-gray-50 px-4 py-3 md:flex-row md:items-center">
                        <div>
                          <p className="font-semibold text-gray-900">
                            Order #{String(order.id).slice(0, 8)}
                          </p>
                          <p className="text-xs text-gray-500">
                            {formatDateTime(order.created_at)}
                          </p>
                        </div>

                        <span className="w-fit rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700">
                          {statusLabel[order.status] || order.status}
                        </span>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[720px] text-left text-sm">
                          <thead>
                            <tr className="border-b text-xs uppercase text-gray-400">
                              <th className="px-4 py-3 font-semibold">Item</th>
                              <th className="px-4 py-3 font-semibold">
                                Options
                              </th>
                              <th className="px-4 py-3 font-semibold">Qty</th>
                              <th className="px-4 py-3 font-semibold">Price</th>
                              <th className="px-4 py-3 font-semibold">
                                Subtotal
                              </th>
                              <th className="px-4 py-3 font-semibold">Note</th>
                            </tr>
                          </thead>

                          <tbody>
                            {(order.order_items || []).map((item) => {
                              const quantity = Number(item.quantity || 0);
                              const unitPrice = Number(item.unit_price || 0);
                              const itemTotal = quantity * unitPrice;

                              const options = item.selected_options
                                ? Object.entries(item.selected_options)
                                    .filter(
                                      ([, value]) =>
                                        value !== null &&
                                        value !== undefined &&
                                        value !== ""
                                    )
                                    .map(([key, value]) => `${key}: ${value}`)
                                    .join(", ")
                                : "-";

                              return (
                                <tr
                                  key={item.id}
                                  className="border-b last:border-0"
                                >
                                  <td className="px-4 py-3 font-medium text-gray-900">
                                    {item.base_item_name ||
                                      `Item #${item.menu_item_id}`}
                                  </td>

                                  <td className="px-4 py-3 text-gray-600">
                                    {options || "-"}
                                  </td>

                                  <td className="px-4 py-3 text-gray-600">
                                    {quantity}
                                  </td>

                                  <td className="px-4 py-3 text-gray-600">
                                    {formatCurrency(unitPrice)}
                                  </td>

                                  <td className="px-4 py-3 font-semibold text-gray-900">
                                    {formatCurrency(itemTotal)}
                                  </td>

                                  <td className="px-4 py-3 text-gray-500">
                                    {item.note || "-"}
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex flex-col-reverse gap-3 border-t pt-5 md:flex-row md:justify-end">
                <button
                  onClick={() => {
                    setSelectedBillId(null);
                    setBillDetail(null);
                  }}
                  className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
                >
                  Clear selection
                </button>

                <button
                  onClick={handleCloseBill}
                  disabled={closing || orderItems.length === 0}
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <CheckCircle2 size={17} />
                  {closing ? "Processing payment..." : "Pay bill"}
                </button>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}