'use client'
import { useEffect } from 'react'

export function GigFilters(): null {
  useEffect(() => {
    const selects = document.querySelectorAll('.filter-select') as unknown as NodeListOf<HTMLSelectElement>
    const cards = document.querySelectorAll('.filterable-card') as unknown as NodeListOf<HTMLElement>
    const countEl = document.getElementById('filter-count')
    const filters: Record<string, string> = {}

    const applyFilters = () => {
      let visible = 0
      cards.forEach((card) => {
        let show = true
        if (show && filters.year) show = card.dataset.year === filters.year
        if (show && filters.city) show = card.dataset.city === filters.city
        if (show && filters.venue) show = card.dataset.venue === filters.venue
        if (show && filters.tag) {
          const tags = (card.dataset.tags ?? '').split(',')
          show = tags.includes(filters.tag)
        }
        card.style.display = show ? '' : 'none'
        if (show) visible++
      })
      if (countEl) countEl.textContent = `${visible} gig${visible !== 1 ? 's' : ''}`
    }

    selects.forEach((sel: HTMLSelectElement) => {
      sel.addEventListener('change', () => {
        const group = sel.dataset.filter!
        const value = sel.value
        if (value === 'all') delete filters[group]
        else filters[group] = value
        applyFilters()
      })
    })
  }, [])

  return null
}

export default GigFilters
