/**
 * Extracts plain text from Lexical rich text content and returns
 * a truncated excerpt (~160 chars, cut at word boundary).
 */
export function generateExcerpt(content: unknown): string | undefined {
  if (!content || typeof content !== 'object') return undefined
  try {
    const plainText = JSON.stringify(content)
      .replace(/"type":"[^"]*"/g, '')
      .replace(/[{}[\]",:]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
    if (plainText.length === 0) return undefined
    if (plainText.length <= 160) return plainText
    const truncated = plainText.substring(0, 160)
    const lastSpace = truncated.lastIndexOf(' ')
    if (lastSpace > 120) {
      return truncated.substring(0, lastSpace) + '...'
    }
    return truncated + '...'
  } catch {
    return undefined
  }
}
