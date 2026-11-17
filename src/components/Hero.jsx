import { useEffect, useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { Chars } from './Split.jsx'
import Btn from './Btn.jsx'

export default function Hero({ ready }) {
  const root = useRef(null)
  const introRef = useRef(null)

  // Başlangıç durumu: harfler maskenin altında bekler.
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const el = root.current
      const chars = el.querySelectorAll('.ch')
      const lines = el.querySelectorAll('.hero__line')
      const rest = el.querySelectorAll('.hero__lead, .hero__actions, .hero__cue, .hero__hint')

      gsap.set(chars, { yPercent: 125, rotation: 8, transformOrigin: '0% 100%' })
      gsap.set(rest, { opacity: 0, y: 28 })

      let scatter
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          // Maske artık gerekmiyor; harfler kaydırdıkça dağılsın.
          gsap.set(lines, { overflow: 'visible' })
          scatter = gsap.to(chars, {
            x: () => gsap.utils.random(-380, 380),
            y: () => gsap.utils.random(-260, 140),
            rotation: () => gsap.utils.random(-140, 140),
            scale: () => gsap.utils.random(0.4, 1.9),
            opacity: 0,
            ease: 'power2.in',
            scrollTrigger: {
              trigger: el,
              start: 'top top',
              end: 'bottom 25%',
              scrub: true,
              invalidateOnRefresh: true,
            },
          })
        },
      })
      tl.to(chars, { yPercent: 0, rotation: 0, duration: 1.2, ease: 'power4.out', stagger: 0.035 }, 0)
        .to(rest, { opacity: 1, y: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12 }, 0.7)
      introRef.current = tl

      // İçerik kaydırdıkça yavaşça yukarı çıkar ve silikleşir.
      gsap.to('.hero__inner', {
        yPercent: -18,
        ease: 'none',
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: true },
      })

      return () => {
        tl.kill()
        if (scatter) scatter.kill()
        introRef.current = null
      }
    })
    return () => mm.revert()
  }, [])

  useEffect(() => {
    if (ready && introRef.current) introRef.current.play()
  }, [ready])

  return (
    <section className="hero" id="top" ref={root}>
      <div className="wrap hero__inner">
        <h1 className="hero__title" aria-label="Web uygulamaları. Baştan sona.">
          <span className="hero__line">
            <Chars text="Web uygulamaları." />
          </span>
          <span className="hero__line">
            <Chars text="Baştan sona." />
          </span>
        </h1>
        <p className="hero__lead">
          Hooks Software Solutions yalnızca web uygulaması geliştirir. Arayüzü, sunucuyu ve veritabanını tek elden
          kurar, yayına alır ve bakımını yapar.
        </p>
        <div className="hero__actions">
          <Btn href="#iletisim">Projeni anlat</Btn>
          <Btn href="#hizmetler" variant="ghost">
            Neler yapıyoruz
          </Btn>
        </div>
      </div>
      <div className="hero__cue" aria-hidden="true">
        <span className="hero__cue-line" />
        Kaydır
      </div>
      <p className="hero__hint">İmleci oynat: ağdaki düğümler sana bağlanır.</p>
    </section>
  )
}
