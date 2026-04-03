/**
 * Cloudflare Image Resizing helper.
 *
 * Rewrites an image URL to go through `/cdn-cgi/image/…` so Cloudflare
 * converts to WebP/AVIF, resizes, and edge-caches the result.
 *
 * Docs: https://developers.cloudflare.com/images/transform-images/transform-via-url/
 */
export function cfImageUrl(
  src: string,
  opts: { width?: number; height?: number; quality?: number; fit?: string } = {},
): string {
  // Cloudflare Image Resizing is only available on the edge, not localhost
  if (typeof window !== 'undefined' && window.location.hostname === 'localhost') return src
  if (process.env.NODE_ENV === 'development') return src

  const { width, height, quality = 80, fit = 'cover' } = opts

  const params: string[] = ['format=auto', `quality=${quality}`, `fit=${fit}`]
  if (width) params.push(`width=${width}`)
  if (height) params.push(`height=${height}`)

  // For relative paths like /api/media/file/foo.png
  // produce /cdn-cgi/image/format=auto,quality=80,…/api/media/file/foo.png
  if (src.startsWith('/')) {
    return `/cdn-cgi/image/${params.join(',')}${src}`
  }

  // For absolute URLs on the same origin, strip the origin
  try {
    const url = new URL(src)
    if (url.hostname === 'bernardontheaux.com' || url.hostname === 'www.bernardontheaux.com') {
      return `/cdn-cgi/image/${params.join(',')}${url.pathname}`
    }
  } catch {
    // not a valid URL, return as-is
  }

  return src
}
