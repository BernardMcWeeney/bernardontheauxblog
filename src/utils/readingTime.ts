const WORDS_PER_MINUTE = 200

export function calculateReadingTime(content?: string): number {
  if (!content) return 1
  const text = content.replace(/<[^>]*>/g, '')
  const words = text.trim().split(/\s+/).filter(Boolean).length
  const minutes = Math.ceil(words / WORDS_PER_MINUTE)
  return Math.max(1, minutes)
}

export function formatReadingTime(minutes: number): string {
  return `${minutes} min read`
}
