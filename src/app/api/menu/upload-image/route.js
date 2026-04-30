import { uploadMenuImageController } from "@/controllers/menuUploadController";
import { requireRole } from "@/lib/auth";

/**
 * Upload image to Supabase Storage
 * POST /api/menu/upload-image - admin only
 */

export async function POST(req) {
  const auth = await requireRole(req, ["admin"]);
  if (auth.error) return auth.error;

  return uploadMenuImageController(req);
}