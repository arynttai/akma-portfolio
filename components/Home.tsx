'use client'
import {asset} from '@/lib/base'
import dynamic from 'next/dynamic'
import {useEffect, useRef, useState} from 'react'
import {projects, links} from '@/data/content'
import {playRiff} from '@/lib/sound'
import {openProject} from './ProjectSheet'
import {Icon} from './Marks'
import {FreedomBadge} from './Logos'

const DeskScene = dynamic(() => import('./three/DeskScene'), {ssr: false, loading: () => null})

const screens = [
  {id: 'djailay', src: asset('/media/work/djailay-map.webp')},
  {id: 'arnalight', src: asset('/media/work/arnalight-dashboard.webp')},
  {id: 'agriprom', src: asset('/media/work/agri-home.webp')},
  {id: 'arnasmart', src: asset('/media/work/arnasmart-map.webp')},
  {id: 'djailay', src: asset('/media/work/djailay-heatmap.webp')},
  {id: 'arnalight', src: asset('/media/work/arnalight-map.webp')}
].map(s => ({...s, name: projects.find(p => p.id === s.id)!.name}))

const lines = [
  'Hi! I’m Mini Akma. Click around, everything here does something.',
  'The screen shows real projects. Click it to open one.',
  'At work I built an AI assistant with its own mascot. Small world.',
  'Psst. The record player works.',
  'One more click and I’m putting my sunglasses on.',
  'Okay. Now I’m ready for Soul Camp.'
]

function hasWebGL() {
  try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')) } catch { return false }
}

function KineticName({text}: {text: string}) {
  let i = 0
  const words = text.split(' ')
  return <>{words.map((word, w) => <span key={w}><span className="word" aria-hidden="true">
    {[...word].map(ch => <span key={i} className="ch" style={{'--i': i++} as React.CSSProperties}>{ch}</span>)}
  </span>{w < words.length - 1 ? ' ' : ''}</span>)}</>
}

export default function Home() {
  const [webgl, setWebgl] = useState<boolean | null>(null)
  const [index, setIndex] = useState(0)
  const [say, setSay] = useState(lines[0])
  const [pokes, setPokes] = useState(0)
  const [waving, setWaving] = useState(false)
  const [dancing, setDancing] = useState(false)
  const [reduced, setReduced] = useState(false)
  const timers = useRef<number[]>([])
  const touched = useRef(false)

  useEffect(() => {
    const gl = hasWebGL()
    setWebgl(gl)
    const rm = matchMedia('(prefers-reduced-motion: reduce)').matches
    setReduced(rm)
    if (!rm) {
      timers.current.push(window.setInterval(() => setIndex(i => (i + 1) % screens.length), 3800))
      timers.current.push(window.setTimeout(() => { setWaving(true); window.setTimeout(() => setWaving(false), 1600) }, 900))
    }
    return () => { timers.current.forEach(t => { clearInterval(t); clearTimeout(t) })}
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  function poke() {
    touched.current = true
    const n = pokes + 1
    setPokes(n)
    setSay(lines[Math.min(n, lines.length - 1)])
    setWaving(true)
    window.setTimeout(() => setWaving(false), 1300)
  }
  function record() {
    touched.current = true
    if (dancing) return
    setDancing(true)
    setSay('♪ This is my favourite part.')
    const ms = playRiff()
    window.setTimeout(() => { setDancing(false); setSay('Thanks for listening. Now go look at the projects.') }, ms)
  }
  const current = screens[index]
  const shades = pokes >= 5

  return <section id="home" className="home" aria-labelledby="home-title">
    <div className="home-copy">
      <p className="hello"><span className="wave-hand" aria-hidden="true">✦</span> hi, I’m Akma</p>
      <h1 id="home-title" aria-label="Akmaral Aryntay"><KineticName text="Akmaral Aryntay"/></h1>
      <p className="role">Software engineer in Astana. I build IoT dashboards, AI assistants and mobile apps that real people use every day.</p>
      <p className="now"><span className="dot" aria-hidden="true"/> Now: software engineer at <b>Freedom Cloud Holding Ltd.</b></p>
      <div className="home-actions">
        <a className="btn btn-ink" href="#projects" ><Icon name="grid" size={16}/>Explore my work</a>
        <a className="btn btn-line" href={links.cv} target="_blank" rel="noreferrer"><Icon name="file" size={16}/>Open CV</a>
      </div>
      <FreedomBadge/>
    </div>

    <div className="home-stage">
      <figure className="polaroid irl" aria-label="Real photo">
        <img src={asset('/media/portraits/profile-small.webp')} alt="Akmaral in profile, white shirt and burgundy tie, dark studio background" width={600} height={900} fetchPriority="high"/>
        <figcaption>the real one</figcaption>
      </figure>
      <div className="scene">
        {webgl === null ? null : webgl === false || reduced
          ? <img className="scene-poster" src={asset('/media/scene/desk.webp')} alt="Clay-style 3D Mini Akma sitting at a desk with a monitor, a record player and a satellite" width={1200} height={1000}/>
          : <DeskScene screens={screens} screenIndex={index} onOpenProject={openProject} onPoke={poke} onRecord={record}
              onSatellite={() => document.getElementById('experience')?.scrollIntoView({behavior: 'smooth'})}
              waving={waving} dancing={dancing} shades={shades}/>}
        <p className="bubble" aria-live="polite">{say}</p>
      </div>

      <div className="scene-controls" aria-label="Scene controls">
        <button className="chip-btn" onClick={poke}>👋 Say hi to Mini Akma</button>
        <button className="chip-btn" onClick={record} aria-pressed={dancing}>♪ Play the record</button>
        <button className="chip-btn" onClick={() => openProject(current.id)}>On screen: {current.name} →</button>
      </div>
    </div>
  </section>
}
