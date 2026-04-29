import { getAllMenuItemsController } from "@/controllers/menuItemController";

export async function GET() {
  return getAllMenuItemsController();
}
