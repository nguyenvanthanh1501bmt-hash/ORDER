// Format a timestamp into "DD/MM/YYYY HH:mm:ss"
export function formatDate(timestamp) {
  // Return placeholder if timestamp is missing
  if (!timestamp) return "-"

  // Create Date object from timestamp
  const date = new Date(timestamp)

  // Format date and time with leading zeros
  return `${date.getDate().toString().padStart(2,'0')}/${
          (date.getMonth()+1).toString().padStart(2,'0')}/${
          date.getFullYear()} ${
          date.getHours().toString().padStart(2,'0')}:${
          date.getMinutes().toString().padStart(2,'0')}:${
          date.getSeconds().toString().padStart(2,'0')}`
}

// Calculate extra price based on selected size option
export function getSizeExtraPrice(option, sizeText) {
  // Validate inputs
  if (!Array.isArray(option) || !sizeText) return 0

  // Find index of selected size in option list
  const index = option.findIndex(opt => opt === sizeText)

  // If size is not found, no extra charge
  if (index === -1) return 0

  // Extra price increases by 5000 per size level
  return index * 5000
}

// Extract table QR code value from URL query string
export function getTableQRCode(search) {
  // Return null if query string is missing
  if (!search) return null

  // Parse URL search parameters
  const params = new URLSearchParams(search)

  // Return value of "table" parameter
  return params.get('table')
}
