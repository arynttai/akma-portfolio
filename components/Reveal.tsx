'use client'
import {useEffect} from 'react'

/** Adds .in to [data-reveal] elements once they enter the viewport. Content is visible without JS. */
export default function Reveal() {
  useEffect(() => {
    const root = document.documentElement
    root.classList.add('js')
    const items = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'))
    if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) {
      items.forEach(el => el.classList.add('in'))
      return
    }
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target) } })
    }, {rootMargin: '0px 0px -8% 0px', threshold: .08})
    items.forEach(el => io.observe(el))

    const progress = document.querySelector<HTMLElement>('.progress')
    let frame = 0
    const onScroll = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(() => {
        const max = root.scrollHeight - innerHeight
        progress?.style.setProperty('--p', String(max > 0 ? scrollY / max : 0))
        root.style.setProperty('--hero-shift', String(Math.min(1, scrollY / innerHeight)))
      })
    }
    addEventListener('scroll', onScroll, {passive: true})
    onScroll()
    return () => { io.disconnect(); removeEventListener('scroll', onScroll) }
  }, [])
  return <div className="progress" aria-hidden="true"/>
}
