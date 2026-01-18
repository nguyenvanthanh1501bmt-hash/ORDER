export function formatDate(timestamp) {
  if (!timestamp) return "-"
  const date = new Date(timestamp)
  return `${date.getDate().toString().padStart(2,'0')}/${
          (date.getMonth()+1).toString().padStart(2,'0')}/${
          date.getFullYear()} ${
          date.getHours().toString().padStart(2,'0')}:${
          date.getMinutes().toString().padStart(2,'0')}:${
          date.getSeconds().toString().padStart(2,'0')}`
}

export function getSizeExtraPrice(option, sizeText) {
  if (!Array.isArray(option) || !sizeText) return 0

  const index = option.findIndex(opt => opt === sizeText)
  if (index === -1) return 0

  return index * 5000
}

export function getTableQRCode(search) {
  if (!search) return null
  const params = new URLSearchParams(search)
  return params.get('table')
}
