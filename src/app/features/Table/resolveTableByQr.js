export async function resolveTableByQr(qr) {
  try {
    const res = await fetch(
      `/api/table/resolve-qr?qr=${encodeURIComponent(qr)}`,
      { cache: 'no-store' }
    )

    if (!res.ok) return null

    const data = await res.json()
    return data.table_id
  } catch {
    return null
  }
}
