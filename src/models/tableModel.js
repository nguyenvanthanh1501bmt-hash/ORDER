import { supabaseAdmin } from "@/api/adminClient";

// Get all tables
export async function getAllTables() {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("id, qr_code_id, name, created_at");

  if (error) throw error;
  return data;
}

// Get table by ID
export async function getTableById(id) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Create table
export async function createTable(tableData) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .insert([tableData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update table
export async function updateTable(id, updates) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete table
export async function deleteTable(id) {
  const { error } = await supabaseAdmin
    .from("tables")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { message: "Table deleted successfully" };
}

// Update table QR code
export async function updateTableQRCode(id, qrCodeId) {
  const { data, error } = await supabaseAdmin
    .from("tables")
    .update({ qr_code_id: qrCodeId })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}
