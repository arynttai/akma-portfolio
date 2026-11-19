'use client'
import {useEffect, useRef, useState} from 'react'
import {projects, provenanceText, type Project, type Shot} from '@/data/content'
import RoomViewer from './demos/RoomViewer'
import AttendanceFlow from './demos/AttendanceFlow'
import ArnaAiConcept from './demos/ArnaAiConcept'
import {Icon} from './Marks'

export function openProject(id: string) {
  window.dispatchEvent(new CustomEvent('open-project', {detail: id}))
}

export function Device({shot, priority = false}: {shot: Shot; priority?: boolean}) {
  return <figure className={'device device-' + shot.device}>
    <div className="device-frame">
      {shot.device === 'laptop' && <div className="device-bar" aria-hidden="true"><i/><i/><i/></div>}
      <img src={shot.src} alt={shot.alt} width={shot.w} height={shot.h} loading={priority ? 'eager' : 'lazy'} decoding="async"/>
    </div>
  </figure>
}

function Sheet({p, onClose}: {p: Project; onClose: () => void}) {
  const [i, setI] = useState(0)
  const shot = p.shots[Math.min(i, p.shots.length - 1)]
  const idx = projects.findIndex(x => x.id === p.id)
  const next = projects[(idx + 1) % projects.length]
  return <div className={'sheet accent-' + p.accent}>
    <header className="sheet-head">
      <div>
        <p className="kicker">{p.kicker} · {p.year}</p>
        <h2 id="sheet-title">{p.name}</h2>
        <p className="sheet-one">{p.oneLiner}</p>
      </div>
      <button className="icon-btn" onClick={onClose} aria-label="Close project"><Icon name="close"/></button>
    </header>

    <div className="sheet-gallery">
      <div className="gallery-main">
        <Device shot={shot} priority/>
        <p className="prov"><span className={'prov-dot prov-' + shot.source}/>{shot.label} — {provenanceText[shot.source]}</p>
      </div>
      {p.shots.length > 1 && <div className="thumbs" role="tablist" aria-label="Screens">
        {p.shots.map((s, k) => <button key={s.src} role="tab" aria-selected={k === i} className={'thumb thumb-' + s.device + (k === i ? ' on' : '')} onClick={() => setI(k)}>
          <img src={s.src} alt="" width={s.w} height={s.h} loading="lazy"/><span>{s.label}</span>
        </button>)}
      </div>}
    </div>

    {p.demo && <div className="sheet-demo">
      {p.demo === 'room' && <><h3>Try it: the reconstructed room</h3><RoomViewer/></>}
      {p.demo === 'attendance' && <><h3>Try it: the QR + PIN flow</h3><AttendanceFlow/></>}
      {p.demo === 'arnaai' && <><h3>How ArnaAI talks</h3><ArnaAiConcept/></>}
    </div>}

    <div className="sheet-body">
      <section><h3>What it is</h3><p>{p.what}</p>{p.team && <p className="team-note">{p.team}</p>}</section>
      <section><h3>My part</h3><ul className="ticks">{p.mine.map(x => <li key={x}>{x}</li>)}</ul></section>
      <section className="spark"><h3>The interesting bit</h3><p>{p.spark}</p></section>
      <section><h3>Stack</h3><p className="pills">{p.stack.map(s => <span key={s}>{s}</span>)}</p></section>
      <section><h3>Links</h3>
        {p.links.length ? <ul className="out-links">{p.links.map(l => <li key={l.href}><a href={l.href} target="_blank" rel="noreferrer"><Icon name="arrow" size={15}/>{l.label}</a>{l.note && <small>{l.note}</small>}</li>)}</ul>
          : <p className="muted">Private repository. Happy to walk through the code on a call.</p>}
      </section>
    </div>
    <footer className="sheet-foot">
      <button className="btn btn-line" onClick={() => openProject(next.id)}>Next: {next.name} →</button>
    </footer>
  </div>
}

export default function ProjectSheet() {
  const dialog = useRef<HTMLDialogElement>(null)
  const [p, setP] = useState<Project | null>(null)
  const last = useRef<HTMLElement | null>(null)

  useEffect(() => {
    const open = (id: string) => {
      const found = projects.find(x => x.id === id)
      if (!found) return
      if (!dialog.current?.open) last.current = document.activeElement as HTMLElement
      setP(found)
      if (!dialog.current?.open) dialog.current?.showModal()
      dialog.current?.querySelector('.sheet')?.scrollTo({top: 0})
      history.replaceState(null, '', '#project-' + id)
    }
    const onEvent = (e: Event) => open((e as CustomEvent<string>).detail)
    window.addEventListener('open-project', onEvent)
    const fromHash = () => { const m = location.hash.match(/^#project-(.+)$/); if (m) open(m[1]) }
    fromHash()
    window.addEventListener('hashchange', fromHash)
    return () => { window.removeEventListener('open-project', onEvent); window.removeEventListener('hashchange', fromHash) }
  }, [])

  function close() {
    dialog.current?.close()
  }
  function onClosed() {
    setP(null)
    if (location.hash.startsWith('#project-')) history.replaceState(null, '', '#projects')
    last.current?.focus?.()
  }

  return <dialog ref={dialog} className="sheet-dialog" aria-labelledby="sheet-title" onClose={onClosed}
    onClick={e => { if (e.target === dialog.current) close() }}>
    {p && <Sheet key={p.id} p={p} onClose={close}/>}
  </dialog>
}
