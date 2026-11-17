import { useEffect, useRef } from 'react'
import { gsap } from '../lib/gsap.js'
import './Preloader.css'

export default function Preloader({ onDone }) {
  const root = useRef(null)

  useEffect(() => {
    const el = root.current
    const num = el.querySelector('.pre__count')
    const counter = { n: 0 }

    const ctx = gsap.context(() => {
      gsap
        .timeline()
        .from('.pre__mark', { scale: 0.55, opacity: 0, duration: 0.9, ease: 'back.out(1.8)' })
        .to(
          counter,
          {
            n: 100,
            duration: 1.7,
            ease: 'power2.inOut',
            onUpdate: () => {
              num.textContent = String(Math.round(counter.n)).padStart(3, '0')
            },
          },
          0.2,
        )
        .to('.pre__bar', { scaleX: 1, duration: 1.7, ease: 'power2.inOut' }, 0.2)
        .to('.pre__mark', { scale: 1.08, duration: 0.8, ease: 'sine.inOut', yoyo: true, repeat: 1 }, 0.9)
        .to('.pre__content', { opacity: 0, y: -24, duration: 0.45, ease: 'power2.in' }, '>0.1')
        .to(el, { yPercent: -100, duration: 0.95, ease: 'power4.inOut' }, '>')
        .add(onDone, '-=0.4')
        .set(el, { display: 'none' })
    }, el)

    return () => ctx.revert()
  }, [onDone])

  return (
    <div className="pre" ref={root} aria-hidden="true">
      <div className="pre__content">
        <img className="pre__mark" src="/logo-mark.png" alt="" width="96" height="96" />
        <p className="pre__name">Hooks Software Solutions</p>
        <div className="pre__track">
          <span className="pre__bar" />
        </div>
        <p className="pre__count">000</p>
      </div>
    </div>
  )
}
