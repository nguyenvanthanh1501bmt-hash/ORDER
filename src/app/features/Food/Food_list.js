import { authFetch } from "@/utils/authFetch"

export async function getFoodList() {
    try {
        const res = await authFetch("/api/menu_items", {
            method: "GET",
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
            data: [],
        }))

        if (!res.ok) {
            throw new Error(response.message || "Failed to fetch food list")
        }

        return response.data || []
    } catch (error) {
        console.error("Error fetching food list:", error)
        return []
    }
}