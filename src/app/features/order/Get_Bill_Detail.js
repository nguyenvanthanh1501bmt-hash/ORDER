import { authFetch } from "@/utils/authFetch"

export async function getBillDetail(billId) {
    if (!billId) return null

    try {
        const res = await authFetch("/api/bill", {
            method: "POST",
            body: JSON.stringify({ billId }),
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
        }))

        if (!res.ok) {
            console.error(response.message || "Failed to fetch bill detail")
            return null
        }

        return response.data || response
    } catch (error) {
        console.error("Error fetching bill detail:", error)
        return null
    }
}