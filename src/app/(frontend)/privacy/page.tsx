import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | Bernard On The Aux',
  description: 'Privacy policy for Bernard On The Aux.',
}

export default function PrivacyPage() {
  return (
    <div className="container">
      <article className="post">
        <header className="post-header">
          <p className="eyebrow">Privacy</p>
          <h1 className="post-title">Privacy Policy</h1>
        </header>

        <div className="post-body">
          <p>
            <em>Last updated: February 2026</em>
          </p>

          <p>
            Bernard On The Aux is a personal music blog. This privacy policy explains what
            information (if any) is collected when you visit the site.
          </p>

          <h2>Analytics</h2>
          <p>
            This site uses <strong>Cloudflare Web Analytics</strong>, a privacy-focused analytics
            service that does not use cookies, does not track users across sites, and does not collect
            personal information.
          </p>
          <p>
            Cloudflare Web Analytics collects aggregate, anonymized data such as page views,
            referrers, and browser types. This data cannot be used to identify individual visitors.
          </p>

          <h2>Cookies</h2>
          <p>
            This site does not set any cookies. No tracking cookies, no session cookies, no
            advertising cookies.
          </p>

          <h2>Third-party embeds</h2>
          <p>
            Some pages may include embedded content from third-party services like Spotify, YouTube,
            or other music platforms. These embeds are loaded directly from those services and may set
            their own cookies or collect data according to their own privacy policies.
          </p>
          <p>
            When possible, embeds are loaded lazily (only when you scroll to them) to minimize
            unnecessary data transfer.
          </p>

          <h2>Contact information</h2>
          <p>
            If you email me via the contact page, I'll receive your email address and any information
            you choose to include. I don't share email addresses with anyone or add them to any
            mailing list without explicit consent.
          </p>

          <h2>Data storage</h2>
          <p>
            This site is hosted on Cloudflare Pages. Cloudflare may collect standard server logs (IP
            addresses, request times, etc.) as part of their service. See{' '}
            <a
              href="https://www.cloudflare.com/privacypolicy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Cloudflare's privacy policy
            </a>{' '}
            for details.
          </p>

          <h2>Changes to this policy</h2>
          <p>
            If this privacy policy changes, the updated version will be posted here with a new "last
            updated" date.
          </p>

          <h2>Questions</h2>
          <p>
            If you have questions about this privacy policy, feel free to{' '}
            <a href="/contact/">get in touch</a>.
          </p>
        </div>
      </article>
    </div>
  )
}
