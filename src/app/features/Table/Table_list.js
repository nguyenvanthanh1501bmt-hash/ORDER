export async function getTableList() {
  try {
    const res = await fetch("/api/table", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch table list");
    }

    const response = await res.json();
    // Handle new response format: { success, data, message }
    return response.data || [];

  } catch (error) {
    console.error("Error fetching table list:", error);
    return [];
  }
}
