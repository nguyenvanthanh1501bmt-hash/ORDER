"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()

  const [ready, setReady] = useState(false)
  const [password, setPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const prepareRecoverySession = async () => {
      try {
        if (typeof window === "undefined") return

        const hashParams = new URLSearchParams(window.location.hash.slice(1))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")

        if (accessToken && refreshToken) {
          const { error } = await client.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken,
          })

          if (error) {
            setMessage(error.message)
            setReady(false)
            return
          }

          window.history.replaceState(null, "", window.location.pathname)
        }

        const { data, error } = await client.auth.getSession()

        if (error || !data.session) {
          setMessage("Invalid or expired reset link.")
          setReady(false)
          return
        }

        setReady(true)
      } catch (err) {
        console.error(err)
        setMessage("Invalid or expired reset link.")
        setReady(false)
      }
    }

    prepareRecoverySession()
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()

    if (loading) return

    setLoading(true)
    setMessage("")

    if (!ready) {
      setMessage("Invalid or expired reset link.")
      setLoading(false)
      return
    }

    if (password.length < 6) {
      setMessage("Password must be at least 6 characters.")
      setLoading(false)
      return
    }

    if (password !== confirmNewPassword) {
      setMessage("Password confirmation does not match.")
      setLoading(false)
      return
    }

    try {
      const { error } = await client.auth.updateUser({
        password,
      })

      if (error) {
        setMessage(error.message)
        return
      }

      await client.auth.signOut()

      setMessage("Password reset successful. Redirecting to login page...")

      setTimeout(() => {
        router.replace("/pages")
      }, 1500)
    } catch (err) {
      console.error(err)
      setMessage("An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <form
        onSubmit={handleReset}
        className="w-full max-w-md rounded-2xl border bg-white p-6 shadow-sm"
      >
        <h1 className="mb-2 text-center text-2xl font-bold">
          Reset Password
        </h1>

        <p className="mb-6 text-center text-sm text-slate-500">
          Enter your new password below.
        </p>

        {message && (
          <p className="mb-4 rounded-md bg-slate-100 px-3 py-2 text-center text-sm text-slate-700">
            {message}
          </p>
        )}

        <div className="mb-4">
          <label className="mb-1 block text-sm font-medium">
            New password
          </label>

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="mb-6">
          <label className="mb-1 block text-sm font-medium">
            Confirm new password
          </label>

          <input
            type="password"
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <Button
          type="submit"
          disabled={loading || !ready}
          className="w-full"
        >
          {loading ? "Updating..." : "Update password"}
        </Button>
      </form>
    </div>
  )
}