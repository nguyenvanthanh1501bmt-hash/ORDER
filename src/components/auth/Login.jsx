"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import client from "@/api/client"

const Login = () => {
  const router = useRouter()

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setError(null)
    setLoading(true)

    try {
      const cleanEmail = email.trim()

      const { data: loginData, error: loginError } =
        await client.auth.signInWithPassword({
          email: cleanEmail,
          password,
        })

      if (loginError) {
        setError(loginError.message || "Login failed")
        return
      }

      const token = loginData.session?.access_token

      if (!token) {
        await client.auth.signOut()
        setError("Cannot get login session. Please try again.")
        return
      }

      const res = await fetch("/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      const result = await res.json().catch(() => null)

      if (!res.ok || !result?.success) {
        console.error("Login role check error:", result)

        await client.auth.signOut()
        setError(result?.message || "Cannot check staff role.")
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
      setError("Unknown role. Please contact admin.")
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-4 max-w-sm mx-auto mt-10 p-4 border rounded-md shadow-md"
    >
      <h2 className="text-2xl font-semibold text-center">Login</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}

      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <Link
        href="/pages/forgot_password"
        className="text-sm text-blue-600 hover:underline text-center"
      >
        Forgot password?
      </Link>
    </form>
  )
}

export default Login