import { NextResponse } from "next/server"
import { requireAuth } from "@/lib/auth"

export async function GET(req) {
  const { user, staff, error } = await requireAuth(req)

  if (error) {
    return error
  }

  return NextResponse.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
    },
    staff: {
      id: staff.id,
      email: staff.email,
      name: staff.name,
      role: staff.role,
    },
  })
}