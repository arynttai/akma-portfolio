'use client'
import {useEffect, useRef} from 'react'

/** A soft ring that trails the mouse and names the action under it (data-cursor). Desktop only; the system cursor stays visible. */
export default function Cursor() {
  const ring = useRef<HTMLDivElement>(null)
  const label = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!matchMedia('(pointer: fine)').matches || matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const el = ring.current!, lb = label.current!
    let x = innerWidth / 2, y = innerHeight / 2, tx = x, ty = y, raf = 0, text = ''
    el.classList.add('live')
    const sense = (target: Element | null) => {
      const t = target?.closest<HTMLElement>('[data-cursor], a, button, [role=tab], .pola')
      const next = t?.dataset.cursor || (t?.classList.contains('pola') ? 'Drag' : '')
      if (next !== text) { text = next; lb.textContent = next; el.classList.toggle('has-label', !!next) }
      el.classList.toggle('hover', !!t)
    }
    const move = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return
      tx = e.clientX; ty = e.clientY
      sense(e.target as Element)
      el.classList.add('show')
      if (!raf) raf = requestAnimationFrame(tick)
    }
    const scroll = () => sense(document.elementFromPoint(tx, ty))
    const tick = () => {
      x += (tx - x) * .22; y += (ty - y) * .22
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .3 ? requestAnimationFrame(tick) : 0
    }
    const leave = () => el.classList.remove('show')
    const down = () => el.classList.add('press')
    const up = () => el.classList.remove('press')
    addEventListener('pointermove', move, {passive: true})
    addEventListener('scroll', scroll, {passive: true})
    document.addEventListener('pointerleave', leave)
    addEventListener('pointerdown', down); addEventListener('pointerup', up)
    return () => { cancelAnimationFrame(raf); removeEventListener('pointermove', move); removeEventListener('scroll', scroll); document.removeEventListener('pointerleave', leave); removeEventListener('pointerdown', down); removeEventListener('pointerup', up) }
  }, [])
  return <div ref={ring} className="cursor" aria-hidden="true"><span ref={label}/></div>
}
