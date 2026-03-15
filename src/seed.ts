import 'dotenv/config'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import fs from 'fs'
import path from 'path'

// ── Astro content directories ──────────────────────────────────────────────
const ASTRO_CONTENT = '/Users/bernardmcweeney/bernardontheaux/bernardontheaux/src/content'

const CONTENT_DIRS = {
  reviews: path.join(ASTRO_CONTENT, 'reviews'),
  gigs: path.join(ASTRO_CONTENT, 'gigs'),
  'deep-dives': path.join(ASTRO_CONTENT, 'deep-dives'),
  playlists: path.join(ASTRO_CONTENT, 'playlists'),
  notes: path.join(ASTRO_CONTENT, 'notes'),
} as const

// ── Frontmatter field mapping (snake_case -> camelCase) ────────────────────
const FIELD_MAP: Record<string, string> = {
  review_date: 'reviewDate',
  review_type: 'reviewType',
  listened_on: 'listenedOn',
  release_year: 'releaseYear',
  standout_tracks: 'standoutTracks',
  event_date: 'eventDate',
  published_on: 'publishedOn',
  playlist_url: 'playlistUrl',
  embed_url: 'embedUrl',
}

// ── Simple YAML frontmatter parser ─────────────────────────────────────────

function parseFrontmatter(raw: string): { data: Record<string, unknown>; body: string } {
  const parts = raw.split('---')
  // parts[0] is empty (before first ---), parts[1] is frontmatter, parts[2..] is body
  if (parts.length < 3) {
    return { data: {}, body: raw }
  }

  const frontmatterStr = parts[1]
  // Body is everything after the second ---, joined back with --- in case body contains ---
  const body = parts.slice(2).join('---').trim()

  const data: Record<string, unknown> = {}
  const lines = frontmatterStr.split('\n')

  let currentKey: string | null = null
  let currentArray: string[] | null = null

  for (const line of lines) {
    // Skip empty lines
    if (line.trim() === '') continue

    // Check if this is an array item (starts with spaces then -)
    if (/^\s+-\s+/.test(line) && currentKey) {
      const value = line.replace(/^\s+-\s+/, '').trim()
      if (!currentArray) {
        currentArray = []
      }
      currentArray.push(parseValue(value) as string)
      data[currentKey] = currentArray
      continue
    }

    // If we were building an array and hit a non-array line, reset
    if (currentArray) {
      currentArray = null
    }

    // Parse key: value pair
    const colonIdx = line.indexOf(':')
    if (colonIdx === -1) continue

    const key = line.slice(0, colonIdx).trim()
    const rawValue = line.slice(colonIdx + 1).trim()

    if (key === '') continue

    // Map snake_case to camelCase
    const mappedKey = FIELD_MAP[key] || key

    // If value is empty, the next lines might be array items
    if (rawValue === '') {
      currentKey = mappedKey
      currentArray = null
      continue
    }

    currentKey = mappedKey
    data[mappedKey] = parseValue(rawValue)
  }

  return { data, body }
}

function parseValue(raw: string): unknown {
  // Remove surrounding quotes
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1)
  }

  // Boolean
  if (raw === 'true') return true
  if (raw === 'false') return false

  // Date (YYYY-MM-DD)
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    return new Date(raw + 'T00:00:00.000Z').toISOString()
  }

  // Number
  if (/^-?\d+(\.\d+)?$/.test(raw)) {
    return Number(raw)
  }

  return raw
}

// ── Markdown to Lexical converter ──────────────────────────────────────────

interface LexicalNode {
  type: string
  [key: string]: unknown
}

interface LexicalTextNode {
  type: 'text'
  text: string
  format: number
  detail: number
  mode: string
  style: string
  version: 1
}

interface LexicalLinkNode {
  type: 'link'
  children: LexicalTextNode[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 3
  fields: {
    linkType: 'custom'
    newTab: boolean
    url: string
  }
}

interface LexicalBlockNode {
  type: string
  children: (LexicalTextNode | LexicalLinkNode)[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
  tag?: string
}

interface LexicalListItemNode {
  type: 'listitem'
  children: (LexicalTextNode | LexicalLinkNode)[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
  value: number
}

interface LexicalListNode {
  type: 'list'
  children: LexicalListItemNode[]
  direction: 'ltr'
  format: ''
  indent: 0
  version: 1
  tag: 'ul'
  listType: 'bullet'
  start: 1
}

interface LexicalHRNode {
  type: 'horizontalrule'
  version: 1
}

type LexicalChildNode =
  | LexicalBlockNode
  | LexicalListNode
  | LexicalHRNode

function parseInlineMarkdown(text: string): (LexicalTextNode | LexicalLinkNode)[] {
  const nodes: (LexicalTextNode | LexicalLinkNode)[] = []

  // Regex to match bold, italic, bold+italic, and links
  // Process the text character by character using regex matches
  const pattern = /(\*\*\*(.+?)\*\*\*|\*\*(.+?)\*\*|\*(.+?)\*|\[([^\]]+)\]\(([^)]+)\))/g

  let lastIndex = 0
  let match: RegExpExecArray | null

  while ((match = pattern.exec(text)) !== null) {
    // Add any plain text before this match
    if (match.index > lastIndex) {
      const plainText = text.slice(lastIndex, match.index)
      if (plainText) {
        nodes.push(makeTextNode(plainText, 0))
      }
    }

    if (match[2]) {
      // Bold + italic (***text***)
      nodes.push(makeTextNode(match[2], 3))
    } else if (match[3]) {
      // Bold (**text**)
      nodes.push(makeTextNode(match[3], 1))
    } else if (match[4]) {
      // Italic (*text*)
      nodes.push(makeTextNode(match[4], 2))
    } else if (match[5] && match[6]) {
      // Link [text](url)
      nodes.push({
        type: 'link',
        children: [makeTextNode(match[5], 0)],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 3,
        fields: {
          linkType: 'custom',
          newTab: false,
          url: match[6],
        },
      })
    }

    lastIndex = match.index + match[0].length
  }

  // Add any remaining plain text
  if (lastIndex < text.length) {
    const remaining = text.slice(lastIndex)
    if (remaining) {
      nodes.push(makeTextNode(remaining, 0))
    }
  }

  // If no nodes were created, add a single empty text node
  if (nodes.length === 0) {
    nodes.push(makeTextNode(text || '', 0))
  }

  return nodes
}

function makeTextNode(text: string, format: number): LexicalTextNode {
  return {
    type: 'text',
    text,
    format,
    detail: 0,
    mode: 'normal',
    style: '',
    version: 1,
  }
}

function makeParagraphNode(children: (LexicalTextNode | LexicalLinkNode)[]): LexicalBlockNode {
  return {
    type: 'paragraph',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function makeHeadingNode(
  tag: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6',
  children: (LexicalTextNode | LexicalLinkNode)[],
): LexicalBlockNode {
  return {
    type: 'heading',
    tag,
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function makeQuoteNode(children: (LexicalTextNode | LexicalLinkNode)[]): LexicalBlockNode {
  return {
    type: 'quote',
    children,
    direction: 'ltr',
    format: '',
    indent: 0,
    version: 1,
  }
}

function markdownToLexical(markdown: string): Record<string, unknown> {
  const children: LexicalChildNode[] = []

  if (!markdown || markdown.trim() === '') {
    // Return an empty root with one empty paragraph
    return {
      root: {
        type: 'root',
        children: [makeParagraphNode([makeTextNode('', 0)])],
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
      },
    }
  }

  const lines = markdown.split('\n')
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Horizontal rule
    if (/^---+\s*$/.test(line) && line.trim().length >= 3) {
      children.push({ type: 'horizontalrule', version: 1 })
      i++
      continue
    }

    // Headings
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      const level = headingMatch[1].length
      const tag = `h${level}` as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
      const inlineNodes = parseInlineMarkdown(headingMatch[2].trim())
      children.push(makeHeadingNode(tag, inlineNodes))
      i++
      continue
    }

    // Blockquote
    if (line.startsWith('> ')) {
      const quoteText = line.slice(2)
      const inlineNodes = parseInlineMarkdown(quoteText)
      children.push(makeQuoteNode(inlineNodes))
      i++
      continue
    }

    // Unordered list (collect consecutive list items)
    if (/^[-*]\s+/.test(line)) {
      const listItems: LexicalListItemNode[] = []
      let itemNum = 1
      while (i < lines.length && /^[-*]\s+/.test(lines[i])) {
        const itemText = lines[i].replace(/^[-*]\s+/, '')
        const inlineNodes = parseInlineMarkdown(itemText)
        listItems.push({
          type: 'listitem',
          children: inlineNodes,
          direction: 'ltr',
          format: '',
          indent: 0,
          version: 1,
          value: itemNum++,
        })
        i++
      }
      children.push({
        type: 'list',
        children: listItems,
        direction: 'ltr',
        format: '',
        indent: 0,
        version: 1,
        tag: 'ul',
        listType: 'bullet',
        start: 1,
      })
      continue
    }

    // Empty line - skip
    if (line.trim() === '') {
      i++
      continue
    }

    // Paragraph - collect consecutive non-empty lines that are not special
    const paragraphLines: string[] = []
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('> ') &&
      !/^[-*]\s+/.test(lines[i]) &&
      !/^---+\s*$/.test(lines[i])
    ) {
      paragraphLines.push(lines[i])
      i++
    }

    if (paragraphLines.length > 0) {
      const fullText = paragraphLines.join(' ')
      const inlineNodes = parseInlineMarkdown(fullText)
      children.push(makeParagraphNode(inlineNodes))
    }
  }

  // If no children, add an empty paragraph
  if (children.length === 0) {
    children.push(makeParagraphNode([makeTextNode('', 0)]))
  }

  return {
    root: {
      type: 'root',
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      version: 1,
    },
  }
}

// ── Read markdown files from a directory ───────────────────────────────────

function readMarkdownFiles(dirPath: string): { slug: string; raw: string }[] {
  if (!fs.existsSync(dirPath)) {
    console.log(`  Directory not found: ${dirPath}`)
    return []
  }

  const files = fs.readdirSync(dirPath).filter((f) => f.endsWith('.md'))
  return files.map((file) => ({
    slug: file.replace(/\.md$/, ''),
    raw: fs.readFileSync(path.join(dirPath, file), 'utf-8'),
  }))
}

// ── Seed functions per collection ──────────────────────────────────────────

async function seedReviews(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Reviews ===')
  const files = readMarkdownFiles(CONTENT_DIRS.reviews)
  console.log(`  Found ${files.length} file(s)`)

  for (const file of files) {
    try {
      const { data, body } = parseFrontmatter(file.raw)
      const content = markdownToLexical(body)

      await payload.create({
        collection: 'reviews',
        data: {
          title: data.title,
          slug: file.slug,
          reviewType: data.reviewType || undefined,
          artist: data.artist || undefined,
          reviewDate: data.reviewDate,
          listenedOn: data.listenedOn || undefined,
          rating: data.rating,
          format: data.format || undefined,
          label: data.label || undefined,
          releaseYear: data.releaseYear || undefined,
          standoutTracks: data.standoutTracks || undefined,
          venue: data.venue || undefined,
          city: data.city || undefined,
          eventDate: data.eventDate || undefined,
          tags: data.tags || [],
          excerpt: data.excerpt || undefined,
          content,
          published: data.published,
          featured: data.featured || false,
        } as any,
      })

      console.log(`  Created review: ${data.title}`)
    } catch (err) {
      console.error(`  Failed to create review from ${file.slug}:`, err)
    }
  }
}

async function seedGigs(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Gigs ===')
  const files = readMarkdownFiles(CONTENT_DIRS.gigs)
  console.log(`  Found ${files.length} file(s)`)

  for (const file of files) {
    try {
      const { data, body } = parseFrontmatter(file.raw)
      const content = markdownToLexical(body)

      await payload.create({
        collection: 'gigs',
        data: {
          title: data.title as string,
          slug: file.slug,
          artist: data.artist as string,
          venue: data.venue as string,
          city: data.city as string,
          eventDate: data.eventDate as string,
          tour: (data.tour as string) || undefined,
          support: (data.support as string) || undefined,
          highlights: (data.highlights as string) || undefined,
          tags: (data.tags as string[]) || [],
          excerpt: (data.excerpt as string) || undefined,
          content,
          published: data.published as boolean,
          featured: (data.featured as boolean) || false,
        } as any,
      })

      console.log(`  Created gig: ${data.title}`)
    } catch (err) {
      console.error(`  Failed to create gig from ${file.slug}:`, err)
    }
  }
}

async function seedDeepDives(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Deep Dives ===')
  const files = readMarkdownFiles(CONTENT_DIRS['deep-dives'])
  console.log(`  Found ${files.length} file(s)`)

  for (const file of files) {
    try {
      const { data, body } = parseFrontmatter(file.raw)
      const content = markdownToLexical(body)

      await payload.create({
        collection: 'deep-dives',
        data: {
          title: data.title as string,
          slug: file.slug,
          publishedOn: data.publishedOn as string,
          topic: (data.topic as string) || undefined,
          era: (data.era as string) || undefined,
          tags: (data.tags as string[]) || [],
          excerpt: (data.excerpt as string) || undefined,
          content,
          published: data.published as boolean,
          featured: (data.featured as boolean) || false,
        } as any,
      })

      console.log(`  Created deep dive: ${data.title}`)
    } catch (err) {
      console.error(`  Failed to create deep dive from ${file.slug}:`, err)
    }
  }
}

async function seedPlaylists(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Playlists ===')
  const files = readMarkdownFiles(CONTENT_DIRS.playlists)
  console.log(`  Found ${files.length} file(s)`)

  for (const file of files) {
    try {
      const { data, body } = parseFrontmatter(file.raw)
      const content = markdownToLexical(body)

      await payload.create({
        collection: 'playlists',
        data: {
          title: data.title as string,
          slug: file.slug,
          publishedOn: data.publishedOn as string,
          platform: data.platform as string,
          playlistUrl: data.playlistUrl as string,
          embedUrl: (data.embedUrl as string) || undefined,
          mood: (data.mood as string) || undefined,
          duration: (data.duration as number) || undefined,
          tags: (data.tags as string[]) || [],
          excerpt: (data.excerpt as string) || undefined,
          content,
          published: data.published as boolean,
          featured: (data.featured as boolean) || false,
        } as any,
      })

      console.log(`  Created playlist: ${data.title}`)
    } catch (err) {
      console.error(`  Failed to create playlist from ${file.slug}:`, err)
    }
  }
}

async function seedNotes(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Notes ===')
  const files = readMarkdownFiles(CONTENT_DIRS.notes)
  console.log(`  Found ${files.length} file(s)`)

  for (const file of files) {
    try {
      const { data, body } = parseFrontmatter(file.raw)
      const content = markdownToLexical(body)

      await payload.create({
        collection: 'notes',
        data: {
          title: data.title as string,
          slug: file.slug,
          listenedOn: data.listenedOn as string,
          artist: (data.artist as string) || undefined,
          source: (data.source as string) || undefined,
          tags: (data.tags as string[]) || [],
          excerpt: (data.excerpt as string) || undefined,
          content,
          published: data.published as boolean,
          featured: (data.featured as boolean) || false,
        } as any,
      })

      console.log(`  Created note: ${data.title}`)
    } catch (err) {
      console.error(`  Failed to create note from ${file.slug}:`, err)
    }
  }
}

// ── Extra reviews (the Astro project only has an unpublished test review) ──

function makeLexical(paragraphs: string[]) {
  return {
    root: {
      type: 'root',
      children: paragraphs.map((p) => ({
        type: 'paragraph',
        children: [{ type: 'text', text: p, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }],
        direction: 'ltr' as const,
        format: '' as const,
        indent: 0,
        version: 1,
      })),
      direction: 'ltr' as const,
      format: '' as const,
      indent: 0,
      version: 1,
    },
  }
}

async function seedExtraReviews(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Extra Reviews ===')

  const reviews = [
    {
      title: 'The Car',
      slug: 'arctic-monkeys-the-car',
      artist: 'Arctic Monkeys',
      reviewDate: '2025-12-01T00:00:00.000Z',
      rating: 8,
      reviewType: 'album',
      format: 'Vinyl',
      label: 'Domino',
      releaseYear: 2022,
      standoutTracks: 'There\'d Better Be A Mirrorball, Body Paint, I Ain\'t Quite Where I Think I Am',
      tags: ['Indie', 'Art-Rock', 'Lounge'],
      excerpt: 'Arctic Monkeys trade guitars for orchestral grandeur. The Car is a slow-burn record that rewards patience and full-album listening.',
      published: true,
      featured: true,
      pinned: true,
      content: makeLexical([
        'The Car is not the record anyone expected after Tranquility Base Hotel & Casino, and yet it feels like its logical successor. Where TBHC leaned into lounge-pop pastiche, The Car pushes further into orchestral territory — strings sweep across almost every track, and Turner\'s vocal delivery has never been more restrained.',
        'There\'d Better Be A Mirrorball opens the album with a cinematic slow burn that sets the tone: this is a record for late nights, dim lighting, and undivided attention. The production is immaculate — every instrument sits in its own space, and the mix rewards headphones.',
        'Body Paint is the standout — a six-minute sprawl that builds from a quiet verse into one of the most anthemic choruses the band has ever written. The guitar work is minimal but precise, and the string arrangement lifts the whole thing into something genuinely moving.',
        'I Ain\'t Quite Where I Think I Am brings a touch of funk to the proceedings, with a bassline that grooves underneath Turner\'s deadpan delivery. It\'s the closest thing to a single on the record, and it works beautifully.',
        'The back half of the album is where some listeners might lose patience. Tracks like Jet Skis on the Moat and Mr Schwartz demand repeated listens before they reveal their hooks. But that\'s the point — this is a record that asks you to slow down.',
        'The Car is not perfect. It occasionally drifts into self-indulgence, and a couple of tracks blur together on first listen. But as a statement of artistic intent, it\'s bold and uncompromising. This is a band that has nothing left to prove and everything to explore.',
      ]),
    },
    {
      title: 'Did You Know That There\'s a Tunnel Under Ocean Blvd',
      slug: 'lana-del-rey-ocean-blvd',
      artist: 'Lana Del Rey',
      reviewDate: '2025-11-15T00:00:00.000Z',
      rating: 9,
      reviewType: 'album',
      format: 'Digital',
      releaseYear: 2023,
      standoutTracks: 'A&W, The Grants, Kintsugi, Margaret',
      tags: ['Dream-Pop', 'Baroque-Pop', 'Alt'],
      excerpt: 'Lana Del Rey\'s most sprawling and personal album yet. Seventy-seven minutes of family, faith, and the weight of legacy.',
      published: true,
      featured: true,
      content: makeLexical([
        'At 77 minutes and 16 tracks, Ocean Blvd is Lana Del Rey at her most expansive and unguarded. This is not a record built for playlists — it demands the full run, preferably in a single sitting, preferably late at night.',
        'The title track opens with a simple question that frames the whole album: what happens to beauty when no one is watching? From there, Del Rey moves through meditations on family (The Grants is devastating), self-worth (A&W is a career highlight), and artistic legacy.',
        'A&W is the centrepiece. The first half is a slow, spoken-word confession over sparse piano, and just when you think the song has said everything it needs to say, it drops into a trap beat that transforms the whole thing. It shouldn\'t work, but it does — brilliantly.',
        'The Grants, featuring a gospel choir, is the emotional peak. Del Rey sings about her grandparents and the passage of time with a directness that cuts through all the usual Lana mythology. The choir lifts the final chorus into something transcendent.',
        'There are moments where the album\'s length works against it — the Jon Batiste interludes feel like they belong on a different record, and a couple of the middle tracks could have been trimmed. But the highs here are among the highest of her career.',
        'Kintsugi and Margaret show a songwriter at the peak of her powers, finding beauty in broken things and meaning in the mundane. This is the record Del Rey has been building toward for a decade.',
      ]),
    },
    {
      title: 'Javelin',
      slug: 'sufjan-stevens-javelin',
      artist: 'Sufjan Stevens',
      reviewDate: '2025-10-20T00:00:00.000Z',
      rating: 8.5,
      reviewType: 'album',
      format: 'Vinyl',
      label: 'Asthmatic Kitty',
      releaseYear: 2023,
      standoutTracks: 'Will Anybody Ever Love Me?, So You Are Tired, Goodbye Evergreen',
      tags: ['Folk', 'Indie', 'Orchestral'],
      excerpt: 'A record about love and loss that feels like holding something fragile. Stevens at his most tender and devastating.',
      published: true,
      content: makeLexical([
        'Javelin arrives as Sufjan Stevens\' first proper album since 2020\'s The Ascension, and the contrast could not be starker. Where that record leaned into synthetic maximalism, Javelin strips everything back to what Stevens does best: acoustic guitars, layered vocals, and lyrics that make you feel like you\'re reading someone\'s private journal.',
        'Will Anybody Ever Love Me? is the first track, and it sets the stakes immediately. The question in the title is not rhetorical — Stevens delivers it with a vulnerability that borders on uncomfortable. The instrumentation is spare: fingerpicked guitar, soft strings, and a vocal that cracks at exactly the right moments.',
        'The album is dedicated to Stevens\' late partner, and that context colours every note. But even without knowing the backstory, the emotional weight is unmistakable. These songs sound like someone trying to hold onto something that has already slipped away.',
        'So You Are Tired is the quiet devastation at the album\'s core — a lullaby for someone who is no longer there. The melody is so simple it feels like it has always existed, and Stevens\' multi-tracked harmonies create a choir of one.',
        'Goodbye Evergreen closes the album with a ten-minute meditation that moves through grief, acceptance, and something close to peace. The final minutes, where the arrangement swells and then falls away to silence, are among the most moving passages in Stevens\' catalogue.',
      ]),
    },
    {
      title: 'Desire, I Want to Turn Into You',
      slug: 'caroline-polachek-desire',
      artist: 'Caroline Polachek',
      reviewDate: '2025-09-10T00:00:00.000Z',
      rating: 9,
      reviewType: 'album',
      format: 'Stream',
      releaseYear: 2023,
      standoutTracks: 'Welcome to My Island, Bunny Is a Rider, Sunset',
      tags: ['Art-Pop', 'Experimental', 'Electronic'],
      excerpt: 'Caroline Polachek builds a world where pop music has no rules. Every track takes a sharp left turn and somehow lands exactly where it should.',
      published: true,
      content: makeLexical([
        'Desire, I Want to Turn Into You is the kind of album that makes you rethink what pop music can do. Caroline Polachek has always been an artist who operates at the intersection of accessibility and experimentation, but here she pushes further in both directions simultaneously.',
        'Welcome to My Island opens the record with a statement of intent: Polachek\'s voice is the instrument, bending and stretching across a production that shifts from minimal to maximal within a single bar. The effect is disorienting and thrilling in equal measure.',
        'Bunny Is a Rider is the most immediate track — a propulsive, club-ready banger with a bassline that lodges in your skull. But even here, there are details that reveal themselves on repeated listens: the way the vocal processing shifts mid-phrase, the unexpected chord change in the bridge.',
        'Sunset is the emotional anchor. Built around a sample of the Cocteau Twins\' Lorelei, it\'s a gorgeous, shimmering piece of dream-pop that would sound at home on a 4AD compilation from 1988. Polachek\'s vocal performance is extraordinary — controlled and wild at the same time.',
        'The album\'s back half takes bigger risks. Fly to You features Grimes and Dido (yes, Dido) over a flamenco-influenced production that shouldn\'t work but absolutely does. Billions is a tender ballad that strips away all the sonic adventurousness and leaves just a voice and a piano.',
        'This is a record with zero filler. Every track justifies its place, and the sequencing is flawless. Polachek has made an album that sounds like nothing else released this decade.',
      ]),
    },
    {
      title: 'Hellfire',
      slug: 'black-midi-hellfire',
      artist: 'black midi',
      reviewDate: '2025-08-05T00:00:00.000Z',
      rating: 7.5,
      reviewType: 'album',
      format: 'CD',
      label: 'Rough Trade',
      releaseYear: 2022,
      standoutTracks: 'Sugar/Tzu, Welcome to Hell, Eat Men Eat',
      tags: ['Prog', 'Experimental', 'Post-Punk'],
      excerpt: 'black midi channel prog, cabaret, and controlled chaos into their most ambitious and divisive record yet.',
      published: true,
      content: makeLexical([
        'Hellfire is the kind of album that dares you to keep up. black midi have never been an easy listen, but their third album pushes into genuinely theatrical territory — there are character voices, narrative arcs, and production choices that veer from whisper-quiet to ear-splitting within seconds.',
        'Sugar/Tzu is the highlight: a seven-minute journey through time signatures and moods that somehow coheres into something you can almost hum. The drumming is virtuosic without being showy, and the bass work provides an anchor for all the chaos above it.',
        'Welcome to Hell opens the record with a cabaret swagger that immediately signals this is not going to be a conventional rock album. Geordie Greep\'s vocal performance is part crooner, part carnival barker, and entirely committed.',
        'The middle section of the album is where some listeners will check out. Tracks like The Race Is About to Begin and Dangerous Liaisons demand multiple listens to parse, and even then, they resist easy appreciation. This is music that rewards effort but does not meet you halfway.',
        'Eat Men Eat closes the record with a ten-minute epic that cycles through every genre the band has touched over three albums. It\'s exhausting and exhilarating, and the final silence when it ends feels earned.',
        'Hellfire is not their best album — Cavalcade had a tighter focus — but it might be their most ambitious. Whether that ambition serves the songs or overwhelms them depends on your tolerance for excess.',
      ]),
    },
  ]

  for (const review of reviews) {
    try {
      await payload.create({
        collection: 'reviews',
        data: review as any,
      })
      console.log(`  Created review: ${review.artist} — ${review.title}`)
    } catch (err) {
      console.error(`  Failed to create review ${review.title}:`, err)
    }
  }
}

// Extra deep dives, playlists, and notes to supplement the Astro content

async function seedExtraContent(payload: Awaited<ReturnType<typeof getPayload>>) {
  console.log('\n=== Seeding Extra Content ===')

  // Extra deep dive
  try {
    await payload.create({
      collection: 'deep-dives',
      data: {
        title: 'The Dublin Guitar Tone: From Fontaines D.C. to Inhaler',
        slug: 'dublin-guitar-tone',
        publishedOn: '2025-11-01T00:00:00.000Z',
        topic: 'Irish guitar music',
        era: '2018-present',
        tags: ['Guitar', 'Dublin', 'Post-Punk', 'Indie'],
        excerpt: 'How a generation of Dublin bands redefined the sound of Irish guitar music — from post-punk snarl to arena-ready anthems.',
        published: true,
        content: makeLexical([
          'Something happened in Dublin around 2018. A cluster of bands emerged within a few streets of each other, all playing guitar music but arriving at completely different destinations. Fontaines D.C. drew from post-punk and Joyce. Inhaler channelled stadium rock through a Bono-shaped lens. The Murder Capital went darker. Pillow Queens went wider.',
          'What connected them was not a shared sound but a shared refusal to apologise for playing guitars in an era that had largely moved on. The Dublin guitar tone — if such a thing exists — is characterised by its directness. These bands play loud and mean it.',
          'Fontaines D.C. were the first to break through internationally. Dogrel arrived in 2019 like a dispatch from a city that was changing too fast. Grian Chatten\'s vocal delivery — half-spoken, half-sung, always urgent — became the band\'s signature, and the guitar work on tracks like "Big" and "Boys in the Better Land" had a wiry tension that felt distinctly Dublin.',
          'Inhaler took a different path entirely. Where Fontaines D.C. stripped things back, Inhaler built things up — layers of reverb, anthemic choruses, and a production style that owes more to U2 and MGMT than to Joy Division. Their debut, It Won\'t Always Be Like This, was unapologetically designed for big rooms.',
          'The interesting thing is how these bands coexist. Dublin is small enough that everyone knows everyone, and the scene feels collaborative rather than competitive. Members guest on each other\'s records, share rehearsal spaces, and turn up at each other\'s gigs.',
          'Whether this moment in Dublin music will be remembered as a movement or a coincidence depends on what comes next. But right now, it feels like something worth paying attention to.',
        ]),
      } as any,
    })
    console.log('  Created deep dive: Dublin Guitar Tone')
  } catch (err) {
    console.error('  Failed to create extra deep dive:', err)
  }

  // Extra playlist
  try {
    await payload.create({
      collection: 'playlists',
      data: {
        title: 'Sunday Morning Slow Burn',
        slug: 'sunday-morning-slow-burn',
        publishedOn: '2025-12-15T00:00:00.000Z',
        platform: 'Spotify',
        playlistUrl: 'https://open.spotify.com/playlist/placeholder2',
        embedUrl: 'https://open.spotify.com/embed/playlist/placeholder2',
        mood: 'Gentle, warm, unhurried',
        tags: ['Morning', 'Acoustic', 'Folk'],
        excerpt: 'A slow-tempo playlist for lazy Sunday mornings. Coffee, daylight, no rush.',
        published: true,
        content: makeLexical([
          'This playlist was built for the hours between waking up and deciding what to do with the day. The sequencing prioritises gentle transitions — nothing jolts, nothing demands attention, everything just flows.',
          'The opening third is mostly acoustic: finger-picked guitars, soft vocals, the occasional piano. The middle section introduces some light percussion and bass, but the tempo never rises above a slow walk.',
          'Best played on speakers, not headphones. Let it fill the room while you make breakfast.',
        ]),
      } as any,
    })
    console.log('  Created playlist: Sunday Morning Slow Burn')
  } catch (err) {
    console.error('  Failed to create extra playlist:', err)
  }

  // Extra notes
  const extraNotes = [
    {
      title: 'Late Night Vinyl Session',
      slug: 'late-night-vinyl-session',
      listenedOn: '2026-02-20T00:00:00.000Z',
      artist: 'Radiohead',
      source: 'Home turntable',
      tags: ['Vinyl', 'Night-Listening'],
      excerpt: 'Put on OK Computer on vinyl for the first time in months. Still hits different on wax.',
      published: true,
      content: makeLexical([
        'There\'s something about dropping the needle on a record you haven\'t played in a while. OK Computer came out before I was born, but it sounds like it was written about right now. The vinyl pressing has a warmth that the digital version misses — the bass on "Airbag" has a physical presence that you feel in your chest.',
        'Listened to the whole thing front to back without touching my phone. That\'s the test of a great album: can it hold your attention for 53 minutes without competition? This one can.',
      ]),
    },
    {
      title: 'Festival Discovery: New Artist on the Small Stage',
      slug: 'festival-discovery-small-stage',
      listenedOn: '2026-01-15T00:00:00.000Z',
      artist: 'Somebody\'s Child',
      source: 'Festival recording',
      tags: ['Discovery', 'Live'],
      excerpt: 'Found a gem between headliners. Sometimes the best sets happen on the smallest stages.',
      published: true,
      content: makeLexical([
        'The best thing about festivals is the accidental discovery. You\'re walking between stages, killing time before the next act you actually planned to see, and something catches your ear from a tent you weren\'t going to visit.',
        'That\'s how I found Somebody\'s Child. A three-piece from Dublin playing to maybe 200 people in a tent that could hold 500. The sound was too loud for the space, the monitors were feeding back, and none of it mattered because the songs were undeniable.',
        'Made a note to follow up. This is why you go to festivals — not for the headliners, but for the moments between them.',
      ]),
    },
  ]

  for (const note of extraNotes) {
    try {
      await payload.create({
        collection: 'notes',
        data: note as any,
      })
      console.log(`  Created note: ${note.title}`)
    } catch (err) {
      console.error(`  Failed to create note ${note.title}:`, err)
    }
  }
}

// ── Main ───────────────────────────────────────────────────────────────────

async function seed() {
  console.log('Starting content seed...')
  console.log(`Reading Astro content from: ${ASTRO_CONTENT}`)

  const payload = await getPayload({ config: configPromise })

  await seedReviews(payload)
  await seedExtraReviews(payload)
  await seedGigs(payload)
  await seedDeepDives(payload)
  await seedPlaylists(payload)
  await seedNotes(payload)
  await seedExtraContent(payload)

  console.log('\nSeed complete!')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
