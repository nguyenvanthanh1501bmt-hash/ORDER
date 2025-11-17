'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import client from "@/api/client"
import { Button } from "@/components/ui/button"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [accessToken, setAccessToken] = useState(null)
  const [password, setPassword] = useState("")
  const [confirmNewPassword, setConfirmNewPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  // Lấy token từ hash sau khi mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash // "#access_token=..."
      const params = new URLSearchParams(hash.slice(1))
      setAccessToken(params.get("access_token"))
    }
  }, [])

  const handleReset = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    if (!accessToken) {
      setMessage("Token không hợp lệ hoặc đã hết hạn!")
      setLoading(false)
      return
    }

    if (password !== confirmNewPassword) {
      setMessage("Mật khẩu xác nhận không khớp!")
      setLoading(false)
      return
    }

    // Cập nhật mật khẩu bằng access token
    const { error } = await client.auth.updateUser({ password }, accessToken)

    if (error) setMessage(error.message)
    else {
      setMessage("Đổi mật khẩu thành công!")
      setTimeout(() => router.push("/pages"), 2000)
    }

    setLoading(false)
  }

  return (
    <div className="flex flex-col justify-center items-center h-screen gap-4">
      <h2 className="text-xl font-semibold">Reset Password</h2>
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
        <Button type="submit" disabled={loading || !accessToken}>
          {loading ? "Resetting..." : "Reset Password"}
        </Button>
      </form>
      {message && <p className="text-center">{message}</p>}
    </div>
  )
}
