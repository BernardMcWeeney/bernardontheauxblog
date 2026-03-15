export const formatDate = (value: Date | string) => {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.valueOf())) return ''
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })
}

export const formatRating = (value?: number) => {
  if (value === undefined || value === null) return ''
  return Number.isInteger(value) ? value.toString() : value.toFixed(1)
}
