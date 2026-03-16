import Icon from './Icon';
import SubscribeForm from './SubscribeForm';

const footerIcons = [
  'turntable',
  'vinyl',
  'cassette',
  'cd',
  'speaker',
  'radio',
  'headphones',
] as const;

const footerLinks = [
  { label: 'Reviews', href: '/reviews/' },
  { label: 'Gigs', href: '/gigs/' },
  { label: 'Deep Dives', href: '/deep-dives/' },
  { label: 'Playlists', href: '/playlists/' },
  { label: 'Artists', href: '/artists/' },
  { label: 'Archive', href: '/archive/' },
  { label: 'About', href: '/about/' },
  { label: 'RSS', href: '/rss.xml' },
];

const socialLinks = [
  { label: 'Instagram', href: 'https://instagram.com/bernardontheaux', icon: 'instagram' },
  { label: 'Twitter', href: 'https://x.com/bernardontheaux', icon: 'twitter' },
  { label: 'Spotify', href: 'https://open.spotify.com/', icon: 'spotify' },
];

export default function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-icons" aria-hidden="true">
          {footerIcons.map((icon) => (
            <Icon key={icon} name={icon} />
          ))}
        </div>

        <div className="footer-inner">
          <div>
            <p className="footer-title">Bernard On The Aux</p>
            <p className="footer-text">
              A music website for honest opinions, deep listens, and records that stay with you.
            </p>
            <div className="footer-socials">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  className="footer-social-link"
                >
                  <Icon name={link.icon as any} size={18} />
                </a>
              ))}
            </div>
          </div>
          <div>
            <div className="footer-links">
              {footerLinks.map((link) => (
                <a key={link.href} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
            <SubscribeForm />
          </div>
        </div>

        <div className="footer-bottom">
          &#9830; Full albums &middot; Room tone &middot; Repeat spins &#9830;
        </div>
      </div>
    </footer>
  );
}
