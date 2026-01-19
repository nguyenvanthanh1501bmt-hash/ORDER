'use client'

import { useState } from "react"
import client from "@/api/client"
import { Button } from "@/components/ui/button"

export default function ForgotPass() {

  // ====================== STATE ======================
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // ====================== HANDLE SUBMIT ======================
  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      // Send password reset email
      const { error: resetError } =
        await client.auth.resetPasswordForEmail(email, {
          // Redirect URL after user clicks reset link
          redirectTo: `${window.location.origin}/pages/reset-password`
        })

      if (resetError) {
        setError(resetError.message)
      } else {
        // Always return success message for security reasons
        setSuccess(
          'If the email is valid, you will receive a password reset link.'
        )
      }

    } catch (err) {
      console.error(err)
      // System / unexpected error
      setError('An unexpected error occurred.')
    }

    setLoading(false)
  }

  // ====================== RENDER ======================
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold mb-4">
        Forgot Password
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-72">
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="border px-3 py-2 rounded-xl"
        />

        <Button type="submit" disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        {/* Error message */}
        {error && (
          <p className="text-red-500 text-sm">
            {error}
          </p>
        )}

        {/* Success message */}
        {success && (
          <p className="text-green-600 text-sm">
            {success}
          </p>
        )}
      </form>
    </div>
  )
}
