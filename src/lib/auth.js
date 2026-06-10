import { supabaseAdmin } from "@/api/adminClient"
import { errorResponse } from "@/utils/response"

export async function getUserFromRequest(request) {
  try {
    const authHeader = request.headers.get("authorization")

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return {
        user: null,
        error: errorResponse("Missing or invalid Authorization header", 401),
      }
    }

    const token = authHeader.substring(7)

    const {
      data: { user },
      error: authError,
    } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return {
        user: null,
        error: errorResponse("Invalid or expired token", 401, authError),
      }
    }

    return {
      user,
      error: null,
    }
  } catch (err) {
    console.error("[AUTH] getUserFromRequest error:", err)

    return {
      user: null,
      error: errorResponse("Authentication error", 500, err),
    }
  }
}

export async function requireAuth(request) {
  const { user, error: authError } = await getUserFromRequest(request)

  if (authError) {
    return {
      user: null,
      staff: null,
      error: authError,
    }
  }

  try {
    const email = user.email?.trim()

    if (!email) {
      return {
        user: null,
        staff: null,
        error: errorResponse("User email not found", 403),
      }
    }

    const { data: staffList, error: staffError } = await supabaseAdmin
      .from("staff")
      .select("id, email, name, role")
      .ilike("email", email)
      .limit(1)

    if (staffError) {
      console.error("[AUTH] staff query error:", staffError)

      return {
        user: null,
        staff: null,
        error: errorResponse("Cannot read staff record", 500, staffError),
      }
    }

    const staff = staffList?.[0]

    if (!staff) {
      return {
        user: null,
        staff: null,
        error: errorResponse("Staff record not found", 403),
      }
    }

    return {
      user,
      staff,
      error: null,
    }
  } catch (err) {
    console.error("[AUTH] requireAuth error:", err)

    return {
      user: null,
      staff: null,
      error: errorResponse("Authorization error", 500, err),
    }
  }
}

export async function requireRole(request, allowedRoles = []) {
  const { user, staff, error } = await requireAuth(request)

  if (error) {
    return {
      user: null,
      staff: null,
      error,
    }
  }

  const userRole = staff.role?.trim().toLowerCase()

  const normalizedAllowedRoles = allowedRoles.map((role) =>
    role.trim().toLowerCase()
  )

  if (!normalizedAllowedRoles.includes(userRole)) {
    return {
      user: null,
      staff: null,
      error: errorResponse(
        `Insufficient permissions. Required role: ${allowedRoles.join(", ")}`,
        403
      ),
    }
  }

  return {
    user,
    staff,
    error: null,
  }
}