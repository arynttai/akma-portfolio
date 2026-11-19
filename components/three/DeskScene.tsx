'use client'
import {Suspense, useEffect, useMemo, useRef, useState} from 'react'
import {Canvas, useFrame, useThree} from '@react-three/fiber'
import {ContactShadows, Float, RoundedBox, useTexture} from '@react-three/drei'
import * as THREE from 'three'
import Mascot from './Mascot'

export type Screen = {id: string; src: string; name: string}

function Clay({color, rough = .78}: {color: string; rough?: number}) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={0}/>
}
const pointer = {over: () => { document.body.style.cursor = 'pointer' }, out: () => { document.body.style.cursor = '' }}

function Monitor({screens, index, onOpen}: {screens: Screen[]; index: number; onOpen: (id: string) => void}) {
  const textures = useTexture(screens.map(s => s.src))
  useMemo(() => textures.forEach(t => { t.colorSpace = THREE.SRGBColorSpace; t.anisotropy = 4 }), [textures])
  const current = screens[index % screens.length]
  return <group position={[.78, 1.02, -.12]} rotation={[0, -.32, 0]}>
    <mesh position={[0, .08, 0]}><cylinderGeometry args={[.05, .07, .22, 16]}/><Clay color="#cfc2f2"/></mesh>
    <RoundedBox args={[.5, .05, .32]} radius={.025} position={[0, -.03, 0]}><Clay color="#cfc2f2"/></RoundedBox>
    <group position={[0, .62, 0]} onClick={e => { e.stopPropagation(); onOpen(current.id) }} onPointerOver={pointer.over} onPointerOut={pointer.out}>
      <RoundedBox args={[1.42, .94, .08]} radius={.06} smoothness={4}><Clay color="#cfc2f2"/></RoundedBox>
      <mesh position={[0, .02, .042]}>
        <planeGeometry args={[1.3, .8125]}/>
        <meshBasicMaterial map={textures[index % textures.length]} toneMapped={false}/>
      </mesh>
      <mesh position={[0, -.43, .045]}><circleGeometry args={[.018, 16]}/><meshBasicMaterial color="#8a7bd0"/></mesh>
    </group>
  </group>
}

function RecordPlayer({playing, onPlay}: {playing: boolean; onPlay: () => void}) {
  const disc = useRef<THREE.Group>(null)
  useFrame((_, dt) => { if (disc.current && playing) disc.current.rotation.y += dt * 3.5 })
  return <group position={[-.05, .99, .3]} rotation={[0, .25, 0]} onClick={e => { e.stopPropagation(); onPlay() }} onPointerOver={pointer.over} onPointerOut={pointer.out}>
    <RoundedBox args={[.56, .08, .48]} radius={.03}><Clay color="#f3b58f"/></RoundedBox>
    <group ref={disc} position={[-.04, .05, 0]}>
      <mesh><cylinderGeometry args={[.2, .2, .015, 40]}/><meshStandardMaterial color="#1c1a1d" roughness={.35}/></mesh>
      <mesh position={[0, .009, 0]}><cylinderGeometry args={[.065, .065, .004, 24]}/><Clay color="#c4304a"/></mesh>
      <mesh position={[.12, .01, 0]}><boxGeometry args={[.04, .004, .01]}/><meshBasicMaterial color="#ffffff"/></mesh>
    </group>
    <mesh position={[.2, .07, -.14]} rotation={[0, .5, playing ? .15 : .35]}><boxGeometry args={[.025, .025, .26]}/><Clay color="#e9e3da" rough={.4}/></mesh>
  </group>
}

function Notes({show}: {show: boolean}) {
  const g = useRef<THREE.Group>(null)
  useFrame(({clock}) => {
    if (!g.current) return
    g.current.children.forEach((c, i) => {
      const t = (clock.elapsedTime * .6 + i / 3) % 1
      c.position.set(-.2 + Math.sin(t * 6 + i) * .15, 1.15 + t * 1.1, .3)
      c.scale.setScalar(show ? Math.sin(t * Math.PI) * 1 : 0)
    })
  })
  return <group ref={g}>{[0, 1, 2].map(i => <group key={i}>
    <mesh><sphereGeometry args={[.045, 12, 10]}/><Clay color={['#c4304a', '#7c6bd6', '#3c8f6a'][i]}/></mesh>
    <mesh position={[.04, .09, 0]}><boxGeometry args={[.012, .18, .012]}/><Clay color={['#c4304a', '#7c6bd6', '#3c8f6a'][i]}/></mesh>
  </group>)}</group>
}

function Satellite({onClick}: {onClick: () => void}) {
  const g = useRef<THREE.Group>(null)
  useFrame(({clock}) => {
    const t = clock.elapsedTime * .35
    if (g.current) { g.current.position.set(.5 + Math.cos(t) * 1.25, 2.55 + Math.sin(t * 2) * .08, -.4 + Math.sin(t) * .6); g.current.rotation.y = -t }
  })
  return <group ref={g} onClick={e => { e.stopPropagation(); onClick() }} onPointerOver={pointer.over} onPointerOut={pointer.out} scale={.8}>
    <RoundedBox args={[.2, .2, .26]} radius={.04}><Clay color="#f5d77a"/></RoundedBox>
    {[-1, 1].map(s => <mesh key={s} position={[s * .3, 0, 0]}><boxGeometry args={[.36, .015, .18]}/><meshStandardMaterial color="#7fb3e6" roughness={.35} metalness={.2}/></mesh>)}
    <mesh position={[0, .16, 0]} rotation={[0, 0, 0]}><coneGeometry args={[.08, .09, 20, 1, true]}/><meshStandardMaterial color="#ffffff" side={THREE.DoubleSide} roughness={.6}/></mesh>
  </group>
}

function Cloud({position, scale = 1}: {position: [number, number, number]; scale?: number}) {
  return <Float speed={1.2} floatIntensity={.4} rotationIntensity={.1}>
    <group position={position} scale={scale}>
      {[[0, 0, 0, .28], [.27, -.05, 0, .21], [-.27, -.06, 0, .2], [.1, .14, -.02, .2]].map(([x, y, z, r], i) =>
        <mesh key={i} position={[x, y, z]}><sphereGeometry args={[r, 24, 18]}/><Clay color="#ffffff" rough={.95}/></mesh>)}
    </group>
  </Float>
}

export type ShotKind = 'dolly' | 'orbit' | 'crane' | 'crash' | 'vertigo' | 'dutch'
export type Shot = {kind: ShotKind; id: number}
export const SHOT_MS = 2800
const B = new THREE.Vector3(.25, 2.4, 8.2), T = new THREE.Vector3(.3, 1.3, 0), FACE = new THREE.Vector3(-.85, 1.85, .55)
const D0 = B.distanceTo(T), HALF0 = Math.tan(THREE.MathUtils.degToRad(15)), DIR = B.clone().sub(T).normalize()
const ease = (x: number) => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
/** up–hold–down envelope for a camera move */
const env = (u: number) => u < .35 ? ease(u / .35) : u < .7 ? 1 : 1 - ease((u - .7) / .3)
const pad = (n: number) => String(n).padStart(2, '0')

/** Camera rig: gentle parallax that follows the pointer. */
function Rig({reduced, shot, hud}: {reduced: boolean; shot?: Shot; hud?: React.RefObject<HTMLDivElement | null>}) {
  const {camera, pointer: p, clock} = useThree()
  const run = useRef({id: -1, t0: 0})
  const last = useRef({focal: '', tc: ''})
  const pos = useMemo(() => new THREE.Vector3(), []), tgt = useMemo(() => new THREE.Vector3(), [])
  useFrame((_, dt) => {
    const cam = camera as THREE.PerspectiveCamera
    if (shot && shot.id !== run.current.id) run.current = {id: shot.id, t0: clock.elapsedTime}
    const elapsed = clock.elapsedTime - run.current.t0
    const u = shot ? elapsed / (SHOT_MS / 1000) : 2
    const active = !!shot && u >= 0 && u <= 1
    let fov = 30, roll = 0
    pos.set(B.x + (reduced ? 0 : p.x * .3), B.y + (reduced ? 0 : p.y * .15), B.z); tgt.copy(T)
    if (active) {
      const k = env(u)
      if (shot.kind === 'dolly') { pos.lerp(new THREE.Vector3(-.5, 2.0, 3.2), k); tgt.lerp(FACE, k) }
      if (shot.kind === 'crane') { pos.set(B.x, B.y + 4.6 * k, B.z - 2.6 * k); tgt.y -= .5 * k }
      if (shot.kind === 'orbit') { const a = Math.sin(u * Math.PI * 2) * 1.05; pos.set(T.x + Math.sin(a) * 8, B.y + .4 * Math.sin(u * Math.PI), T.z + Math.cos(a) * 8) }
      if (shot.kind === 'crash') { const c = u < .12 ? ease(u / .12) : u < .7 ? 1 : 1 - ease((u - .7) / .3); fov = 30 - 19 * c; tgt.lerp(FACE, c) }
      if (shot.kind === 'vertigo') { const d = THREE.MathUtils.lerp(D0, 3.3, k); pos.copy(T).addScaledVector(DIR, d); fov = THREE.MathUtils.radToDeg(2 * Math.atan(D0 * HALF0 / d)) }
      if (shot.kind === 'dutch') { roll = .32 * k; pos.lerp(new THREE.Vector3(1.6, 1.6, 6.2), k) }
      camera.position.copy(pos)
      if (cam.fov !== fov) { cam.fov = fov; cam.updateProjectionMatrix() }
    } else {
      camera.position.x = THREE.MathUtils.damp(camera.position.x, pos.x, 3, dt)
      camera.position.y = THREE.MathUtils.damp(camera.position.y, pos.y, 3, dt)
      camera.position.z = THREE.MathUtils.damp(camera.position.z, pos.z, 3, dt)
      if (Math.abs(cam.fov - fov) > .01) { cam.fov = THREE.MathUtils.damp(cam.fov, fov, 6, dt); cam.updateProjectionMatrix() }
    }
    camera.up.set(Math.sin(roll), Math.cos(roll), 0)
    camera.lookAt(tgt)
    // HUD: 35mm-equivalent focal length (24mm film height) and a 24fps timecode while rolling
    const el = hud?.current
    if (el) {
      const focal = Math.round(12 / Math.tan(THREE.MathUtils.degToRad(cam.fov / 2))) + 'mm'
      if (focal !== last.current.focal) { const f = el.querySelector('[data-hud=focal]'); if (f) f.textContent = focal; last.current.focal = focal }
      const frames = active ? Math.floor(elapsed * 24) : 0
      const tc = `00:00:${pad(Math.floor(frames / 24))}:${pad(frames % 24)}`
      if (tc !== last.current.tc) { const t = el.querySelector('[data-hud=tc]'); if (t) t.textContent = tc; last.current.tc = tc }
    }
  })
  return null
}

export type DeskProps = {
  screens: Screen[]
  screenIndex: number
  onOpenProject: (id: string) => void
  onPoke: () => void
  onRecord: () => void
  onSatellite: () => void
  waving: boolean
  dancing: boolean
  shades: boolean
  shot?: Shot
  hud?: React.RefObject<HTMLDivElement | null>
}

export default function DeskScene(props: DeskProps) {
  const host = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(true)
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    setReduced(matchMedia('(prefers-reduced-motion: reduce)').matches)
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting))
    if (host.current) io.observe(host.current)
    return () => io.disconnect()
  }, [])

  return <div ref={host} className="scene-canvas" aria-hidden="true">
    <Canvas dpr={[1, 1.75]} camera={{position: [.25, 2.4, 8.2], fov: 30}} frameloop={visible ? (reduced ? 'demand' : 'always') : 'never'}
      gl={{antialias: true, powerPreference: 'low-power'}} onCreated={({camera}) => camera.lookAt(.3, 1.3, 0)}>
      <hemisphereLight args={['#fff7ee', '#e9d6c4', .9]}/>
      <directionalLight position={[3, 6, 5]} intensity={1.7} color="#fff3e6"/>
      <directionalLight position={[-4, 3, -2]} intensity={.45} color="#c9dcff"/>
      <Rig reduced={reduced} shot={props.shot} hud={props.hud}/>
      <Suspense fallback={null}>
        {/* floor */}
        <mesh position={[.2, -.06, .1]}><cylinderGeometry args={[2.6, 2.7, .12, 64]}/><Clay color="#f1e1cd"/></mesh>
        <mesh position={[.2, .002, .1]} rotation={[-Math.PI / 2, 0, 0]}><ringGeometry args={[2.25, 2.3, 64]}/><meshBasicMaterial color="#e2cbb1"/></mesh>
        <ContactShadows position={[.2, .005, .1]} opacity={.35} scale={6} blur={2.4} far={2} resolution={512} color="#7a5a48"/>
        {/* desk */}
        <RoundedBox args={[2.1, .1, 1.05]} radius={.04} position={[.5, .9, .05]}><Clay color="#f6cfb6"/></RoundedBox>
        {[[-.45, -.4], [1.45, -.4], [-.45, .5], [1.45, .5]].map(([x, z], i) => <mesh key={i} position={[x, .44, z]}><cylinderGeometry args={[.045, .045, .86, 12]}/><Clay color="#e9b79c"/></mesh>)}
        <RoundedBox args={[.62, .035, .2]} radius={.015} position={[.52, .965, .38]} rotation={[0, -.2, 0]}><Clay color="#ffffff"/></RoundedBox>
        <group position={[1.3, .95, .32]}>
          <mesh position={[0, .1, 0]}><cylinderGeometry args={[.09, .08, .2, 20]}/><Clay color="#02b140"/></mesh>
          <mesh position={[.1, .1, 0]} rotation={[0, 0, Math.PI / 2]}><torusGeometry args={[.05, .015, 8, 16]}/><Clay color="#02b140"/></mesh>
        </group>
        <group position={[-.2, .95, -.28]}>
          <mesh position={[0, .11, 0]}><cylinderGeometry args={[.11, .085, .22, 20]}/><Clay color="#7fb3e6"/></mesh>
          {[[0, .36, 0, .13], [-.1, .3, .05, .09], [.1, .32, -.03, .1]].map(([x, y, z, r], i) => <mesh key={i} position={[x, y, z]} scale={[1, 1.3, 1]}><sphereGeometry args={[r, 16, 12]}/><Clay color={i ? '#5aa57c' : '#4c9670'}/></mesh>)}
        </group>
        <Monitor screens={props.screens} index={props.screenIndex} onOpen={props.onOpenProject}/>
        <RecordPlayer playing={props.dancing} onPlay={props.onRecord}/>
        <Notes show={props.dancing}/>
        <group position={[-.92, 0, .5]} rotation={[0, .5, 0]}>
          <Mascot waving={props.waving} dancing={props.dancing} shades={props.shades} reduced={reduced} onPoke={props.onPoke}/>
        </group>
        <Satellite onClick={props.onSatellite}/>
        <Cloud position={[-1.7, 2.75, -.8]} scale={.9}/>
        <Cloud position={[2.25, 2.2, -1]} scale={.65}/>
      </Suspense>
    </Canvas>
  </div>
}
