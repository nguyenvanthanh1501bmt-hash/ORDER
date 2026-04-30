import { authFetch } from "@/utils/authFetch"

export async function getEmployeeList() {
    try {
        const res = await authFetch("/api/admin", {
            method: "GET",
        })

        const response = await res.json().catch(() => ({
            message: "Invalid server response",
            data: [],
        }))

        if (!res.ok) {
            throw new Error(response.message || "Failed to fetch employee list")
        }

        return response.data || []
    } catch (error) {
        console.error("Error fetching employee list:", error)
        return []
    }
}