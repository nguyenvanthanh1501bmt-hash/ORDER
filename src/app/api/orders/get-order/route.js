import { getAllPendingOrdersController } from "@/controllers/orderController";

export async function GET() {
  return getAllPendingOrdersController();
}
