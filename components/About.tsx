'use client'
import {asset} from '@/lib/base'
import {useRef} from 'react'
import {skills, links} from '@/data/content'
import {Icon} from './Marks'
import {AituLogo} from './Logos'

const photos = [
  {src: asset('/media/portraits/record.webp'), alt: 'Black and white close-up of Akmaral winking over a vinyl record', w: 960, h: 1280, cap: 'side A', x: 2, y: 6, r: -6},
  {src: asset('/media/portraits/roses.webp'), alt: 'Akmaral holding red roses, one hand behind her head', w: 853, h: 1280, cap: 'roses, always', x: 30, y: 0, r: 4},
  {src: asset('/media/portraits/mic.webp'), alt: 'Akmaral in sunglasses singing into a microphone, a guitar over her shoulder', w: 840, h: 1120, cap: 'yes, the sunglasses', x: 56, y: 10, r: -3},
  {src: asset('/media/portraits/strings.webp'), alt: 'Akmaral sitting on the floor with an electric guitar', w: 720, h: 1280, cap: 'strings', x: 16, y: 42, r: 5},
  {src: asset('/media/portraits/studio.webp'), alt: 'Akmaral standing with a guitar among instruments in a white studio', w: 960, h: 1280, cap: 'the whole set', x: 46, y: 46, r: -5}
]

function Polaroid({p, i}: {p: typeof photos[number]; i: number}) {
  const el = useRef<HTMLElement>(null)
  const drag = useRef<{x: number; y: number; dx: number; dy: number} | null>(null)
  const pos = useRef({dx: 0, dy: 0})
  function down(e: React.PointerEvent) {
    if (e.pointerType !== 'mouse') return
    drag.current = {x: e.clientX, y: e.clientY, dx: pos.current.dx, dy: pos.current.dy}
    ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    el.current!.style.zIndex = String(10 + Date.now() % 1000)
    el.current!.classList.add('dragging')
  }
  function move(e: React.PointerEvent) {
    const d = drag.current; if (!d) return
    pos.current = {dx: d.dx + e.clientX - d.x, dy: d.dy + e.clientY - d.y}
    el.current!.style.translate = `${pos.current.dx}px ${pos.current.dy}px`
  }
  function up() { drag.current = null; el.current?.classList.remove('dragging') }
  return <figure ref={el} className="pola" style={{left: p.x + '%', top: p.y + '%', rotate: p.r + 'deg', zIndex: i + 1}}
    onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
    onDoubleClick={() => { pos.current = {dx: 0, dy: 0}; el.current!.style.translate = '' }}>
    <img src={p.src} alt={p.alt} width={p.w} height={p.h} loading="lazy" draggable={false}/>
    <figcaption>{p.cap}</figcaption>
  </figure>
}

const truths = [
  {t: 'Music', d: 'Guitar, vinyl, a microphone I’m not shy with. Music taught me timing and layers before code did.', c: 'cherry'},
  {t: 'Design', d: 'I care how a screen feels, not only that it works. Most of my commits touch both logic and layout.', c: 'lilac'},
  {t: 'AI', d: 'ArnaAI at work, AituBalance for students, the nFactorial LLM Cup. I like AI best when it answers from real data.', c: 'sky'},
  {t: 'Teaching', d: 'I mentored students at IT Step: OOP, mobile, web. Explaining things is how I check I understand them.', c: 'butter'}
]

export default function About() {
  return <section id="about" className="about" aria-labelledby="about-title">
    <header className="section-head" data-reveal>
      <p className="eyebrow">03 · About</p>
      <h2 id="about-title">Off the keyboard, <em>still building things.</em></h2>
      <p className="lead">I study Software Engineering at Astana IT University and spend the rest of my time between product work, music and whatever I’m prototyping that week.</p>
    </header>

    <div className="about-grid">
      <div className="photo-wall" aria-label="Photos of Akmaral">
        {photos.map((p, i) => <Polaroid key={p.src} p={p} i={i}/>)}
        <p className="wall-hint" aria-hidden="true">drag the photos around · double-click to put back</p>
      </div>
      <div className="truths">
        {truths.map(x => <article key={x.t} className={'truth c-' + x.c}><h3>{x.t}</h3><p>{x.d}</p></article>)}
      </div>
    </div>

    <div className="about-row">
      <div className="edu">
        <h3 className="sub-title">Education</h3>
        <AituLogo/>
        <ul>
          <li><b>College: Software Developer diploma</b><span>Astana IT University · GPA 3.8</span></li>
          <li><b>BSc Software Engineering</b><span>Astana IT University · 2025 — 2028 · GPA 3.5</span></li>
        </ul>
      </div>
      <div className="skills">
        <h3 className="sub-title">What I build with</h3>
        {skills.map(([k, v]) => <div key={k} className="skill-row"><span className="skill-k">{k}</span><span className="stickers">{v.map(s => <i key={s}>{s}</i>)}</span></div>)}
      </div>
    </div>

  </section>
}

export function Contact() {
  return <section id="contact" className="contact" aria-labelledby="contact-title">
    <div className="contact-card">
      <p className="eyebrow">04 · Contact</p>
      <h2 id="contact-title">Let’s build <em>something odd and useful.</em></h2>
      <div className="contact-links">
        <a className="c-link c-mail" href={'mailto:' + links.email}><Icon name="mail" size={20}/><span><small>Email</small>{links.email}</span></a>
        <a className="c-link" href={links.github} target="_blank" rel="noreferrer"><Icon name="github" size={20}/><span><small>GitHub</small>arynttai</span></a>
        <a className="c-link" href={links.linkedin} target="_blank" rel="noreferrer"><Icon name="linkedin" size={20}/><span><small>LinkedIn</small>aryntay</span></a>
        <a className="c-link" href={links.telegram} target="_blank" rel="noreferrer"><Icon name="send" size={20}/><span><small>Telegram</small>{links.telegramHandle}</span></a>
        <a className="c-link c-cv" href={links.cv} target="_blank" rel="noreferrer"><Icon name="file" size={20}/><span><small>CV · PDF</small>Open CV</span></a>
      </div>
    </div>
    <footer className="footer">
      <span>Akmaral Aryntay · Astana · 2026</span>
      <a href="#home">Back to top ↑</a>
    </footer>
  </section>
}
