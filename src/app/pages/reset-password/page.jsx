'use client'

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()

  // ====================== STATE ======================

  // Access token extracted from URL hash
  const [accessToken, setAccessToken] = useState(null)
  const [password, setPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // ====================== EXTRACT ACCESS TOKEN ======================
  // Reads access_token from URL hash when the page is loaded
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash // Example: "#access_token=..."
      const params = new URLSearchParams(hash.slice(1))
      const token = params.get("access_token")

      if (token) {
        // Use async state update to avoid hydration warnings
        setTimeout(() => setAccessToken(token), 0)
      }
    }
  }, [])

  // ====================== HANDLE PASSWORD RESET ======================
  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    // Validate access token
    if (!accessToken) {
      setMessage("Invalid or expired reset token.")
      setLoading(false)
      return
    }

    // Validate password confirmation
    if (password !== confirmNewPassword) {
      setMessage("Password confirmation does not match.")
      setLoading(false)
      return
    }

    try {
      // Update password using access token
      const { error } = await client.auth.updateUser(
        { password },
        accessToken
      )

      if (error) {
        setMessage(error.message)
        setLoading(false)
        return
      }

      // Sign out all existing sessions after password reset
      await client.auth.signOut()

      setMessage("Password reset successful. Redirecting to login page...")

      // Redirect user after short delay
      setTimeout(() => router.push("/pages"), 2000)

    } catch (err) {
      console.error(err)
      setMessage("An unexpected error occurred.")
    }

    setLoading(false)
  }

  // ====================== RENDER ======================
  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h2 className="text-xl font-semibold">
        Reset Password
      </h2>

      <form onSubmit={handleReset} className="flex flex-col gap-2 w-72">
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded-xl"
        />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmNewPassword}
          onChange={(e) => setConfirmNewPassword(e.target.value)}
          required
          className="border px-3 py-2 rounded-xl"
        />

        <Button
          type="submit"
          disabled={loading || !accessToken}
        >
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>

      {/* Status / error message */}
      {message && (
        <p className="text-center">
          {message}
        </p>
      )}
    </div>
  )
}
