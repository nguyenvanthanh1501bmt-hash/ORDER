'use client'

export function generateTableQRCode(table) {
  if (!table?.id) throw new Error('Invalid table')

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL
  return `${baseUrl}/?table=${table.id}`
}
