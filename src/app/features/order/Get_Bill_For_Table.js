import { authFetch } from "@/utils/authFetch"

export async function getOpenBills() {
    try {
        const res = await authFetch("/api/bill", {
            method: "GET",
            cache: "no-store",
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
            data: [],
        }))

        console.log("GET /api/bill response:", response)

        if (!res.ok) {
            console.error(response.message || "Failed to fetch open bills")
            return []
        }

        // API có thể trả trực tiếp array: [...]
        if (Array.isArray(response)) {
            return response
        }

        // Hoặc trả format mới: { success, data, message }
        return response.data || []
    } catch (error) {
        console.error("Error fetching open bills:", error)
        return []
    }
}