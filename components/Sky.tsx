'use client'
import {useEffect, useRef} from 'react'

// A quiet living background: stars and constellations at night, butterflies by day,
// and floating bits of code and music in both themes.

type Star = {x: number; y: number; z: number; s: number; ph: number; c: number; bright: boolean}
type Glyph = {x: number; y: number; z: number; vx: number; vy: number; s: number; g: string; c: number; rot: number; vr: number}
type Fly = {x: number; y: number; vx: number; ph: number; c: number; s: number}
type Shot = {x: number; y: number; vx: number; vy: number; life: number}

const GLYPHS = ['{ }', '</>', '♪', '♫', '✦', ';', '=>', '( )', '♩', '#', '</>', '✧', '♬', '[ ]']
const LIGHT = ['#e0607e', '#5b8fe0', '#3fa58a', '#d39a2c', '#8f74d6']
const DARK = ['#ffd9a8', '#ffb3c1', '#a9c8ff', '#b9f0d8', '#e0d2ff']

export default function Sky() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const cv = ref.current
    const ctx = cv?.getContext('2d')
    if (!cv || !ctx) return
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    const rnd = (a: number, b: number) => a + Math.random() * (b - a)
    const pick = <T,>(a: T[]) => a[Math.floor(Math.random() * a.length)]
    const mod = (v: number, m: number) => ((v % m) + m) % m

    let W = 0, H = 0, raf = 0, last = performance.now(), t = 0, nextShot = rnd(3, 7)
    let dark = false, mx = -1e4, my = -1e4, running = true
    let stars: Star[] = [], glyphs: Glyph[] = [], flies: Fly[] = [], links: [number, number][] = [], shot: Shot | null = null

    const readTheme = () => { dark = document.documentElement.dataset.theme === 'dark' }

    function seed() {
      const area = W * H, small = W < 760
      stars = Array.from({length: Math.round(area / (small ? 12000 : 8500))}, () => {
        const bright = Math.random() < .16
        return {x: rnd(0, W), y: rnd(0, H), z: bright ? 1 : rnd(.25, .9), s: bright ? rnd(1.3, 2.1) : rnd(.5, 1.3), ph: rnd(0, 6.3), c: Math.floor(rnd(0, 5)), bright}
      })
      glyphs = Array.from({length: Math.round(area / (small ? 52000 : 36000))}, () => {
        const z = rnd(.45, 1)
        return {x: rnd(0, W), y: rnd(0, H), z, vx: rnd(-4, 4), vy: -rnd(5, 12) * z, s: rnd(16, 30) * z, g: pick(GLYPHS), c: Math.floor(rnd(0, 5)), rot: rnd(-.35, .35), vr: rnd(-.12, .12)}
      })
      flies = Array.from({length: small ? 3 : 6}, () => ({x: rnd(0, W), y: rnd(H * .15, H * .85), vx: rnd(18, 32) * (Math.random() < .5 ? -1 : 1), ph: rnd(0, 6.3), c: Math.floor(rnd(0, 5)), s: rnd(10, 15)}))
      links = []
      const b = stars.map((s, i) => [s, i] as const).filter(([s]) => s.bright)
      for (let i = 0; i < b.length; i++) for (let j = i + 1; j < b.length; j++) {
        const dx = b[i][0].x - b[j][0].x, dy = b[i][0].y - b[j][0].y
        if (dx * dx + dy * dy < 120 * 120) links.push([b[i][1], b[j][1]])
      }
    }

    function resize() {
      const dpr = Math.min(devicePixelRatio || 1, 1.5)
      W = innerWidth; H = innerHeight
      cv!.width = Math.round(W * dpr); cv!.height = Math.round(H * dpr)
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
      seed()
    }

    function sparkle(x: number, y: number, r: number) {
      ctx!.beginPath()
      ctx!.moveTo(x, y - r); ctx!.quadraticCurveTo(x, y, x + r, y); ctx!.quadraticCurveTo(x, y, x, y + r)
      ctx!.quadraticCurveTo(x, y, x - r, y); ctx!.quadraticCurveTo(x, y, x, y - r); ctx!.fill()
    }

    function butterfly(f: Fly, y: number) {
      const flap = .25 + .75 * Math.abs(Math.sin(t * 9 + f.ph)), s = f.s, dir = Math.sign(f.vx)
      ctx!.save(); ctx!.translate(f.x, y); ctx!.rotate(dir * .25 + Math.sin(t * 2 + f.ph) * .1)
      ctx!.fillStyle = LIGHT[f.c]; ctx!.globalAlpha = .72
      for (const side of [-1, 1]) {
        ctx!.save(); ctx!.scale(side * flap, 1)
        ctx!.beginPath(); ctx!.ellipse(s * .55, -s * .35, s * .62, s * .5, -.5, 0, 6.3); ctx!.fill()
        ctx!.beginPath(); ctx!.ellipse(s * .4, s * .38, s * .38, s * .32, .5, 0, 6.3); ctx!.fill()
        ctx!.restore()
      }
      ctx!.globalAlpha = .7; ctx!.fillStyle = '#3a2a22'; ctx!.fillRect(-.8, -s * .55, 1.6, s * 1.1)
      ctx!.restore()
    }

    function frame(now: number) {
      const dt = Math.min((now - last) / 1000, .05); last = now; t += dt
      const sy = scrollY, pal = dark ? DARK : LIGHT
      ctx!.clearRect(0, 0, W, H)

      // stars: twinkling dots at night, small coloured sparkles by day
      const pos = stars.map(s => ({x: s.x, y: mod(s.y - sy * s.z * .12, H)}))
      if (dark) {
        ctx!.strokeStyle = 'rgba(220, 210, 255, .08)'; ctx!.lineWidth = 1
        for (const [a, b] of links) {
          const p = pos[a], q = pos[b]
          if (Math.abs(p.y - q.y) > 140) continue
          ctx!.beginPath(); ctx!.moveTo(p.x, p.y); ctx!.lineTo(q.x, q.y); ctx!.stroke()
        }
      }
      stars.forEach((s, i) => {
        const tw = .5 + .5 * Math.sin(t * (1.2 + s.z) + s.ph), p = pos[i]
        if (dark) {
          ctx!.fillStyle = s.bright ? pal[s.c] : '#fff'
          ctx!.globalAlpha = (s.bright ? .55 : .25) + tw * .45
          ctx!.beginPath(); ctx!.arc(p.x, p.y, s.s * (s.bright ? 1 : .8), 0, 6.3); ctx!.fill()
          if (s.bright) { ctx!.globalAlpha = .12 * tw; ctx!.beginPath(); ctx!.arc(p.x, p.y, s.s * 4, 0, 6.3); ctx!.fill() }
        } else if (s.bright || i % 3 === 0) {
          ctx!.fillStyle = pal[s.c]; ctx!.globalAlpha = .2 + tw * .4
          sparkle(p.x, p.y, s.s * (s.bright ? 3 : 2))
        }
      })

      // floating code and music glyphs, nudged away from the cursor
      ctx!.textAlign = 'center'; ctx!.textBaseline = 'middle'
      for (const g of glyphs) {
        if (!reduce) {
          g.x += g.vx * dt; g.y += g.vy * dt; g.rot += g.vr * dt
          const gy = mod(g.y - sy * g.z * .3, H + 60) - 30
          const dx = g.x - mx, dy = gy - my, d2 = dx * dx + dy * dy
          if (d2 < 130 * 130) { const d = Math.sqrt(d2) || 1, f = (130 - d) / 130 * 90 * dt; g.x += dx / d * f; g.y += dy / d * f }
          g.x = mod(g.x + 30, W + 60) - 30
        }
        const gy = mod(g.y - sy * g.z * .3, H + 60) - 30
        ctx!.save(); ctx!.translate(g.x, gy); ctx!.rotate(g.rot)
        ctx!.font = `${g.s}px "IBM Plex Mono", ui-monospace, monospace`
        ctx!.fillStyle = pal[g.c]; ctx!.globalAlpha = (dark ? .4 : .45) * g.z
        ctx!.fillText(g.g, 0, 0); ctx!.restore()
      }

      // daytime butterflies, night-time shooting stars
      if (!dark) for (const f of flies) {
        if (!reduce) { f.x += f.vx * dt; if (f.x < -40) f.x = W + 40; if (f.x > W + 40) f.x = -40 }
        butterfly(f, f.y + Math.sin(t * .9 + f.ph) * 26)
      }
      if (dark && !reduce) {
        nextShot -= dt
        if (!shot && nextShot <= 0) { shot = {x: rnd(W * .3, W), y: rnd(0, H * .4), vx: -rnd(500, 750), vy: rnd(160, 260), life: 1}; nextShot = rnd(5, 11) }
        if (shot) {
          shot.x += shot.vx * dt; shot.y += shot.vy * dt; shot.life -= dt * 1.1
          const tx = shot.x - shot.vx * .16, ty = shot.y - shot.vy * .16
          const gr = ctx!.createLinearGradient(shot.x, shot.y, tx, ty)
          gr.addColorStop(0, 'rgba(255, 244, 225, .9)'); gr.addColorStop(1, 'rgba(255, 244, 225, 0)')
          ctx!.globalAlpha = Math.max(shot.life, 0); ctx!.strokeStyle = gr; ctx!.lineWidth = 1.6
          ctx!.beginPath(); ctx!.moveTo(shot.x, shot.y); ctx!.lineTo(tx, ty); ctx!.stroke()
          if (shot.life <= 0 || shot.x < -100 || shot.y > H + 100) shot = null
        }
      }
      ctx!.globalAlpha = 1
      if (!reduce && running) raf = requestAnimationFrame(frame)
    }

    const redraw = () => { if (reduce) { last = performance.now(); frame(last) } }
    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    const onLeave = () => { mx = my = -1e4 }
    const onVis = () => {
      running = !document.hidden
      cancelAnimationFrame(raf)
      if (running && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame) }
    }
    const onResize = () => { resize(); redraw() }
    const mo = new MutationObserver(() => { readTheme(); redraw() })

    readTheme(); resize()
    mo.observe(document.documentElement, {attributes: true, attributeFilter: ['data-theme']})
    addEventListener('resize', onResize)
    addEventListener('pointermove', onMove, {passive: true})
    document.addEventListener('pointerleave', onLeave)
    document.addEventListener('visibilitychange', onVis)
    if (reduce) { frame(performance.now()); addEventListener('scroll', redraw, {passive: true}) }
    else raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf); mo.disconnect()
      removeEventListener('resize', onResize); removeEventListener('pointermove', onMove); removeEventListener('scroll', redraw)
      document.removeEventListener('pointerleave', onLeave); document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={ref} className="sky" aria-hidden="true"/>
}
