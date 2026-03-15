import React from 'react';

type IconName =
  | 'review' | 'vinyl'
  | 'playlist' | 'cassette'
  | 'cd'
  | 'gig' | 'speaker'
  | 'dive' | 'radio'
  | 'note' | 'headphones'
  | 'search'
  | 'archive'
  | 'turntable' | 'record-player'
  | 'home' | 'music'
  | 'menu'
  | 'x';

interface IconProps {
  name: IconName;
  size?: number;
  className?: string;
  label?: string;
  decorative?: boolean;
}

const iconPaths: Record<string, React.ReactNode> = {
  review: (
    <>
      <circle cx="12" cy="12" r="8.3" />
      <circle cx="12" cy="12" r="2.1" />
      <path d="M20.2 12h1.8" />
    </>
  ),
  playlist: (
    <>
      <rect x="3.3" y="7" width="17.4" height="10" rx="2" />
      <circle cx="9" cy="12" r="2.2" />
      <circle cx="15" cy="12" r="2.2" />
      <path d="M11.6 12h0.8" />
      <path d="M3.3 10.2h17.4" />
    </>
  ),
  cd: (
    <>
      <circle cx="12" cy="12" r="8.1" />
      <circle cx="12" cy="12" r="2" />
      <path d="M17.8 6.6 15 9.2" />
    </>
  ),
  gig: (
    <>
      <rect x="3.7" y="4" width="6.4" height="16" rx="1.3" />
      <rect x="13.9" y="4" width="6.4" height="16" rx="1.3" />
      <circle cx="6.9" cy="9" r="1.25" />
      <circle cx="17.1" cy="9" r="1.25" />
      <circle cx="6.9" cy="15.3" r="1.8" />
      <circle cx="17.1" cy="15.3" r="1.8" />
    </>
  ),
  dive: (
    <>
      <rect x="3.3" y="7.2" width="17.4" height="10.6" rx="2" />
      <circle cx="8.3" cy="12.5" r="2.2" />
      <path d="M13.2 10.8h5.2" />
      <path d="M13.2 13.1h5.2" />
      <path d="M7.2 7.2 9.8 4.6h4.4" />
    </>
  ),
  note: (
    <>
      <path d="M5.2 13.8a6.8 6.8 0 0 1 13.6 0" />
      <rect x="4.5" y="13.4" width="3.1" height="5.4" rx="1" />
      <rect x="16.4" y="13.4" width="3.1" height="5.4" rx="1" />
      <path d="M7.6 18.2a4.6 4.6 0 0 0 8.8 0" />
    </>
  ),
  search: (
    <>
      <circle cx="10.7" cy="10.7" r="5.8" />
      <path d="m15 15 4.6 4.6" />
    </>
  ),
  archive: (
    <>
      <rect x="4.2" y="4.5" width="15.6" height="4.3" rx="1" />
      <rect x="4.2" y="10" width="15.6" height="4.3" rx="1" />
      <rect x="4.2" y="15.5" width="15.6" height="4.3" rx="1" />
    </>
  ),
  turntable: (
    <>
      <rect x="3.2" y="7.4" width="17.6" height="10.3" rx="2" />
      <circle cx="8.4" cy="12.6" r="2.5" />
      <path d="M12.6 12.6h5.6" />
      <path d="M16 10.5h2.6" />
    </>
  ),
  home: (
    <path d="M8 18.2a2.7 2.7 0 1 1 0-5.4c.6 0 1.2.2 1.7.5V6.5l8-1.7v8.8a2.7 2.7 0 1 1-1.3-2.3V6.8L10.9 8v10.2A2.7 2.7 0 0 1 8 21" />
  ),
  menu: (
    <>
      <path d="M4 6h16" />
      <path d="M4 12h16" />
      <path d="M4 18h16" />
    </>
  ),
  x: (
    <>
      <path d="M18 6 6 18" />
      <path d="M6 6l12 12" />
    </>
  ),
};

// Aliases
iconPaths['vinyl'] = iconPaths['review'];
iconPaths['cassette'] = iconPaths['playlist'];
iconPaths['speaker'] = iconPaths['gig'];
iconPaths['radio'] = iconPaths['dive'];
iconPaths['headphones'] = iconPaths['note'];
iconPaths['record-player'] = iconPaths['turntable'];
iconPaths['music'] = iconPaths['home'];

export default function Icon({
  name,
  size = 18,
  className,
  label,
  decorative = true,
}: IconProps) {
  const paths = iconPaths[name];
  if (!paths) return null;

  const classes = className ? `ui-icon ${className}` : 'ui-icon';

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={classes}
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={!decorative && label ? label : undefined}
    >
      {paths}
    </svg>
  );
}
