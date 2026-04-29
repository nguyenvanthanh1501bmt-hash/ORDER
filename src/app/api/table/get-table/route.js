import { getAllTablesController } from "@/controllers/tableController";

export async function GET() {
  return getAllTablesController();
}

