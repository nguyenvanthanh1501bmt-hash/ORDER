import * as BillModel from "@/models/billModel";
import { NextResponse } from "next/server";

// Get all open bills
export async function getOpenBillsController() {
  try {
    const bills = await BillModel.getOpenBills();
    return NextResponse.json(bills);
  } catch (error) {
    console.error("[ADMIN] getOpenBills error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch open bills" },
      { status: 500 }
    );
  }
}

// Get bill detail
export async function getBillDetailController(req) {
  try {
    const { billId } = await req.json();

    if (!billId) {
      return NextResponse.json(
        { error: "billId is required" },
        { status: 400 }
      );
    }

    const bill = await BillModel.getBillDetail(billId);

    if (!bill) {
      return NextResponse.json(
        { error: "Bill not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(bill);
  } catch (error) {
    console.error("[ADMIN] getBillDetail error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to fetch bill detail" },
      { status: 500 }
    );
  }
}

// Close bill by bill_id
export async function closeBillController(req) {
  try {
    const { bill_id } = await req.json();

    if (!bill_id) {
      return NextResponse.json(
        { message: "bill_id is required" },
        { status: 400 }
      );
    }

    const bill = await BillModel.closeBill(bill_id);

    if (!bill) {
      return NextResponse.json(
        { message: "Bill not found or already closed" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Bill closed successfully",
        bill,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("[ADMIN] closeBill error:", error);

    return NextResponse.json(
      { message: error.message || "Failed to close bill" },
      { status: 500 }
    );
  }
}

// Close bill by tableId and recalculate total
export async function closeBillByTableController(req) {
  try {
    const { tableId } = await req.json();

    if (!tableId) {
      return NextResponse.json(
        { message: "Không tìm thấy bàn cần thanh toán" },
        { status: 400 }
      );
    }

    const closedBill = await BillModel.closeBillByTable(tableId);

    return NextResponse.json(closedBill);
  } catch (error) {
    console.error("[ADMIN] closeBillByTable error:", error);

    const status = error.message === "Không có hóa đơn đang mở cho bàn này"
      ? 404
      : 500;

    return NextResponse.json(
      { error: error.message || "Server error" },
      { status }
    );
  }
}

export async function getAllBillsWithStatsController() {
  try {
    const result = await BillModel.getAllBillsWithStats()
    return NextResponse.json(result)
  } catch (error) {
    console.error("[ADMIN] getAllBillsWithStats error:", error)

    return NextResponse.json(
      { error: error.message || "Failed to fetch bill history" },
      { status: 500 }
    )
  }
}