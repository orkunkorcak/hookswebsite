import { useLayoutEffect } from 'react'
import { gsap, ScrollTrigger, MOTION_OK } from '../lib/gsap.js'
import { scene as S } from '../lib/state.js'

// Arka plandaki 3B ağın her bölümdeki düzeni.
// x: yatay konum, z: kameranın geri çekilmesi, mix: renk (0 camgöbeği, 1 turuncu), bright: parlaklık
const LOOKS = [
  ['top', { x: 3.4, y: 0, z: 0, mix: 0, bright: 1, speed: 1 }],
  ['hizmetler', { x: 0, y: 0, z: 4, mix: 0.4, bright: 0.3, speed: 0.6 }],
  ['ornek', { x: 0, y: 0, z: 6, mix: 0.6, bright: 0.16, speed: 0.4 }],
  ['rakamlar', { x: -3.2, y: 0, z: 1, mix: 0.2, bright: 0.65, speed: 1.2 }],
  ['teknoloji', { x: 3.2, y: 0, z: 2, mix: 0.75, bright: 0.5, speed: 1 }],
  ['surec', { x: -3.2, y: 0, z: 2, mix: 0.3, bright: 0.45, speed: 0.9 }],
  ['neden-hooks', { x: 0, y: 0, z: 0, mix: 0.9, bright: 0.75, speed: 1.1 }],
  ['iletisim', { x: 0, y: 0, z: -2, mix: 0, bright: 1, speed: 1.6 }],
]

/** Bir bölüm ekrana girince 3B ağ yeni düzenine geçer. Görsel bir çıktısı yoktur. */
export default function SceneDirector() {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add(MOTION_OK, () => {
      const triggers = []
      LOOKS.forEach(([id, look], i) => {
        const el = document.getElementById(id)
        if (!el) return
        const next = LOOKS[i + 1] && document.getElementById(LOOKS[i + 1][0])
        triggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: 'top 60%',
            // Sabitlenen bölümlerde etkin aralık, bir sonraki bölümün başına kadar sürer.
            endTrigger: next || el,
            end: next ? 'top 60%' : 'bottom bottom',
            onToggle: (self) => {
              if (self.isActive) gsap.to(S, { ...look, duration: 1.8, ease: 'power3.inOut', overwrite: 'auto' })
            },
          }),
        )
      })

      // Sayfa aşağı indikçe ağ hafifçe eğilir.
      gsap.to(S, {
        rotX: 1.2,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 1 },
      })

      return () => triggers.forEach((t) => t.kill())
    })

    // Hareket kapalıysa ağ sabit, ilk düzende kalır.
    mm.add('(prefers-reduced-motion: reduce)', () => {
      Object.assign(S, LOOKS[0][1])
    })

    return () => mm.revert()
  }, [])

  return null
}
