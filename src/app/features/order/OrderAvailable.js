import { authFetch } from "@/utils/authFetch"

export async function getOrdersAvailable() {
    try {
        const res = await authFetch("/api/orders", {
            method: "GET",
            cache: "no-store",
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
            data: [],
        }))

        if (!res.ok) {
            throw new Error(response.message || "Failed to load orders")
        }

        return response.data || []
    } catch (err) {
        console.error("Error fetching orders:", err)
        return []
    }
}