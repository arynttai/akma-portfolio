'use client'
import {useEffect, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame} from '@react-three/fiber'
import {Float, RoundedBox} from '@react-three/drei'
import * as THREE from 'three'

export type Sat = {id: string; color: string}

function Clay({color, rough = .78}: {color: string; rough?: number}) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={0}/>
}

function Ring({r, tilt, dashed = false}: {r: number; tilt: [number, number]; dashed?: boolean}) {
  return <mesh rotation={[Math.PI / 2 + tilt[0], tilt[1], 0]}>
    <torusGeometry args={[r, dashed ? .006 : .012, 6, 160]}/>
    <meshBasicMaterial color={dashed ? '#b9ac9c' : '#8f7f6d'} transparent opacity={dashed ? .6 : .55}/>
  </mesh>
}

function Satellites({sats, selected, onSelect, reduced}: {sats: Sat[]; selected: string; onSelect: (id: string) => void; reduced: boolean}) {
  const refs = useRef<(THREE.Group | null)[]>([])
  const pulses = useRef<(THREE.Mesh | null)[]>([])
  const R = 2.05, tilt = new THREE.Euler(.32, 0, .18)
  const q = useMemo(() => new THREE.Quaternion().setFromEuler(tilt), []) // eslint-disable-line react-hooks/exhaustive-deps
  useFrame(({clock}) => {
    const t = reduced ? 0 : clock.elapsedTime * .18
    sats.forEach((s, i) => {
      const a = t + (i / sats.length) * Math.PI * 2
      const v = new THREE.Vector3(Math.cos(a) * R, 0, Math.sin(a) * R).applyQuaternion(q)
      const g = refs.current[i]
      if (g) {
        g.position.copy(v); g.rotation.y = -a
        const target = s.id === selected ? 1.35 : 1
        g.scale.setScalar(THREE.MathUtils.lerp(g.scale.x, target, .12))
      }
      const p = pulses.current[i]
      if (p) { const k = reduced ? .5 : (clock.elapsedTime * .5 + i * .27) % 1; p.position.copy(v).multiplyScalar(1 - k); p.visible = s.id === selected || !reduced }
    })
  })
  return <>
    {sats.map((s, i) => <group key={s.id} ref={el => { refs.current[i] = el }} onClick={e => { e.stopPropagation(); onSelect(s.id) }}
      onPointerOver={() => { document.body.style.cursor = 'pointer'; onSelect(s.id) }} onPointerOut={() => { document.body.style.cursor = '' }}>
      <RoundedBox args={[.26, .26, .3]} radius={.06}><Clay color={s.color}/></RoundedBox>
      {[-1, 1].map(k => <mesh key={k} position={[k * .34, 0, 0]}><boxGeometry args={[.4, .018, .2]}/><meshStandardMaterial color="#7fb3e6" roughness={.35} metalness={.2}/></mesh>)}
      <mesh position={[0, .2, 0]}><coneGeometry args={[.09, .1, 20, 1, true]}/><meshStandardMaterial color="#ffffff" side={THREE.DoubleSide}/></mesh>
      {s.id === selected && <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.42, .012, 6, 48]}/><meshBasicMaterial color="#1f1a17"/></mesh>}
    </group>)}
    {sats.map((s, i) => <mesh key={'p' + s.id} ref={el => { pulses.current[i] = el }}><sphereGeometry args={[.035, 10, 8]}/><meshBasicMaterial color={s.color}/></mesh>)}
  </>
}

function Planet({reduced}: {reduced: boolean}) {
  const g = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (g.current && !reduced) g.current.rotation.y += dt * .15 })
  return <group ref={g}>
    <mesh><sphereGeometry args={[.85, 48, 36]}/><Clay color="#f6eadb"/></mesh>
    <mesh rotation={[Math.PI / 2, 0, 0]}><torusGeometry args={[.86, .07, 12, 64]}/><Clay color="#02b140"/></mesh>
    {[[.5, .5, .5], [-.55, .3, .45], [.1, -.55, .62], [-.3, -.4, -.65]].map(([x, y, z], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[.1, 14, 12]}/><Clay color={['#7fb3e6', '#f3b58f', '#cfc2f2', '#f5d77a'][i]}/></mesh>)}
  </group>
}

function Cloud({position, scale = 1}: {position: [number, number, number]; scale?: number}) {
  return <Float speed={1.4} floatIntensity={.5}>
    <group position={position} scale={scale}>
      {[[0, 0, 0, .26], [.25, -.04, 0, .19], [-.25, -.05, 0, .18]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 20, 16]}/><Clay color="#ffffff" rough={.95}/></mesh>)}
    </group>
  </Float>
}

export default function OrbitScene({sats, selected, onSelect}: {sats: Sat[]; selected: string; onSelect: (id: string) => void}) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting), {rootMargin: '100px'})
    if (host.current) io.observe(host.current)
    return () => io.disconnect()
  }, [])
  return <div ref={host} className="orbit-canvas" aria-hidden="true">
    <Canvas dpr={[1, 1.75]} camera={{position: [0, 2.4, 8.6], fov: 36}} onCreated={({camera}) => camera.lookAt(0, -.1, 0)} frameloop={visible ? (reduced ? 'demand' : 'always') : 'never'} gl={{antialias: true, powerPreference: 'low-power'}}>
      <hemisphereLight args={['#fff7ee', '#e9d6c4', 1]}/>
      <directionalLight position={[3, 5, 4]} intensity={1.6}/>
      <group rotation={[.1, 0, 0]}>
        <Planet reduced={reduced}/>
        <Ring r={2.05} tilt={[.32, .18]}/>
        <Ring r={2.75} tilt={[.12, -.3]} dashed/>
        <Ring r={1.45} tilt={[-.25, .5]} dashed/>
        <Satellites sats={sats} selected={selected} onSelect={onSelect} reduced={reduced}/>
        <Cloud position={[-2.4, 1.1, -.6]} scale={.9}/>
        <Cloud position={[2.5, -.7, -.4]} scale={.7}/>
      </group>
    </Canvas>
  </div>
}
