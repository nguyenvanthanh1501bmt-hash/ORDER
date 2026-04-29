import { supabaseAdmin } from "@/api/adminClient";

// Get all menu items
export async function getAllMenuItems() {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*");

  if (error) throw error;
  return data;
}

// Get menu item by ID
export async function getMenuItemById(id) {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Get menu items by IDs
export async function getMenuItemsByIds(ids) {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .select("id, name, price")
    .in("id", ids);

  if (error) throw error;
  return data;
}

// Create menu item
export async function createMenuItem(menuData) {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .insert([menuData])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update menu item
export async function updateMenuItem(id, updates) {
  const { data, error } = await supabaseAdmin
    .from("menu_items")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete menu item
export async function deleteMenuItem(id) {
  const { error } = await supabaseAdmin
    .from("menu_items")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { message: "Menu item deleted successfully" };
}
