'use client'
import { useEffect } from 'react'

export function PlaylistFilters(): null {
  useEffect(() => {
    const selects = document.querySelectorAll('.filter-select') as unknown as NodeListOf<HTMLSelectElement>
    const cards = document.querySelectorAll('.filterable-card') as unknown as NodeListOf<HTMLElement>
    const countEl = document.getElementById('filter-count')
    const filters: Record<string, string> = {}

    const applyFilters = () => {
      let visible = 0
      cards.forEach((card) => {
        let show = true
        if (show && filters.platform) show = card.dataset.platform === filters.platform
        if (show && filters.tag) {
          const tags = (card.dataset.tags ?? '').split(',')
          show = tags.includes(filters.tag)
        }
        card.style.display = show ? '' : 'none'
        if (show) visible++
      })
      if (countEl) countEl.textContent = `${visible} playlist${visible !== 1 ? 's' : ''}`
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

export default PlaylistFilters
