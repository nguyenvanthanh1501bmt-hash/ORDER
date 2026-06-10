'use client'

function getAppBaseUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (typeof window !== "undefined" ? window.location.origin : "")

  const baseUrl = appUrl.replace(/\/$/, "")

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_APP_URL. Please set NEXT_PUBLIC_APP_URL in .env.local or ensure window.location is available"
    )
  }

  return baseUrl
}

export function generateTableQRCode(table) {
  if (!table?.id) throw new Error("Invalid table")

  const baseUrl = getAppBaseUrl()
  const randomText = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const token = `table-${table.id}-${randomText}`

  return `${baseUrl}/?table=${encodeURIComponent(token)}`
}