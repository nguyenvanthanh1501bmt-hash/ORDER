import { createTableController } from "@/controllers/tableController";

export async function POST(req) {
  return createTableController(req);
}
