"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import useAuth from "@/hooks/useAuth"
import { authFetch } from "@/utils/authFetch"

export default function useRoleRedirect(requiredRole, redirectTo = "/pages") {
  const { user, accessToken, loading } = useAuth()
  const router = useRouter()

  const [checkingRole, setCheckingRole] = useState(true)

  useEffect(() => {
    let cancelled = false

    const checkRole = async () => {
      if (loading) return

      if (!user || !accessToken) {
        if (!cancelled) {
          setCheckingRole(false)
          router.replace(redirectTo)
        }

        return
      }

      setCheckingRole(true)

      try {
        const res = await authFetch("/api/auth/me", {
          token: accessToken,
        })

        const result = await res.json().catch(() => null)

        if (cancelled) return

        if (!res.ok || !result?.success) {
          console.error("Role check error:", result)

          if (res.status === 401) {
            await client.auth.signOut()
          }

          setCheckingRole(false)
          router.replace(redirectTo)
          return
        }

        const userRole = result.staff?.role?.trim().toLowerCase()
        const needRole = requiredRole?.trim().toLowerCase()

        if (userRole !== needRole) {
          setCheckingRole(false)
          router.replace(redirectTo)
          return
        }

        setCheckingRole(false)
      } catch (err) {
        console.error("Role check unexpected error:", err)

        if (!cancelled) {
          setCheckingRole(false)
          router.replace(redirectTo)
        }
      }
    }

    checkRole()

    return () => {
      cancelled = true
    }
  }, [user, accessToken, loading, requiredRole, redirectTo, router])

  return {
    user,
    loading,
    checkingRole,
  }
}