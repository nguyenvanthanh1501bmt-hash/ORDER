export async function getBillDetail(billId) {
  if (!billId) return null

  const res = await fetch("/api/bill", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ billId }),
  })

  if (!res.ok) {
    console.error("Failed to fetch bill detail")
    return null
  }

  const response = await res.json()
  // Handle new response format: { success, data, message }
  return response.data || response
}
