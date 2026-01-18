'use client'

export function generateTableQRCode(table) {
  if (!table?.id) throw new Error('Bàn không hợp lệ')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  return `${baseUrl}/?table=${table.id}`
}
