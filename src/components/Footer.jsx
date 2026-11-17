import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { COMPANY } from '../config.js'
import { Chars } from './Split.jsx'
import Btn from './Btn.jsx'

export default function Footer() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const el = root.current
      // Dev yazı harf harf yükselir; kaydırma sonuna doğru hafifçe genişler.
      gsap.from(el.querySelectorAll('.ch'), {
        yPercent: 110,
        rotation: 6,
        duration: 1.3,
        ease: 'power4.out',
        stagger: 0.08,
        scrollTrigger: { trigger: el.querySelector('.footer__mark'), start: 'top 95%', toggleActions: 'play none none reverse' },
      })
      gsap.fromTo(
        el.querySelector('.footer__mark'),
        { letterSpacing: '-0.08em' },
        {
          letterSpacing: '-0.02em',
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom bottom', scrub: true },
        },
      )
    })
    return () => mm.revert()
  }, [])

  return (
    <footer className="footer" ref={root}>
      <div className="wrap">
        <div className="footer__top">
          <p className="footer__line">Bir sonraki web uygulamanı birlikte kuralım.</p>
          <Btn href="#top" variant="ghost">
            Başa dön
          </Btn>
        </div>
        <div className="footer__mark" aria-label="Hooks">
          <span className="footer__clip">
            <Chars text="HOOKS" />
          </span>
        </div>
        <div className="footer__base">
          <a className="footer__brand" href="#top" onClick={(e) => e.preventDefault()}>
            <img src="/logo-mark.png" alt="" width="30" height="27" />
            <span>{COMPANY}</span>
          </a>
          <p>© {new Date().getFullYear()} {COMPANY}. Yalnızca web uygulamaları.</p>
        </div>
      </div>
    </footer>
  )
}
