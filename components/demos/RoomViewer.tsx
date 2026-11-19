'use client'
import {useEffect, useRef, useState} from 'react'

type Mode = 'panorama' | 'room'
type Room = {height: number; polygon: [number, number][]}

export default function RoomViewer() {
  const host = useRef<HTMLDivElement>(null)
  const api = useRef<{setMode: (m: Mode) => void} | null>(null)
  const [mode, setMode] = useState<Mode>('panorama')
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'failed'>('idle')
  const [room, setRoom] = useState<Room | null>(null)

  useEffect(() => {
    const el = host.current
    if (!el) return
    let disposed = false
    let cleanup = () => {}
    const start = async () => {
      setState('loading')
      try {
        const test = document.createElement('canvas')
        if (!(test.getContext('webgl2') || test.getContext('webgl'))) throw new Error('no webgl')
        const [THREE, {OrbitControls}, data] = await Promise.all([
          import('three'),
          import('three/examples/jsm/controls/OrbitControls.js'),
          fetch('/media/work/myroom-room.json').then(r => r.json() as Promise<Room>)
        ])
        if (disposed) return
        setRoom(data)
        const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches
        const renderer = new THREE.WebGLRenderer({antialias: true, alpha: false, powerPreference: 'low-power'})
        renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75))
        renderer.outputColorSpace = THREE.SRGBColorSpace
        renderer.setClearColor(0xefe6d8)
        el.appendChild(renderer.domElement)
        renderer.domElement.setAttribute('aria-hidden', 'true')
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(70, 1, .05, 200)
        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true

        // Panorama: the real sample input used by MyRoom's pipeline
        const tex = await new THREE.TextureLoader().loadAsync(innerWidth < 700 ? '/media/work/myroom-panorama-2k.webp' : '/media/work/myroom-panorama.webp')
        if (disposed) { renderer.dispose(); return }
        tex.colorSpace = THREE.SRGBColorSpace
        const sphereGeo = new THREE.SphereGeometry(40, 64, 32)
        sphereGeo.scale(-1, 1, 1)
        const sphere = new THREE.Mesh(sphereGeo, new THREE.MeshBasicMaterial({map: tex}))
        scene.add(sphere)

        // Room: room.json polygon (metres, X–Z plane) extruded to ceiling height
        const group = new THREE.Group()
        const pts = data.polygon
        const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length
        const cz = pts.reduce((s, p) => s + p[1], 0) / pts.length
        const lime = new THREE.Color('#c4304a')
        const wallMat = new THREE.MeshBasicMaterial({color: 0x7c1f2c, transparent: true, opacity: .08, side: THREE.DoubleSide, depthWrite: false})
        const lineMat = new THREE.LineBasicMaterial({color: lime})
        pts.forEach((p, i) => {
          const q = pts[(i + 1) % pts.length]
          const dx = q[0] - p[0], dz = q[1] - p[1]
          const len = Math.hypot(dx, dz)
          const wall = new THREE.Mesh(new THREE.PlaneGeometry(len, data.height), wallMat)
          wall.position.set((p[0] + q[0]) / 2 - cx, data.height / 2, (p[1] + q[1]) / 2 - cz)
          wall.rotation.y = -Math.atan2(dz, dx)
          group.add(wall)
          const edges = new THREE.LineSegments(new THREE.EdgesGeometry(wall.geometry), lineMat)
          edges.position.copy(wall.position); edges.rotation.copy(wall.rotation)
          group.add(edges)
        })
        const shape = new THREE.Shape(pts.map(([x, z]) => new THREE.Vector2(x - cx, -(z - cz))))
        const floor = new THREE.Mesh(new THREE.ShapeGeometry(shape), new THREE.MeshBasicMaterial({color: lime, transparent: true, opacity: .16, side: THREE.DoubleSide}))
        floor.rotation.x = -Math.PI / 2
        group.add(floor)
        const grid = new THREE.GridHelper(10, 20, 0xc9b9a4, 0xddd0be)
        group.add(grid)
        scene.add(group)

        const apply = (m: Mode) => {
          sphere.visible = m === 'panorama'
          group.visible = m === 'room'
          if (m === 'panorama') {
            camera.fov = 72; camera.position.set(0, 0, .1); controls.target.set(0, 0, 0)
            controls.enableZoom = false; controls.enablePan = false; controls.rotateSpeed = -.35
            controls.autoRotate = !reduced; controls.autoRotateSpeed = .35
          } else {
            camera.fov = 45; camera.position.set(5.6, 4.6, 7.2); controls.target.set(0, data.height / 2.4, 0)
            controls.enableZoom = true; controls.enablePan = false; controls.rotateSpeed = .8
            controls.minDistance = 4; controls.maxDistance = 16
            controls.autoRotate = !reduced; controls.autoRotateSpeed = .8
          }
          camera.updateProjectionMatrix(); controls.update()
        }
        api.current = {setMode: apply}
        apply('panorama')

        const resize = () => {
          const {width, height} = el.getBoundingClientRect()
          renderer.setSize(width, height, false)
          camera.aspect = width / Math.max(1, height); camera.updateProjectionMatrix()
        }
        const ro = new ResizeObserver(resize); ro.observe(el); resize()
        let visible = true, raf = 0
        const loop = () => { raf = requestAnimationFrame(loop); if (!visible) return; controls.update(); renderer.render(scene, camera) }
        const vis = new IntersectionObserver(([e]) => { visible = e.isIntersecting })
        vis.observe(el)
        controls.addEventListener('start', () => { controls.autoRotate = false })
        loop()
        setState('ready')
        cleanup = () => {
          cancelAnimationFrame(raf); ro.disconnect(); vis.disconnect(); controls.dispose()
          scene.traverse(o => { const m = o as unknown as {geometry?: {dispose?: () => void}}; m.geometry?.dispose?.() })
          tex.dispose(); renderer.dispose(); renderer.domElement.remove()
        }
      } catch {
        if (!disposed) setState('failed')
      }
    }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { io.disconnect(); start() } }, {rootMargin: '200px'})
    io.observe(el)
    return () => { disposed = true; io.disconnect(); cleanup() }
  }, [])

  useEffect(() => { api.current?.setMode(mode) }, [mode])

  const area = room ? Math.abs(room.polygon.reduce((s, p, i) => { const q = room.polygon[(i + 1) % room.polygon.length]; return s + p[0] * q[1] - q[0] * p[1] }, 0) / 2) : 0

  return <div className="demo room">
    <div className="room-stage" ref={host}>
      {state !== 'ready' && <img className="room-poster" src="/media/work/myroom-panorama-2k.webp" alt="Equirectangular 360° panorama of an empty room, the sample input of MyRoom" width={2048} height={1024}/>}
      {state === 'loading' && <span className="room-status">Loading scene…</span>}
      {state === 'failed' && <span className="room-status">3D is not available on this device, so the input panorama is shown instead.</span>}
      {state === 'ready' && <span className="room-hint">{mode === 'panorama' ? 'Drag to look around' : 'Drag to orbit · scroll to zoom'}</span>}
    </div>
    <div className="demo-controls">
      <div className="seg" role="radiogroup" aria-label="View">
        <button role="radio" aria-checked={mode === 'panorama'} className={mode === 'panorama' ? 'on' : ''} onClick={() => setMode('panorama')} disabled={state !== 'ready'}>1 · Input panorama</button>
        <button role="radio" aria-checked={mode === 'room'} className={mode === 'room' ? 'on' : ''} onClick={() => setMode('room')} disabled={state !== 'ready'}>2 · Reconstructed room</button>
      </div>
      {room && <code className="room-data">room.json · {room.polygon.length} corners · {area.toFixed(2)} m² · h {room.height} m</code>}
    </div>
  </div>
}
