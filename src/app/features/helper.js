// Format a timestamp into "DD/MM/YYYY HH:mm:ss"
export function formatDate(timestamp) {
  if (!timestamp) return "-"

  const date = new Date(timestamp)

  return `${date.getDate().toString().padStart(2, "0")}/${(
    date.getMonth() + 1
  )
    .toString()
    .padStart(2, "0")}/${date.getFullYear()} ${date
    .getHours()
    .toString()
    .padStart(2, "0")}:${date
    .getMinutes()
    .toString()
    .padStart(2, "0")}:${date
    .getSeconds()
    .toString()
    .padStart(2, "0")}`
}

// Calculate extra price based on selected size option
export function getSizeExtraPrice(option, sizeText) {
  if (!Array.isArray(option) || !sizeText) return 0

  const index = option.findIndex((opt) => opt === sizeText)

  if (index === -1) return 0

  return index * 5000
}

// Extract table QR code value from URL query string
export function getTableQRCode(search) {
  if (!search) return null

  const params = new URLSearchParams(search)

  return params.get("table")
}

function getAppBaseUrl() {
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "") ||
    (typeof window !== "undefined" ? window.location.origin : "")

  const baseUrl = appUrl.replace(/\/$/, "")

  if (!baseUrl) {
    throw new Error(
      "Missing NEXT_PUBLIC_APP_URL. Please set NEXT_PUBLIC_APP_URL in .env.local or ensure window.location is available"
    )
  }

  return baseUrl
}

// Generate new table QR.
// QR is no longer only table.id, so old QR can be invalidated after checkout.
export function generateTableQRCode(table) {
  if (!table?.id) throw new Error("Invalid table")

  const baseUrl = getAppBaseUrl()
  const randomText = `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`
  const token = `table-${table.id}-${randomText}`

  return `${baseUrl}/?table=${encodeURIComponent(token)}`
}