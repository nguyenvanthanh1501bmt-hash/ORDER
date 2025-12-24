export async function getTableList() {
  try {
    const res = await fetch("/api/table/get-table", {
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Failed to fetch table list");
    }

    const data = await res.json();
    return data;

  } catch (error) {
    console.error("Error fetching table list:", error);
    return [];
  }
}
