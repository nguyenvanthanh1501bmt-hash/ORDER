"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import useAuth from "@/hooks/useAuth"
import Auth from "@/components/auth/Auth"
import { authFetch } from "@/utils/authFetch"

export default function CheckUser() {
  const { user, accessToken, loading } = useAuth()
  const router = useRouter()

  const [checkingRole, setCheckingRole] = useState(true)
  const [message, setMessage] = useState("")

  useEffect(() => {
    let cancelled = false

    const checkAccess = async () => {
      if (loading) return

      if (!user || !accessToken) {
        if (!cancelled) {
          setCheckingRole(false)
        }

        return
      }

      setCheckingRole(true)
      setMessage("")

      try {
        const res = await authFetch("/api/auth/me", {
          token: accessToken,
        })

        const result = await res.json().catch(() => null)

        if (cancelled) return

        if (!res.ok || !result?.success) {
          console.error("Check user role error:", result)

          if (res.status === 401) {
            await client.auth.signOut()
          }

          setMessage(result?.message || "Cannot check user role.")
          setCheckingRole(false)
          return
        }

        const role = result.staff?.role?.trim().toLowerCase()

        if (role === "admin") {
          router.replace("/pages/admin")
          return
        }

        if (role === "staff") {
          router.replace("/pages/staff")
          return
        }

        await client.auth.signOut()
        setMessage("Invalid user role. Please contact admin.")
        setCheckingRole(false)
      } catch (err) {
        console.error("Check user role unexpected error:", err)

        if (!cancelled) {
          setMessage("Cannot connect to auth server.")
          setCheckingRole(false)
        }
      }
    }

    checkAccess()

    return () => {
      cancelled = true
    }
  }, [user, accessToken, loading, router])

  if (loading || checkingRole) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <h1 className="text-lg font-semibold">Loading...</h1>
      </div>
    )
  }

  return (
    <>
      {message && (
        <div className="mx-auto mt-6 max-w-sm rounded-md bg-red-50 px-4 py-3 text-center text-sm text-red-600">
          {message}
        </div>
      )}

      <Auth />
    </>
  )
}