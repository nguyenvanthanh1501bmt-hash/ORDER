export async function addOrder({ tableId, menuItems }) {
  const payload = {
    table_id: tableId,
    items: menuItems.map(item => ({
      menu_item_id: item.productId,
      quantity: item.quantity,
      note: item.note || null,
      selected_options: item.selectedSize
        ? { size: item.selectedSize }
        : {},
      option: item.options || null,
    }))
  }

  const res = await fetch('/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload), 
  })

  if (!res.ok) {
    throw new Error('Failed to add order')
  }

  return res.json()
}
