'use client'
import {useMemo, useRef} from 'react'
import {useFrame} from '@react-three/fiber'
import * as THREE from 'three'

export const palette = {
  skin: '#f2c6aa', hair: '#6b2b1d', hairLight: '#8a3a27', shirt: '#fbf8f2', tie: '#7c1f2c',
  skirt: '#29242c', boots: '#2b2627', blush: '#f19595', eye: '#231a19', silver: '#d9d6d0'
}

function Clay({color, rough = .78}: {color: string; rough?: number}) {
  return <meshStandardMaterial color={color} roughness={rough} metalness={0}/>
}

type Props = {
  waving: boolean
  dancing: boolean
  shades: boolean
  reduced: boolean
  onPoke?: () => void
}

/** Mini Akma: a clay-style chibi based on the real outfit in the photos (auburn hair with bangs, white shirt, burgundy tie, black skirt, boots). */
export default function Mascot({waving, dancing, shades, reduced, onPoke}: Props) {
  const head = useRef<THREE.Group>(null)
  const body = useRef<THREE.Group>(null)
  const armR = useRef<THREE.Group>(null)
  const armL = useRef<THREE.Group>(null)
  const eyes = useRef<THREE.Group>(null)
  const blink = useRef({next: 2, t: 0})

  // hair pieces: open-front cap + bangs
  const capGeo = useMemo(() => new THREE.SphereGeometry(.545, 40, 28, Math.PI / 2 + 1.15, Math.PI * 2 - 2.3, 0, Math.PI * .78), [])
  const bangGeo = useMemo(() => new THREE.SphereGeometry(.548, 40, 20, Math.PI / 2 - 1.2, 2.4, 0, Math.PI * .3), [])
  const smileGeo = useMemo(() => new THREE.TorusGeometry(.055, .016, 8, 20, Math.PI), [])

  useFrame((state, dt) => {
    const t = state.clock.elapsedTime
    const p = state.pointer
    if (head.current) {
      const ty = reduced ? 0 : THREE.MathUtils.clamp(p.x * .55, -.6, .6)
      const tx = reduced ? 0 : THREE.MathUtils.clamp(-p.y * .25, -.25, .3)
      const bob = dancing ? Math.sin(t * 9) * .12 : 0
      head.current.rotation.y = THREE.MathUtils.damp(head.current.rotation.y, ty, 4, dt)
      head.current.rotation.x = THREE.MathUtils.damp(head.current.rotation.x, tx + bob, 4, dt)
      head.current.rotation.z = THREE.MathUtils.damp(head.current.rotation.z, dancing ? Math.sin(t * 4.5) * .14 : Math.sin(t * .8) * (reduced ? 0 : .03), 5, dt)
    }
    if (body.current && !reduced) body.current.position.y = Math.sin(t * 1.6) * .012 + (dancing ? Math.abs(Math.sin(t * 9)) * .04 : 0)
    if (armR.current) {
      const target = waving ? -2.5 + Math.sin(t * 14) * .35 : dancing ? -1.1 + Math.sin(t * 9) * .5 : -.95
      armR.current.rotation.x = THREE.MathUtils.damp(armR.current.rotation.x, waving ? -.3 : target, 8, dt)
      armR.current.rotation.z = THREE.MathUtils.damp(armR.current.rotation.z, waving ? 2.3 + Math.sin(t * 14) * .35 : .08, 8, dt)
    }
    if (armL.current) armL.current.rotation.x = THREE.MathUtils.damp(armL.current.rotation.x, dancing ? -1.1 - Math.sin(t * 9) * .5 : -.95, 8, dt)
    // blink
    const b = blink.current
    b.t += dt
    if (eyes.current) {
      const closing = b.t > b.next && b.t < b.next + .14
      eyes.current.scale.y = THREE.MathUtils.damp(eyes.current.scale.y, closing ? .1 : 1, 30, dt)
      if (b.t > b.next + .14) { b.t = 0; b.next = 2 + Math.random() * 3 }
    }
  })

  const poke = (e: {stopPropagation: () => void}) => { e.stopPropagation(); onPoke?.() }
  const over = () => { document.body.style.cursor = 'pointer' }
  const out = () => { document.body.style.cursor = '' }

  return <group ref={body} onClick={poke} onPointerOver={over} onPointerOut={out}>
    {/* stool */}
    <mesh position={[0, .5, -.02]} castShadow><cylinderGeometry args={[.34, .34, .09, 32]}/><Clay color="#e6b8a2"/></mesh>
    <mesh position={[0, .25, -.02]}><cylinderGeometry args={[.06, .09, .46, 16]}/><Clay color="#d49f88"/></mesh>
    <mesh position={[0, .03, -.02]}><cylinderGeometry args={[.24, .26, .05, 24]}/><Clay color="#d49f88"/></mesh>

    {/* skirt + legs */}
    <mesh position={[0, .7, 0]}><cylinderGeometry args={[.26, .4, .3, 32]}/><Clay color={palette.skirt}/></mesh>
    {[-1, 1].map(s => <group key={s} position={[s * .13, .63, .08]}>
      <mesh position={[0, 0, .2]} rotation={[Math.PI / 2, 0, 0]}><capsuleGeometry args={[.095, .26, 6, 14]}/><Clay color={palette.skin}/></mesh>
      <mesh position={[0, -.22, .38]}><capsuleGeometry args={[.085, .24, 6, 14]}/><Clay color={palette.skin}/></mesh>
      <mesh position={[0, -.42, .39]}><cylinderGeometry args={[.1, .1, .1, 16]}/><Clay color="#ffffff"/></mesh>
      <mesh position={[0, -.52, .41]}><capsuleGeometry args={[.11, .12, 6, 14]}/><Clay color={palette.boots} rough={.5}/></mesh>
      <mesh position={[0, -.6, .5]} scale={[1, .6, 1.4]}><sphereGeometry args={[.11, 16, 12]}/><Clay color={palette.boots} rough={.5}/></mesh>
    </group>)}

    {/* torso */}
    <mesh position={[0, 1.04, 0]} scale={[1, 1, .82]}><capsuleGeometry args={[.27, .3, 8, 24]}/><Clay color={palette.shirt}/></mesh>
    {[-1, 1].map(s => <mesh key={s} position={[s * .09, 1.3, .17]} rotation={[.5, 0, s * .9]}><coneGeometry args={[.07, .16, 3]}/><Clay color={palette.shirt}/></mesh>)}
    <mesh position={[0, 1.27, .2]}><sphereGeometry args={[.045, 12, 10]}/><Clay color={palette.tie}/></mesh>
    <mesh position={[.01, 1.08, .225]} rotation={[-.12, 0, .05]}><boxGeometry args={[.085, .33, .03]}/><Clay color={palette.tie}/></mesh>
    <mesh position={[.015, .9, .25]} rotation={[-.12, 0, Math.PI / 4]}><boxGeometry args={[.06, .06, .03]}/><Clay color={palette.tie}/></mesh>

    {/* arms: pivot at shoulders */}
    {[[-1, armL], [1, armR]].map(([s, ref]) => <group key={s as number} ref={ref as React.RefObject<THREE.Group>} position={[(s as number) * .31, 1.2, 0]} rotation={[-.95, 0, (s as number) * .08]}>
      <mesh position={[0, -.18, 0]}><capsuleGeometry args={[.085, .26, 6, 14]}/><Clay color={palette.shirt}/></mesh>
      <mesh position={[0, -.4, 0]}><sphereGeometry args={[.075, 14, 12]}/><Clay color={palette.skin}/></mesh>
    </group>)}

    {/* neck + head */}
    <mesh position={[0, 1.37, 0]}><cylinderGeometry args={[.08, .09, .12, 16]}/><Clay color={palette.skin}/></mesh>
    <group ref={head} position={[0, 1.42, 0]}>
      {/* long hair behind */}
      <mesh position={[0, .08, -.18]} scale={[1, 1.15, .55]}><sphereGeometry args={[.5, 28, 20]}/><Clay color={palette.hair}/></mesh>
      <mesh position={[0, -.22, -.26]} scale={[1, 1, .5]}><capsuleGeometry args={[.36, .3, 8, 20]}/><Clay color={palette.hair}/></mesh>
      {[-1, 1].map(s => <group key={s}>
        <mesh position={[s * .42, .02, .08]} rotation={[.15, 0, s * .12]}><capsuleGeometry args={[.11, .5, 6, 14]}/><Clay color={palette.hair}/></mesh>
        <mesh position={[s * .45, -.3, .12]} rotation={[.2, 0, s * -.2]}><sphereGeometry args={[.12, 14, 12]}/><Clay color={palette.hair}/></mesh>
      </group>)}
      {/* face */}
      <mesh position={[0, .42, 0]}><sphereGeometry args={[.5, 40, 32]}/><Clay color={palette.skin} rough={.7}/></mesh>
      <mesh geometry={capGeo} position={[0, .45, -.02]}><Clay color={palette.hair}/></mesh>
      <mesh geometry={bangGeo} position={[0, .45, .005]}><Clay color={palette.hair}/></mesh>
      <group ref={eyes} position={[0, .4, 0]}>
        {[-1, 1].map(s => <group key={s} position={[s * .17, 0, .455]}>
          <mesh scale={[1, 1.25, .45]}><sphereGeometry args={[.06, 16, 12]}/><meshStandardMaterial color={palette.eye} roughness={.3}/></mesh>
          <mesh position={[.02, .025, .03]}><sphereGeometry args={[.017, 8, 8]}/><meshBasicMaterial color="#ffffff"/></mesh>
        </group>)}
      </group>
      {[-1, 1].map(s => <mesh key={s} position={[s * .29, .3, .39]} rotation={[0, s * .6, 0]} scale={[1, .6, .3]}><sphereGeometry args={[.075, 14, 10]}/><meshStandardMaterial color={palette.blush} transparent opacity={.7} roughness={1}/></mesh>)}
      <mesh position={[0, .35, .5]}><sphereGeometry args={[.025, 10, 8]}/><Clay color="#e9b294"/></mesh>
      <mesh geometry={smileGeo} position={[0, .27, .47]} rotation={[.25, 0, Math.PI]}><Clay color={palette.tie}/></mesh>
      {[-1, 1].map(s => <mesh key={s} position={[s * .5, .24, .02]} rotation={[0, Math.PI / 2, 0]}><torusGeometry args={[.045, .012, 8, 18]}/><meshStandardMaterial color={palette.silver} metalness={.8} roughness={.25}/></mesh>)}
      {shades && <group position={[0, .42, .5]}>
        {[-1, 1].map(s => <mesh key={s} position={[s * .17, 0, 0]}><boxGeometry args={[.22, .13, .04]}/><meshStandardMaterial color="#141214" roughness={.15} metalness={.3}/></mesh>)}
        <mesh><boxGeometry args={[.14, .025, .03]}/><meshStandardMaterial color="#141214"/></mesh>
      </group>}
    </group>
  </group>
}
