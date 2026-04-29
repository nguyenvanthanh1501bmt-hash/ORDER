import { createMenuItemController } from "@/controllers/menuItemController";

export async function POST(req) {
  return createMenuItemController(req);
}
