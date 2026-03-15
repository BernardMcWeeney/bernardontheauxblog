import Icon from './Icon';

interface PayloadMedia {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface PostCardProps {
  title: string;
  href: string;
  meta?: string;
  excerpt?: string;
  label?: string;
  cover?: string | PayloadMedia;
  icon?: string;
  rating?: number;
  square?: boolean;
  pillClass?: string;
}

const iconByPillClass: Record<string, string> = {
  'pill-review': 'review',
  'pill-gig': 'gig',
  'pill-dive': 'dive',
  'pill-playlist': 'playlist',
  'pill-note': 'note',
};

function iconFromLabel(label: string): string {
  const l = label.toLowerCase();
  if (/review/.test(l)) return 'review';
  if (/gig/.test(l)) return 'gig';
  if (/dive/.test(l)) return 'dive';
  if (/playlist/.test(l)) return 'playlist';
  if (/note/.test(l)) return 'note';
  return 'cd';
}

function resolveIcon(
  icon?: string,
  pillClass?: string,
  label?: string,
): string {
  if (icon) return icon;
  if (pillClass && iconByPillClass[pillClass]) return iconByPillClass[pillClass];
  if (label) return iconFromLabel(label);
  return 'cd';
}

function vibeClass(rating?: number, pillClass?: string): string {
  if (pillClass === 'pill-gig') return 'card-vibe-gig';
  if (rating === undefined || rating === null) return 'card-vibe-neutral';
  if (rating >= 8) return 'card-vibe-warm';
  if (rating < 5) return 'card-vibe-cool';
  return 'card-vibe-neutral';
}

export default function PostCard({
  title,
  href,
  meta,
  excerpt,
  label,
  cover,
  icon,
  rating,
  square = false,
  pillClass,
}: PostCardProps) {
  const resolvedIcon = resolveIcon(icon, pillClass, label);
  const vibe = vibeClass(rating, pillClass);

  let coverUrl: string | undefined;
  let coverAlt: string | undefined;

  if (cover) {
    if (typeof cover === 'string') {
      coverUrl = cover;
    } else if (cover && typeof cover === 'object' && cover.url) {
      coverUrl = cover.url;
      coverAlt = cover.alt;
    }
  }

  const cardClasses = ['card', vibe, square ? 'card-square' : '']
    .filter(Boolean)
    .join(' ');

  const mediaClasses = ['card-media', square ? 'square' : '']
    .filter(Boolean)
    .join(' ');

  const showHead = label || rating !== undefined;

  return (
    <article className={cardClasses}>
      <a className="card-link" href={href}>
        <div className={mediaClasses}>
          {coverUrl ? (
            <img src={coverUrl} alt={coverAlt || ''} loading="lazy" />
          ) : (
            <div className="card-placeholder">
              <Icon name={resolvedIcon as any} size={48} className="placeholder-icon" />
              <span>On the aux</span>
            </div>
          )}
        </div>
        <div className="card-body">
          {showHead && (
            <div className="card-head">
              {label && (
                <span className={`pill ${pillClass || ''}`}>
                  <Icon name={resolvedIcon as any} className="pill-icon" />
                  {label}
                </span>
              )}
              {rating !== undefined && (
                <span className="card-rating">
                  {rating}
                  <span
                    style={{
                      fontSize: '0.55em',
                      color: 'var(--muted)',
                      fontFamily: 'var(--font-label)',
                      letterSpacing: '0.08em',
                    }}
                  >
                    /10
                  </span>
                </span>
              )}
            </div>
          )}
          <h3 className="card-title">{title}</h3>
          {meta && <p className="meta">{meta}</p>}
          {excerpt && <p className="excerpt">{excerpt}</p>}
        </div>
      </a>
    </article>
  );
}
