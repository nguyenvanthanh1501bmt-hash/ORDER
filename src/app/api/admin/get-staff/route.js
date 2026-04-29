import { getStaffController } from "@/controllers/staffController";

export async function GET() {
    return getStaffController();
}