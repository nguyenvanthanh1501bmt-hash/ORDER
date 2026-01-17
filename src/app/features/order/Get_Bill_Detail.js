export async function getBillDetail(billId) {
  if (!billId) return null

  const res = await fetch("/api/bill/get-bill-detail", {
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

  return res.json()
}
