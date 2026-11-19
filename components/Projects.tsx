'use client'
import {projects, more, type Project} from '@/data/content'
import {openProject, Device} from './ProjectSheet'
import {Icon} from './Marks'

function tilt(e: React.PointerEvent<HTMLElement>) {
  if (e.pointerType !== 'mouse') return
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--rx', ((e.clientY - r.top) / r.height - .5) * -6 + 'deg')
  e.currentTarget.style.setProperty('--ry', ((e.clientX - r.left) / r.width - .5) * 8 + 'deg')
}
function untilt(e: React.PointerEvent<HTMLElement>) {
  e.currentTarget.style.setProperty('--rx', '0deg'); e.currentTarget.style.setProperty('--ry', '0deg')
}

function Visual({p}: {p: Project}) {
  const laptop = p.shots.find(s => s.device === 'laptop')
  const phones = p.shots.filter(s => s.device === 'phone')
  return <div className={'visual' + (laptop ? '' : ' phones-only')}>
    {laptop
      ? <><div className="float-laptop"><Device shot={laptop}/></div>{phones[0] && <div className="float-phone fp-side"><Device shot={phones[0]}/></div>}</>
      : phones.slice(0, 2).map((s, i) => <div key={s.src} className={'float-phone fp-' + i}><Device shot={s}/></div>)}
    {p.demo === 'room' && <span className="badge-3d">3D inside</span>}
  </div>
}

export default function Projects() {

  return <section id="projects" className="projects" aria-labelledby="projects-title">
    <header className="section-head" data-reveal>
      <p className="eyebrow">01 · Projects</p>
      <h2 id="projects-title">Things I’ve built, <em>with real screens.</em></h2>
      <p className="lead">Tap any card to open it: screenshots, what I did, the stack and links. Every image says where it came from.</p>
    </header>

    <ul className="bento">
      {projects.map(p => {
        return <li key={p.id} className={'tile tile-' + p.tile + ' accent-' + p.accent}>
          <button className="tile-btn" onClick={() => openProject(p.id)} onPointerMove={tilt} onPointerLeave={untilt}
            aria-label={`Open ${p.name}: ${p.oneLiner}`} data-cursor="Open">
            <Visual p={p}/>
            <span className="tile-text">
              <span className="tile-kicker">{p.kicker} · {p.year}</span>
              <span className="tile-name">{p.name}</span>
              <span className="tile-one">{p.oneLiner}</span>
              <span className="tile-foot"><span className="mini-pills">{p.stack.slice(0, 3).map(x => <i key={x}>{x}</i>)}</span><span className="tile-open">Open <Icon name="arrow" size={14}/></span></span>
            </span>
          </button>
        </li>
      })}
    </ul>

    <div className="more" id="more">
      <h3>More projects</h3>
      <ul className="more-list">
        {more.map(x => <li key={x.name}>
          <span className="more-year">{x.year}</span>
          <span className="more-name">{x.name}</span>
          <span className="more-what">{x.what}</span>
          <span className="more-stack">{x.stack}</span>
          {x.href ? <a className="more-link" href={x.href} target="_blank" rel="noreferrer">{x.linkLabel} ↗</a> : <span className="more-link muted">private</span>}
        </li>)}
      </ul>
    </div>
  </section>
}
