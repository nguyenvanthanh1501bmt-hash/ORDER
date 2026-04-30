import { authFetch } from "@/utils/authFetch"

export async function getTableList() {
    try {
        const res = await authFetch("/api/table", {
            method: "GET",
            cache: "no-store",
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
            data: [],
        }))

        if (!res.ok) {
            throw new Error(response.message || "Failed to fetch table list")
        }

        return response.data || []
    } catch (error) {
        console.error("Error fetching table list:", error)
        return []
    }
}