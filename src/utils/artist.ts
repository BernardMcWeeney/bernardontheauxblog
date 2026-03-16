/**
 * Extract artist name from a Payload relationship field.
 * When depth >= 1, the artist is an object { name, slug, ... }.
 * When depth = 0, it's just a number (ID).
 */
export function getArtistName(artist: unknown): string {
  if (!artist) return ''
  if (typeof artist === 'object' && artist !== null && 'name' in artist) {
    return (artist as { name: string }).name
  }
  return ''
}

/**
 * Build a display title: "Artist — Title" or just "Title" if no artist.
 * Prefers headline if provided.
 */
export function getDisplayTitle(item: { headline?: string | null; title: string; artist?: unknown }): string {
  if (item.headline) return item.headline
  const artistName = getArtistName(item.artist)
  return artistName ? `${artistName} — ${item.title}` : item.title
}

/**
 * Extract label name from a Payload relationship field.
 */
export function getLabelName(label: unknown): string {
  if (!label) return ''
  if (typeof label === 'object' && label !== null && 'name' in label) {
    return (label as { name: string }).name
  }
  return ''
}
