'use client'
import { useEffect } from 'react'

export function ReviewFilters(): null {
  useEffect(() => {
    const selects = document.querySelectorAll('.filter-select') as unknown as NodeListOf<HTMLSelectElement>
    const cards = document.querySelectorAll('.filterable-card') as unknown as NodeListOf<HTMLElement>
    const countEl = document.getElementById('filter-count')
    const filters: Record<string, string> = {}

    const applyFilters = () => {
      let visible = 0
      cards.forEach((card) => {
        let show = true
        if (filters.rating) {
          const r = parseFloat(card.dataset.rating ?? '0')
          if (filters.rating === '8+') show = r >= 8
          else if (filters.rating === '6-8') show = r >= 6 && r < 8
          else if (filters.rating === 'under6') show = r < 6
        }
        if (show && filters.type) show = card.dataset.type === filters.type
        if (show && filters.format) show = card.dataset.format === filters.format
        if (show && filters.year) show = card.dataset.year === filters.year
        if (show && filters.tag) {
          const tags = (card.dataset.tags ?? '').split(',')
          show = tags.includes(filters.tag)
        }
        card.style.display = show ? '' : 'none'
        if (show) visible++
      })
      if (countEl) countEl.textContent = `${visible} review${visible !== 1 ? 's' : ''}`
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
