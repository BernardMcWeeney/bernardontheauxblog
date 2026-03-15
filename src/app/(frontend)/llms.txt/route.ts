export async function GET() {
  const body = `# Bernard On The Aux
> A personal, passion-driven music review and listening log.

## Content Types
- Album Reviews: /reviews/
- Gig Diaries: /gigs/
- Deep Dives: /deep-dives/
- Playlists: /playlists/
- Listening Notes: /notes/

## About
Bernard On The Aux prioritises listening, context, and memory over speed, hype, or blanket coverage.
`

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  })
}
