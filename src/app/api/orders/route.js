import { createOrderController } from "@/controllers/orderController";

export async function POST(req) {
  return createOrderController(req);
}
