"use client"

import React, { useState } from "react"
import client from "@/api/client"

const Signup = () => {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (loading) return

    setError(null)
    setSuccess(null)

    const cleanName = name.trim()
    const cleanEmail = email.trim()

    if (!cleanName) {
      setError("Name is required")
      return
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    setLoading(true)

    try {
      const { error: signupError } = await client.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            name: cleanName,
          },
        },
      })

      if (signupError) {
        setError(signupError.message || "Signup failed")
        return
      }

      const { error: staffError } = await client
        .from("staff")
        .insert([
          {
            email: cleanEmail,
            role: "staff",
            name: cleanName,
          },
        ])

      if (staffError) {
        console.error("Cannot insert staff:", staffError)
        setError("Signup created, but cannot create staff profile. Please contact admin.")
        return
      }

      setName("")
      setEmail("")
      setPassword("")
      setConfirmPassword("")
      setSuccess("Signup successful. You can login now.")
    } catch (err) {
      console.error(err)
      setError("Something went wrong")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-2xl font-semibold text-center">Sign Up</h2>

      {error && <p className="text-red-500 text-center">{error}</p>}
      {success && <p className="text-green-600 text-center">{success}</p>}

      <input
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

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

      <input
        type="password"
        placeholder="Confirm Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        className="border px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />

      <button
        type="submit"
        disabled={loading}
        className="bg-green-500 text-white py-2 rounded-md hover:bg-green-600 transition-colors disabled:opacity-50"
      >
        {loading ? "Signing up..." : "Sign Up"}
      </button>
    </form>
  )
}

export default Signup