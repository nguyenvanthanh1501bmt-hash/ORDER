'use client'

import { useState } from "react"
import client from "@/api/client"
import { Button } from "@/components/ui/button"

export default function ForgotPass() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const handleSubmit = async (e) => {
  e.preventDefault()
  setLoading(true)
  setError('')
  setSuccess('')

  try {
    const { error: resetError } = await client.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/pages/reset-password`
    })

    if (resetError) {
      setError(resetError.message)
    } else {
      setSuccess('Nếu email hợp lệ, bạn sẽ nhận được link reset!')
    }

  } catch (err) {
    console.error(err)
    setError('Có lỗi xảy ra!')
  }

  setLoading(false)
}

  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <h1 className="text-xl font-semibold mb-4">Forgot password</h1>
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
        {error && <p className="text-red-500 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
      </form>
    </div>
  )
}
