import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { STATS } from '../config.js'
import { useReveals } from '../lib/hooks.js'
import { Words } from './Split.jsx'
import Floaters from './Floaters.jsx'

const FLOATS = [
  { glyph: '{ }', x: '6%', y: '14%', size: '5rem', speed: 1.1, rot: 18 },
  { glyph: '</>', x: '84%', y: '62%', size: '4rem', speed: 0.7, rot: -14 },
]

export default function Stats() {
  const root = useRef(null)
  useReveals(root)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const el = root.current
      el.querySelectorAll('.stat').forEach((stat, i) => {
        const num = stat.querySelector('.stat__num')
        const target = STATS[i].value
        const o = { v: 0 }
        num.textContent = '0'

        gsap.to(o, {
          v: target,
          duration: 1.8,
          ease: 'power2.out',
          onUpdate: () => {
            num.textContent = String(Math.round(o.v))
          },
          scrollTrigger: { trigger: stat, start: 'top 80%', toggleActions: 'play none none reverse' },
        })

        // Rakamlar kaydırdıkça farklı hızlarda süzülür
        gsap.fromTo(
          num,
          { yPercent: 18 + i * 14, scale: 0.85 },
          {
            yPercent: -18 - i * 14,
            scale: 1.05,
            ease: 'none',
            scrollTrigger: { trigger: stat, start: 'top bottom', end: 'bottom top', scrub: true },
          },
        )
        gsap.from(stat.querySelector('.stat__text'), {
          opacity: 0,
          y: 30,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: { trigger: stat, start: 'top 75%', toggleActions: 'play none none reverse' },
        })
      })

      return () => {
        el.querySelectorAll('.stat__num').forEach((n, i) => {
          n.textContent = String(STATS[i].value)
        })
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="stats" id="rakamlar" ref={root}>
      <Floaters items={FLOATS} />
      <div className="wrap">
        <Words as="h2" className="section__title" text="Kısa ve net bir çalışma biçimi" />
        <div className="stats__grid">
          {STATS.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat__head">
                <span className="stat__num">{s.value}</span>
                <span className="stat__label">{s.label}</span>
              </div>
              <p className="stat__text">{s.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
