export async function addOrder({ tableId, qrToken, menuItems }) {
  const payload = {
    table_id: tableId,
    qr_token: qrToken,
    items: menuItems.map(item => ({
      menu_item_id: item.productId,
      quantity: item.quantity,
      note: item.note || null,
      selected_options: item.selectedSize
        ? { size: item.selectedSize }
        : {},
      option: item.options || null,
    })),
  }

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    cache: 'no-store',
    body: JSON.stringify(payload),
  })

  const response = await res.json().catch(() => null)

  if (!res.ok) {
    throw new Error(response?.message || 'Failed to add order')
  }

  return response.data || response
}