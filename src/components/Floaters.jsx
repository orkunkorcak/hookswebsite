import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'

/**
 * Üst öğenin içinde, kaydırdıkça farklı hızlarda süzülen kod simgeleri (parallax).
 * Üst öğe position: relative olmalıdır.
 */
export default function Floaters({ items }) {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const parent = root.current.parentElement
      root.current.querySelectorAll('.floater').forEach((el) => {
        const speed = parseFloat(el.dataset.speed) || 1
        const rot = parseFloat(el.dataset.rot) || 0
        gsap.fromTo(
          el,
          { y: 140 * speed, rotation: -rot },
          {
            y: -140 * speed,
            rotation: rot,
            ease: 'none',
            scrollTrigger: { trigger: parent, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <div className="floaters" ref={root} aria-hidden="true">
      {items.map((it) => (
        <span
          key={it.glyph + it.x + it.y}
          className={`floater${it.solid ? ' floater--solid' : ''}`}
          data-speed={it.speed}
          data-rot={it.rot}
          style={{ left: it.x, top: it.y, fontSize: it.size }}
        >
          {it.glyph}
        </span>
      ))}
    </div>
  )
}
