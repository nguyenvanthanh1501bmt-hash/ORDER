export async function getOpenBills() {
  const res = await fetch("/api/bill/get-open-bill")

  if (!res.ok) {
    console.error("Failed to fetch open bills")
    return []
  }

  const response = await res.json()
  // Handle new response format: { success, data, message }
  return response.data || []
}
