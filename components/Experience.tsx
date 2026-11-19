'use client'
import {asset} from '@/lib/base'
import dynamic from 'next/dynamic'
import {useEffect, useState} from 'react'
import {jobs, projects, wins} from '@/data/content'
import {openProject} from './ProjectSheet'
import {FreedomLogo, FreedomMark} from './Logos'

const OrbitScene = dynamic(() => import('./three/OrbitScene'), {ssr: false, loading: () => null})

const sats = [
  {id: 'arnasmart', color: '#7fb3e6', name: 'ArnaSmart', line: 'Utility meters + ArnaAI assistant'},
  {id: 'djailay', color: '#5aa57c', name: 'Digital Jailay', line: 'GPS collars, pastures, heatmap'},
  {id: 'reporter', color: '#a796e6', name: 'Reporter', line: 'Ops console, Telegram alerts, AI logs'},
  {id: 'arnalight', color: '#f0c74e', name: 'ArnaLight', line: 'Smart street lighting (team product)'}
]
const company = [
  ['Satellite', 'Starlink for business, hybrid links, IoT for utilities, agro and industry, R&D'],
  ['Cloud', '7 Tier III data centres, IaaS / PaaS / SaaS, Kubernetes, GPU cloud, IoT platforms'],
  ['Connect', 'Backbone fibre, dedicated lines, corporate networks, carrier services']
]

export default function Experience() {
  const [sel, setSel] = useState('arnasmart')
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [open, setOpen] = useState(0)
  useEffect(() => { try { const c = document.createElement('canvas'); setWebgl(!!(c.getContext('webgl2') || c.getContext('webgl'))) } catch { setWebgl(false) } }, [])
  const s = sats.find(x => x.id === sel)!
  const p = projects.find(x => x.id === sel)!

  return <section id="experience" className="experience" aria-labelledby="exp-title">
    <header className="section-head" data-reveal>
      <p className="eyebrow">02 · Experience</p>
      <FreedomLogo className="exp-logo"/>
      <h2 id="exp-title">Where I work: <em>a holding with its own satellites.</em></h2>
      <p className="lead">Freedom Cloud Holding runs satellite links, cloud data centres and fibre across Kazakhstan. I’m a software engineer on the IoT side, at Freedom Satellite. The big orbits are the company’s. The little satellites are the products I work on.</p>
    </header>

    <div className="orbit-wrap">
      <div className="orbit-stage">
        {webgl === null ? null : webgl ? <OrbitScene sats={sats} selected={sel} onSelect={setSel}/> : <img className="orbit-poster" src={asset('/media/scene/orbit.webp')} alt="" width={1000} height={800}/>}
        <span className="orbit-center-label"><FreedomMark size={16}/>Freedom Cloud Holding</span>
      </div>
      <div className="orbit-side">
        <p className="legend"><span className="lg lg-company"/>Company directions — not my work</p>
        <ul className="company">{company.map(([k, v]) => <li key={k}><b>{k}</b><span>{v}</span></li>)}</ul>
        <p className="legend"><span className="lg lg-mine"/>Products I work on</p>
        <div className="sat-buttons" role="tablist" aria-label="Products">
          {sats.map(x => <button key={x.id} role="tab" aria-selected={x.id === sel} className={x.id === sel ? 'on' : ''} onClick={() => setSel(x.id)} onMouseEnter={() => setSel(x.id)}>
            <i style={{background: x.color}}/>{x.name}
          </button>)}
        </div>
        <div className="sat-card" aria-live="polite">
          <p className="sat-line">{s.line}</p>
          <p>{p.mine[0]}</p>
          <button className="btn btn-ink small" onClick={() => openProject(sel)}>Open {s.name} →</button>
        </div>
      </div>
    </div>

    <div className="timeline-wrap">
      <div>
      <h3 className="sub-title">The path so far</h3>
      <ol className="timeline">
        {jobs.map((j, i) => <li key={j.org + j.when} className={'job c-' + j.color + (open === i ? ' open' : '')}>
          <button className="job-head" aria-expanded={open === i} onClick={() => setOpen(open === i ? -1 : i)}>
            <span className="job-when">{j.when}</span>
            <span className="job-org">{j.org}</span>
            <span className="job-role">{j.role}</span>
            <span className="job-plus" aria-hidden="true">+</span>
          </button>
          <div className="job-body" hidden={open !== i}>
            <ul>{j.points.map(x => <li key={x}>{x}</li>)}</ul>
            {j.projects && <p className="job-projects">{j.projects.map(id => <button key={id} className="chip-btn" onClick={() => openProject(id)}>{projects.find(x => x.id === id)!.name} →</button>)}</p>}
          </div>
        </li>)}
      </ol>
      </div>
      <div className="wins">
        <h3 className="sub-title">Wins & certificates</h3>
        <ul>{wins.map(([a, b], i) => <li key={a} className={i === 0 ? 'gold' : ''}><b>{a}</b><span>{b}</span></li>)}</ul>
      </div>
    </div>
  </section>
}
