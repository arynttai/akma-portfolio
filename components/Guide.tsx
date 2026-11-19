'use client'
import {useEffect, useState} from 'react'
import {Face, sections, useActiveSection} from './Nav'

const tips: Record<string, string> = {
  home: 'Try the camera moves under the 3D scene. Vertigo is my favourite.',
  projects: 'Every card opens with real screenshots. Digital Jailay has a public demo.',
  experience: 'Hover the little satellites. Those are the products I work on.',
  about: 'You can drag the photos. I won’t tell anyone.',
  contact: 'Thanks for scrolling all the way down. Say hi?'
}

/** Mini Akma in 2D: follows you between sections and points at the next thing to look at. */
export default function Guide() {
  const active = useActiveSection()
  const [open, setOpen] = useState(false)
  const [hidden, setHidden] = useState(false)
  useEffect(() => {
    if (!matchMedia('(min-width: 761px)').matches || active === 'home') { setOpen(false); return }
    setOpen(true); const t = setTimeout(() => setOpen(false), 6000); return () => clearTimeout(t)
  }, [active])
  useEffect(() => {
    try { if (sessionStorage.getItem('guide-off') === '1') setHidden(true) } catch {}
    console.log('%c hi from akma ✦ ', 'background:#7c1f2c;color:#fff;border-radius:4px;padding:2px 6px', '\nYou opened the console, so you’re my kind of person. Source: github.com/arynttai')
  }, [])
  if (hidden) return null
  const i = sections.findIndex(([id]) => id === active)
  const next = sections[i + 1]
  return <div className={'guide' + (open ? ' talking' : '')}>
    {open && <div className="guide-bubble" role="status">
      <p>{tips[active]}</p>
      <div className="guide-actions">
        {next && <a href={'#' + next[0]} onClick={() => setOpen(false)}>Next: {next[1]} ↓</a>}
        <button onClick={() => { setHidden(true); try { sessionStorage.setItem('guide-off', '1') } catch {} }}>Hide guide</button>
      </div>
    </div>}
    <button className="guide-face" onClick={() => setOpen(!open)} aria-label={open ? 'Close Mini Akma’s tip' : 'Ask Mini Akma for a tip'} aria-expanded={open}><Face size={46}/></button>
  </div>
}
