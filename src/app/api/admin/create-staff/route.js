import { createStaffController } from "@/controllers/staffController";

export async function POST(req) {
  return createStaffController(req);
}
