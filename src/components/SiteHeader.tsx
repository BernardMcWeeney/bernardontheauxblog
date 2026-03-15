'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Icon from './Icon';

const navItems = [
  { label: 'Home', href: '/', icon: 'home' as const },
  { label: 'Reviews', href: '/reviews/', icon: 'review' as const },
  { label: 'Gigs', href: '/gigs/', icon: 'gig' as const },
  { label: 'Deep Dives', href: '/deep-dives/', icon: 'dive' as const },
  { label: 'Playlists', href: '/playlists/', icon: 'playlist' as const },
  { label: 'Notes', href: '/notes/', icon: 'note' as const },
  { label: 'Archive', href: '/archive/', icon: 'archive' as const },
  { label: 'Search', href: '/search/', icon: 'search' as const },
];

export default function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const headerRef = useRef<HTMLElement>(null);

  const close = useCallback(() => setOpen(false), []);

  // Close on Escape key
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape' && open) {
        close();
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, close]);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (open && headerRef.current && !headerRef.current.contains(e.target as Node)) {
        close();
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [open, close]);

  // Close on route change
  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <header className="site-header" ref={headerRef}>
      <div className="container header-inner">
        <Link className="brand" href="/">
          <Icon name="turntable" className="brand-mark" />
          <span className="brand-main">Bernard On The Aux</span>
        </Link>

        <button
          className="menu-toggle"
          aria-expanded={open}
          aria-controls="main-nav"
          aria-label="Menu"
          onClick={() => setOpen((prev) => !prev)}
        >
          <Icon name="menu" className="menu-icon menu-icon--open" />
          <Icon name="x" className="menu-icon menu-icon--close" />
        </button>

        <nav id="main-nav" className={`nav ${open ? 'open' : ''}`}>
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon name={item.icon} className="nav-icon" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
