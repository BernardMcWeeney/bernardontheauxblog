import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Contact | Bernard On The Aux',
  description: 'Get in touch with Bernard On The Aux.',
}

export default function ContactPage() {
  return (
    <div className="container">
      <article className="post">
        <header className="post-header">
          <p className="eyebrow">Contact</p>
          <h1 className="post-title">Get in Touch</h1>
        </header>

        <div className="post-body">
          <p>
            Want to share a record recommendation, suggest a deep dive topic, report an issue with
            the site, or just say hello?
          </p>

          <p>The best way to reach me is by email:</p>

          <p>
            <a
              href="mailto:hello@bernardontheaux.com"
              style={{
                display: 'inline-block',
                padding: '0.75rem 1.5rem',
                background: 'var(--ink)',
                color: 'var(--bg)',
                textDecoration: 'none',
                borderRadius: 'var(--radius)',
                fontWeight: 500,
              }}
            >
              hello@bernardontheaux.com
            </a>
          </p>

          <p>
            I read everything, though responses might take a few days. If you're sending a
            recommendation, a few sentences about why you think the record is worth hearing goes a
            long way.
          </p>

          <h2>What I'm not looking for</h2>
          <ul>
            <li>Press releases or promotional blasts</li>
            <li>Requests to "feature" or "review" in exchange for payment</li>
            <li>SEO link exchange offers</li>
          </ul>

          <p>
            This is a personal project, not a publication with a submissions inbox. That said, genuine
            music recommendations from real listeners are always welcome.
          </p>
        </div>
      </article>
    </div>
  )
}
