import { supabaseAdmin } from "@/api/adminClient";
import { errorResponse } from "@/utils/response";

/**
 * Extract and verify JWT token from Authorization header
 * Returns { user, error } where error is Response if invalid
 */
export async function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        user: null,
        error: errorResponse("Missing or invalid Authorization header", 401),
      };
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    // Verify token server-side using Supabase
    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return {
        user: null,
        error: errorResponse("Invalid or expired token", 401),
      };
    }

    return { user, error: null };
  } catch (err) {
    return {
      user: null,
      error: errorResponse("Authentication error", 500),
    };
  }
}

/**
 * Get user and their staff record with role
 * Returns { user, staff, error } where error is Response if invalid
 *
 * Queries staff table to get the actual role (not relying on JWT role claims)
 */
export async function requireAuth(request) {
  const { user, error: authError } = await getUserFromRequest(request);

  if (authError) {
    return { user: null, staff: null, error: authError };
  }

  try {
    // Query staff table to get role
    const { data: staff, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, email, name, role, user_id")
      .eq("user_id", user.id)
      .single();

    if (staffError || !staff) {
      return {
        user: null,
        staff: null,
        error: errorResponse("Staff record not found", 403),
      };
    }

    return { user, staff, error: null };
  } catch (err) {
    return {
      user: null,
      staff: null,
      error: errorResponse("Authorization error", 500),
    };
  }
}

/**
 * Check if user has required role
 * allowedRoles: array of role strings (e.g., ["admin", "staff"])
 * Returns { user, staff, error } where error is Response if unauthorized
 */
export async function requireRole(request, allowedRoles = []) {
  const { user, staff, error } = await requireAuth(request);

  if (error) {
    return { user: null, staff: null, error };
  }

  // Check if staff role is in allowed roles
  if (!allowedRoles.includes(staff.role)) {
    return {
      user: null,
      staff: null,
      error: errorResponse(
        `Insufficient permissions. Required role: ${allowedRoles.join(", ")}`,
        403
      ),
    };
  }

  return { user, staff, error: null };
}
