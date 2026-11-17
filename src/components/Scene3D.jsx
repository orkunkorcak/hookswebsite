import { useEffect, useRef } from 'react'
import {
  WebGLRenderer,
  Scene,
  PerspectiveCamera,
  Group,
  BufferGeometry,
  BufferAttribute,
  DynamicDrawUsage,
  Points,
  PointsMaterial,
  LineSegments,
  LineBasicMaterial,
  LineLoop,
  AdditiveBlending,
  CanvasTexture,
  Vector3,
} from 'three'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { scene as S } from '../lib/state.js'

const NODES = 110
const LINK = 2.7
const CURSOR_LINK = 4.6
const MAX_SEGMENTS = 1600
const CYAN = [0.18, 0.72, 0.85]
const ORANGE = [0.95, 0.63, 0.24]

function glowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const g = c.getContext('2d')
  const grad = g.createRadialGradient(32, 32, 0, 32, 32, 32)
  grad.addColorStop(0, 'rgba(255,255,255,1)')
  grad.addColorStop(0.22, 'rgba(255,255,255,0.9)')
  grad.addColorStop(0.5, 'rgba(255,255,255,0.18)')
  grad.addColorStop(1, 'rgba(255,255,255,0)')
  g.fillStyle = grad
  g.fillRect(0, 0, 64, 64)
  return new CanvasTexture(c)
}

// Logodaki yuvarlatılmış kare çerçeve.
function roundedSquare(half, radius, steps = 10) {
  const pts = []
  const corners = [
    [half - radius, half - radius, 0],
    [-half + radius, half - radius, 90],
    [-half + radius, -half + radius, 180],
    [half - radius, -half + radius, 270],
  ]
  for (const [cx, cy, start] of corners) {
    for (let i = 0; i <= steps; i++) {
      const a = ((start + (i / steps) * 90) * Math.PI) / 180
      pts.push(cx + Math.cos(a) * radius, cy + Math.sin(a) * radius, 0)
    }
  }
  return new Float32Array(pts)
}

export default function Scene3D({ ready }) {
  const canvasRef = useRef(null)

  // Açılışta düğümler tek noktadan patlayarak dağılır.
  useEffect(() => {
    if (!ready) return
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.to(S, { spread: 1, duration: 2.8, ease: 'expo.out' })
      gsap.to(S, { frame: 1, duration: 2.4, delay: 0.2, ease: 'elastic.out(1, 0.6)' })
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      S.spread = 1
      S.frame = 1
    })
    return () => mm.revert()
  }, [ready])

  useEffect(() => {
    const canvas = canvasRef.current
    let renderer
    try {
      renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' })
    } catch {
      canvas.style.display = 'none'
      return undefined
    }
    renderer.setClearColor(0x000000, 0)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75))

    const scene = new Scene()
    const camera = new PerspectiveCamera(50, 1, 0.1, 100)
    const world = new Group()
    scene.add(world)

    const sprite = glowTexture()

    // --- Düğümler ---
    const base = new Float32Array(NODES * 3)
    const phase = new Float32Array(NODES)
    const warm = new Uint8Array(NODES)
    for (let i = 0; i < NODES; i++) {
      const r = 5.2 * Math.cbrt(Math.random())
      const th = Math.random() * Math.PI * 2
      const ph = Math.acos(2 * Math.random() - 1)
      base[i * 3] = r * Math.sin(ph) * Math.cos(th) * 1.15
      base[i * 3 + 1] = r * Math.cos(ph) * 0.9
      base[i * 3 + 2] = r * Math.sin(ph) * Math.sin(th)
      phase[i] = Math.random() * Math.PI * 2
      warm[i] = Math.random() < 0.25 ? 1 : 0
    }
    const nodePos = new Float32Array(NODES * 3)
    const nodeCol = new Float32Array(NODES * 3)
    const nodeGeo = new BufferGeometry()
    const nodePosAttr = new BufferAttribute(nodePos, 3).setUsage(DynamicDrawUsage)
    const nodeColAttr = new BufferAttribute(nodeCol, 3).setUsage(DynamicDrawUsage)
    nodeGeo.setAttribute('position', nodePosAttr)
    nodeGeo.setAttribute('color', nodeColAttr)
    const nodeMat = new PointsMaterial({
      size: 0.46,
      map: sprite,
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const nodes = new Points(nodeGeo, nodeMat)
    nodes.frustumCulled = false
    world.add(nodes)

    // --- Bağlantı çizgileri ---
    const segPos = new Float32Array(MAX_SEGMENTS * 2 * 3)
    const segCol = new Float32Array(MAX_SEGMENTS * 2 * 3)
    const lineGeo = new BufferGeometry()
    const segPosAttr = new BufferAttribute(segPos, 3).setUsage(DynamicDrawUsage)
    const segColAttr = new BufferAttribute(segCol, 3).setUsage(DynamicDrawUsage)
    lineGeo.setAttribute('position', segPosAttr)
    lineGeo.setAttribute('color', segColAttr)
    const lineMat = new LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const lines = new LineSegments(lineGeo, lineMat)
    lines.frustumCulled = false
    world.add(lines)

    // --- İmleç düğümü ---
    const cursorPos = new Float32Array(3)
    const cursorGeo = new BufferGeometry()
    const cursorAttr = new BufferAttribute(cursorPos, 3).setUsage(DynamicDrawUsage)
    cursorGeo.setAttribute('position', cursorAttr)
    const cursorMat = new PointsMaterial({
      size: 0.8,
      map: sprite,
      color: 0xf2a03d,
      transparent: true,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const cursorPoint = new Points(cursorGeo, cursorMat)
    cursorPoint.frustumCulled = false
    world.add(cursorPoint)

    // --- Logo çerçeveleri ---
    const frames = new Group()
    const frameMats = []
    ;[
      [3.0, 1.2, 0.55],
      [3.45, 1.4, 0.35],
      [3.9, 1.6, 0.2],
    ].forEach(([half, radius, opacity]) => {
      const geo = new BufferGeometry()
      geo.setAttribute('position', new BufferAttribute(roundedSquare(half, radius), 3))
      const mat = new LineBasicMaterial({
        color: 0x2fb7d9,
        transparent: true,
        opacity,
        depthWrite: false,
        blending: AdditiveBlending,
      })
      mat.userData.base = opacity
      frameMats.push(mat)
      const loop = new LineLoop(geo, mat)
      loop.frustumCulled = false
      frames.add(loop)
    })
    world.add(frames)

    // --- Uzaktaki toz ---
    const DUST = 900
    const dustPos = new Float32Array(DUST * 3)
    for (let i = 0; i < DUST; i++) {
      dustPos[i * 3] = (Math.random() - 0.5) * 34
      dustPos[i * 3 + 1] = (Math.random() - 0.5) * 22
      dustPos[i * 3 + 2] = (Math.random() - 0.5) * 24 - 4
    }
    const dustGeo = new BufferGeometry()
    dustGeo.setAttribute('position', new BufferAttribute(dustPos, 3))
    const dustMat = new PointsMaterial({
      size: 0.07,
      color: 0x7fa6cc,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
      blending: AdditiveBlending,
    })
    const dust = new Points(dustGeo, dustMat)
    dust.frustumCulled = false
    scene.add(dust)

    // --- Boyut ---
    let lastW = 0
    let lastH = 0
    const resize = (force) => {
      const w = window.innerWidth
      const h = window.innerHeight
      // Mobilde adres çubuğu yüzünden oluşan küçük yükseklik değişimlerini yok say.
      if (!force && w === lastW && Math.abs(h - lastH) < 120) return
      lastW = w
      lastH = h
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize(true)

    // --- İmleç ---
    const onMove = (e) => {
      S.pointerX = (e.clientX / window.innerWidth) * 2 - 1
      S.pointerY = -((e.clientY / window.innerHeight) * 2 - 1)
      S.pointerOn = e.pointerType === 'touch' ? 0 : 1
    }
    const onLeave = () => {
      S.pointerOn = 0
    }

    // --- Her kare ---
    const cur = { x: 0, y: 0, glow: 0 }
    let yaw = 0
    const v = new Vector3()
    const dir = new Vector3()
    const local = new Vector3()

    const frame = (time, deltaMs) => {
      const dt = Math.min(deltaMs, 50) / 1000
      const sp = S.spread
      const portrait = camera.aspect < 1

      cur.x += (S.pointerX - cur.x) * 0.06
      cur.y += (S.pointerY - cur.y) * 0.06
      cur.glow += (S.pointerOn - cur.glow) * 0.08

      yaw += dt * 0.09 * S.speed
      world.rotation.y = yaw + cur.x * 0.35
      world.rotation.x = S.rotX * 0.45 - cur.y * 0.2
      world.position.set(portrait ? 0 : S.x, S.y, 0)
      camera.position.z = 11 + S.z + (portrait ? 5 : 0)
      frames.scale.setScalar(Math.max(S.frame, 0.001))
      frames.children.forEach((f, i) => {
        f.rotation.z = time * 0.05 * (i + 1) * (i % 2 ? -1 : 1)
      })
      dust.rotation.y = time * 0.01
      dust.rotation.x = S.rotX * 0.2

      nodeMat.opacity = S.bright
      lineMat.opacity = S.bright
      cursorMat.opacity = S.bright * cur.glow
      dustMat.opacity = 0.25 + 0.3 * S.bright
      frameMats.forEach((m) => {
        m.opacity = m.userData.base * S.bright
      })

      // Düğüm konumları ve renkleri
      const mixR = CYAN[0] + (ORANGE[0] - CYAN[0]) * S.mix
      const mixG = CYAN[1] + (ORANGE[1] - CYAN[1]) * S.mix
      const mixB = CYAN[2] + (ORANGE[2] - CYAN[2]) * S.mix
      for (let i = 0; i < NODES; i++) {
        const k = i * 3
        const p = phase[i]
        nodePos[k] = base[k] * sp + Math.sin(time * 0.5 + p) * 0.35 * sp
        nodePos[k + 1] = base[k + 1] * sp + Math.cos(time * 0.42 + p * 1.3) * 0.35 * sp
        nodePos[k + 2] = base[k + 2] * sp + Math.sin(time * 0.33 + p * 0.7) * 0.35 * sp
        if (warm[i]) {
          nodeCol[k] = ORANGE[0]
          nodeCol[k + 1] = ORANGE[1]
          nodeCol[k + 2] = ORANGE[2]
        } else {
          nodeCol[k] = mixR
          nodeCol[k + 1] = mixG
          nodeCol[k + 2] = mixB
        }
      }
      nodePosAttr.needsUpdate = true
      nodeColAttr.needsUpdate = true

      // İmlecin 3B konumu (z = 0 düzlemine izdüşüm)
      camera.updateMatrixWorld()
      world.updateMatrixWorld(true)
      v.set(S.pointerX, S.pointerY, 0.5).unproject(camera)
      dir.copy(v).sub(camera.position).normalize()
      const t = -camera.position.z / dir.z
      v.copy(camera.position).addScaledVector(dir, t)
      local.copy(v)
      world.worldToLocal(local)
      cursorPos[0] = local.x
      cursorPos[1] = local.y
      cursorPos[2] = local.z
      cursorAttr.needsUpdate = true

      // Bağlantılar
      let n = 0
      const reach = LINK * sp
      const reach2 = reach * reach
      for (let i = 0; i < NODES && n < MAX_SEGMENTS; i++) {
        const ax = nodePos[i * 3]
        const ay = nodePos[i * 3 + 1]
        const az = nodePos[i * 3 + 2]
        for (let j = i + 1; j < NODES && n < MAX_SEGMENTS; j++) {
          const dx = ax - nodePos[j * 3]
          const dy = ay - nodePos[j * 3 + 1]
          const dz = az - nodePos[j * 3 + 2]
          const d2 = dx * dx + dy * dy + dz * dz
          if (d2 < reach2) {
            const f = (1 - Math.sqrt(d2) / reach) * 0.75
            const o = n * 6
            segPos[o] = ax
            segPos[o + 1] = ay
            segPos[o + 2] = az
            segPos[o + 3] = nodePos[j * 3]
            segPos[o + 4] = nodePos[j * 3 + 1]
            segPos[o + 5] = nodePos[j * 3 + 2]
            const r = (CYAN[0] + (ORANGE[0] - CYAN[0]) * S.mix * 0.6) * f
            const g = (CYAN[1] + (ORANGE[1] - CYAN[1]) * S.mix * 0.6) * f
            const b = (CYAN[2] + (ORANGE[2] - CYAN[2]) * S.mix * 0.6) * f
            segCol[o] = segCol[o + 3] = r
            segCol[o + 1] = segCol[o + 4] = g
            segCol[o + 2] = segCol[o + 5] = b
            n++
          }
        }
      }
      if (cur.glow > 0.02) {
        const cr = CURSOR_LINK * Math.max(sp, 0.001)
        for (let i = 0; i < NODES && n < MAX_SEGMENTS; i++) {
          const dx = nodePos[i * 3] - local.x
          const dy = nodePos[i * 3 + 1] - local.y
          const dz = nodePos[i * 3 + 2] - local.z
          const d = Math.sqrt(dx * dx + dy * dy + dz * dz)
          if (d < cr) {
            const f = (1 - d / cr) * cur.glow
            const o = n * 6
            segPos[o] = nodePos[i * 3]
            segPos[o + 1] = nodePos[i * 3 + 1]
            segPos[o + 2] = nodePos[i * 3 + 2]
            segPos[o + 3] = local.x
            segPos[o + 4] = local.y
            segPos[o + 5] = local.z
            segCol[o] = segCol[o + 3] = ORANGE[0] * f
            segCol[o + 1] = segCol[o + 4] = ORANGE[1] * f
            segCol[o + 2] = segCol[o + 5] = ORANGE[2] * f
            n++
          }
        }
      }
      segPosAttr.needsUpdate = true
      segColAttr.needsUpdate = true
      lineGeo.setDrawRange(0, n * 2)

      renderer.render(scene, camera)
    }

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const onResize = () => {
      resize(false)
      if (reduce) frame(0, 16)
    }
    window.addEventListener('resize', onResize)

    if (reduce) {
      S.spread = 1
      S.frame = 1
      frame(0, 16)
    } else {
      window.addEventListener('pointermove', onMove, { passive: true })
      document.documentElement.addEventListener('mouseleave', onLeave)
      gsap.ticker.add(frame)
    }

    return () => {
      gsap.ticker.remove(frame)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      ;[nodeGeo, lineGeo, cursorGeo, dustGeo].forEach((g) => g.dispose())
      ;[nodeMat, lineMat, cursorMat, dustMat, ...frameMats].forEach((m) => m.dispose())
      frames.children.forEach((c) => c.geometry.dispose())
      sprite.dispose()
      renderer.dispose()
    }
  }, [])

  return <canvas ref={canvasRef} className="scene" aria-hidden="true" />
}
