import { supabaseAdmin } from "@/api/adminClient";

const BUCKET_NAME = "food-images";
const FOLDER_NAME = "foods";

function sanitizeFileName(fileName) {
  return fileName
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .toLowerCase();
}

export async function uploadMenuImage(file) {
  const fileBuffer = Buffer.from(await file.arrayBuffer());

  const safeFileName = sanitizeFileName(file.name);
  const fileName = `${Date.now()}-${safeFileName}`;
  const filePath = `${FOLDER_NAME}/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from(BUCKET_NAME)
    .upload(filePath, fileBuffer, {
      cacheControl: "3600",
      upsert: false,
      contentType: file.type,
    });

  if (uploadError) throw uploadError;

  const { data } = supabaseAdmin.storage
    .from(BUCKET_NAME)
    .getPublicUrl(filePath);

  return data.publicUrl;
}