'use client'

import { useState } from 'react'

export default function SubscribeForm() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email) return

    setStatus('loading')
    try {
      const res = await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })

      if (res.ok) {
        setStatus('success')
        setMessage('You\'re in. Thanks for subscribing.')
        setEmail('')
      } else {
        const data: any = await res.json().catch((): null => null)
        const errorMsg: string = data?.errors?.[0]?.message || ''
        if (errorMsg.includes('unique') || res.status === 400) {
          setStatus('success')
          setMessage('You\'re already subscribed.')
        } else {
          setStatus('error')
          setMessage('Something went wrong. Try again.')
        }
      }
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Try again.')
    }
  }

  return (
    <form className="subscribe-form" onSubmit={handleSubmit}>
      <label className="subscribe-label" htmlFor="subscribe-email">
        Get new posts by email
      </label>
      {status === 'success' ? (
        <p className="subscribe-message">{message}</p>
      ) : (
        <div className="subscribe-row">
          <input
            id="subscribe-email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="subscribe-input"
            disabled={status === 'loading'}
          />
          <button type="submit" className="subscribe-btn" disabled={status === 'loading'}>
            {status === 'loading' ? '...' : 'Subscribe'}
          </button>
        </div>
      )}
      {status === 'error' && <p className="subscribe-error">{message}</p>}
    </form>
  )
}
