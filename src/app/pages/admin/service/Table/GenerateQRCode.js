// GenerateQRCode.js
'use client'

/**
 * Tạo giá trị mã QR từ thông tin bàn
 * @param {Object} table - Thông tin bàn { id, name }
 * @param {string} baseUrl - URL gốc để ghép QR (ví dụ trang đặt món)
 * @returns {string} Giá trị QR code (string)
 */
export function generateTableQRCode(table, baseUrl = "https://example.com/order") {
  if (!table || !table.id) {
    throw new Error("Bàn không hợp lệ")
  }

  // Ví dụ: tạo URL chứa ID và tên bàn
  const encodedName = encodeURIComponent(table.name || "")
  return `${baseUrl}?tableId=${table.id}&tableName=${encodedName}`
}
