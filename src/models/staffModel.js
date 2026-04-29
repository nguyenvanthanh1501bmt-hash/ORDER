import { supabaseAdmin } from "@/api/adminClient";

// Get all staff members
export async function getAllStaff() {
  const { data, error } = await supabaseAdmin
    .from("staff")
    .select("*");

  if (error) throw error;
  return data;
}

// Get staff by ID
export async function getStaffById(id) {
  const { data, error } = await supabaseAdmin
    .from("staff")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw error;
  return data;
}

// Create new staff member
export async function createStaff(staffData) {
  const { email, password, name, role } = staffData;

  // 1. Create user in Supabase Auth
  const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });

  if (authError) throw authError;

  const authUserId = authUser.user.id;

  // 2. Add record to staff table
  const { data, error: dbError } = await supabaseAdmin
    .from("staff")
    .insert([{ user_id: authUserId, email, name, role }])
    .select()
    .single();

  if (dbError) throw dbError;
  return data;
}

// Update staff member
export async function updateStaff(id, updates) {
  const { data, error } = await supabaseAdmin
    .from("staff")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete staff member
export async function deleteStaff(id) {
  // Get staff to find user_id for auth deletion
  const staff = await getStaffById(id);

  // Delete from auth if user_id exists
  if (staff.user_id) {
    const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(
      staff.user_id
    );
    if (authError) throw authError;
  }

  // Delete from staff table
  const { error } = await supabaseAdmin
    .from("staff")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return { message: "Staff deleted successfully" };
}

// Reset staff password
export async function resetStaffPassword(id, newPassword) {
  const staff = await getStaffById(id);

  if (!staff.user_id) throw new Error("Staff user not found");

  const { error } = await supabaseAdmin.auth.admin.updateUserById(
    staff.user_id,
    { password: newPassword }
  );

  if (error) throw error;
  return { message: "Password reset successfully" };
}
