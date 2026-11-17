import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'


const ROWS = [
  [
    "React",
    "JavaScript",
    "Node.js",
    "Express.js",
    "MongoDB",
    "Mongoose",
    "Redux Toolkit",
    "REST API",
    "Vite",
    "React Router",
    "Axios",
    "Formik",
    "Yup",
    "HTML5",
    "CSS3",
    "Three.js",
    "GSAP",
    "iyzico",
    "JWT",
    "Cloudflare",
  ],
  [
    "Full-Stack Development",
    "Web Application",
    "Frontend Development",
    "Backend Development",
    "Database Architecture",
    "API Integration",
    "Payment Integration",
    "Authentication",
    "Responsive Design",
    "Performance Optimization",
    "Security",
    "UI/UX",
    "Deployment",
    "Scalable Architecture",
    "Modern Web Technologies",
  ],
];


function Set({ items, hidden }) {
  return (
    <div className="marquee__set" aria-hidden={hidden ? 'true' : undefined}>
      {items.map((t) => (
        <span className="marquee__unit" key={t}>
          <span className="marquee__item">{t}</span>
          <i className="marquee__dot" />
        </span>
      ))}
    </div>
  )
}

/** İki sonsuz şerit. Kaydırma hızına göre hızlanır, yönüne göre yön değiştirir ve eğilir. */
export default function Marquee() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const rows = Array.from(root.current.querySelectorAll('.marquee__row')).map((row, i) => ({
        row,
        track: row.querySelector('.marquee__track'),
        dir: i % 2 === 0 ? -1 : 1,
        x: 0,
        w: 0,
      }))
      const measure = () => {
        rows.forEach((r) => {
          r.w = r.track.firstElementChild.offsetWidth
        })
      }
      measure()
      if (document.fonts && document.fonts.ready) document.fonts.ready.then(measure)
      window.addEventListener('resize', measure)

      let lastY = window.scrollY
      let boost = 0
      let scrollDir = 1
      const tick = (_time, deltaMs) => {
        const f = Math.min(deltaMs, 50) / 16.7
        const y = window.scrollY
        const v = y - lastY
        lastY = y
        boost += (Math.min(Math.abs(v), 90) / 90 * 7 - boost) * 0.08
        if (Math.abs(v) > 0.5) scrollDir = Math.sign(v)
        rows.forEach((r) => {
          r.x += r.dir * scrollDir * (0.7 + boost) * f * 1.6
          if (r.w) r.x = gsap.utils.wrap(-r.w, 0, r.x)
          gsap.set(r.track, { x: r.x, skewX: -r.dir * scrollDir * boost * 0.9 })
        })
      }
      gsap.ticker.add(tick)
      return () => {
        gsap.ticker.remove(tick)
        window.removeEventListener('resize', measure)
      }
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="marquee" ref={root} aria-hidden="true">
      {ROWS.map((items, i) => (
        <div className={`marquee__row${i % 2 ? ' marquee__row--outline' : ''}`} key={i}>
          <div className="marquee__track">
            <Set items={items} />
            <Set items={items} hidden />
            <Set items={items} hidden />
          </div>
        </div>
      ))}
    </section>
  )
}
