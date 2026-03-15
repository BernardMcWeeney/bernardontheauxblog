import Icon from './Icon';

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
  { label: 'Archive', href: '/archive/' },
  { label: 'About', href: '/about/' },
  { label: 'RSS', href: '/rss.xml' },
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
          </div>
          <div className="footer-links">
            {footerLinks.map((link) => (
              <a key={link.href} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="footer-bottom">
          &#9830; Full albums &middot; Room tone &middot; Repeat spins &#9830;
        </div>
      </div>
    </footer>
  );
}
