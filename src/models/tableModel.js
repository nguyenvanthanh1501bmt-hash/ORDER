import { supabaseAdmin } from "@/api/adminClient";

// Get all tables
export async function getAllTables() {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("id, qr_code_id, name, created_at")
    .order("created_at", { ascending: true });

  if (error) {
    console.error("Get all tables error:", error);
    throw error;
  }

  return data || [];
}

// Get table by ID
export async function getTableById(id) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("id, qr_code_id, name, created_at")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Get table by ID error:", error);
    throw error;
  }

  return data;
}

// Create table
export async function createTable(tableData) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .insert([tableData])
    .select("id, qr_code_id, name, created_at")
    .single();

  if (error) {
    console.error("Create table error:", error);
    throw error;
  }

  return data;
}

// Update table
export async function updateTable(id, updates) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .update(updates)
    .eq("id", id)
    .select("id, qr_code_id, name, created_at")
    .single();

  if (error) {
    console.error("Update table error:", error);
    throw error;
  }

  return data;
}

// Delete table
export async function deleteTable(id) {
  const { error } = await supabaseAdmin
    .from("tables")
    .delete()
    .eq("id", id);

  if (error) {
    console.error("Delete table error:", error);
    throw error;
  }

  return { message: "Table deleted successfully" };
}

// Update table QR code
export async function updateTableQRCode(id, qrCodeId) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .update({
      qr_code_id: qrCodeId,
    })
    .eq("id", id)
    .select("id, qr_code_id, name, created_at")
    .single();

  if (error) {
    console.error("Update table QR code error:", error);
    throw error;
  }

  return data;
}