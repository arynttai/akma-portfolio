'use client'
import {useEffect, useState} from 'react'
import {Icon} from './Marks'

export const sections = [['home', 'Home'], ['projects', 'Projects'], ['experience', 'Experience'], ['about', 'About'], ['contact', 'Contact']] as const

export function useActiveSection() {
  const [active, setActive] = useState('home')
  useEffect(() => {
    const els = sections.map(([id]) => document.getElementById(id)).filter(Boolean) as HTMLElement[]
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) setActive(e.target.id) })
    }, {rootMargin: '-45% 0px -50% 0px'})
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
  return active
}

export function Face({size = 40}: {size?: number}) {
  return <svg width={size} height={size} viewBox="0 0 64 64" aria-hidden="true" className="face">
    <path d="M10 40c-4-22 8-34 22-34s26 12 22 34l-4 16H14z" fill="#6b2b1d"/>
    <circle cx="32" cy="33" r="18" fill="#f2c6aa"/>
    <path d="M13 30c2-14 12-19 19-19s17 5 19 19c-6-5-11-7-19-7s-13 2-19 7z" fill="#6b2b1d"/>
    <ellipse cx="25" cy="35" rx="2.4" ry="3" fill="#231a19"/><ellipse cx="39" cy="35" rx="2.4" ry="3" fill="#231a19"/>
    <circle cx="20" cy="41" r="3" fill="#f19595" opacity=".7"/><circle cx="44" cy="41" r="3" fill="#f19595" opacity=".7"/>
    <path d="M28 43q4 3 8 0" stroke="#7c1f2c" strokeWidth="2" fill="none" strokeLinecap="round"/>
    <path d="M26 54l6 4 6-4-6 9z" fill="#7c1f2c"/>
  </svg>
}

function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => { setDark(document.documentElement.dataset.theme === 'dark') }, [])
  function flip() {
    const next = !dark
    setDark(next)
    document.documentElement.dataset.theme = next ? 'dark' : 'light'
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', next ? '#15120e' : '#f4eee3')
    try { localStorage.setItem('theme', next ? 'dark' : 'light') } catch {}
  }
  return <button className="theme-btn" onClick={flip} aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={dark} title={dark ? 'Light theme' : 'Dark theme'}>{dark ? '☀' : '☾'}</button>
}

export default function Nav() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (!open) return
    const k = (e: KeyboardEvent) => { if (e.key === 'Escape') setOpen(false) }
    addEventListener('keydown', k); return () => removeEventListener('keydown', k)
  }, [open])
  return <header className="nav-wrap">
    <nav className="nav" aria-label="Main">
      <a href="#home" className="brand" aria-label="Akmaral Aryntay, home"><Face size={30}/><span>akma<b>.</b></span></a>
      <ul className={'nav-links' + (open ? ' open' : '')} id="nav-links">
        {sections.map(([id, label]) => <li key={id}><a href={'#' + id} aria-current={active === id ? 'true' : undefined} className={active === id ? 'on' : ''} onClick={() => setOpen(false)}>{label}</a></li>)}
      </ul>
      <ThemeToggle/>
      <button className="nav-toggle" aria-expanded={open} aria-controls="nav-links" aria-label={open ? 'Close menu' : 'Open menu'} onClick={() => setOpen(!open)}><Icon name={open ? 'close' : 'menu'}/></button>
    </nav>
  </header>
}
