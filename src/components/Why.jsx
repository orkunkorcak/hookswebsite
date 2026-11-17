import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { useReveals } from '../lib/hooks.js'
import { Words } from './Split.jsx'
import Floaters from './Floaters.jsx'

const STATEMENT =
  'Kanca, iki şeyi birbirine bağlayan parçadır. Biz de arayüzü sunucuya, iş ihtiyacını koda, yayını bakıma bağlıyoruz.'

const POINTS = [
  {
    title: 'Uçtan uca sorumluluk',
    text: 'Arayüz ile arka plan arasında kopukluk olmaz. Bir sorun çıktığında kime soracağını bilirsin.',
  },
  {
    title: 'Yalnızca web',
    text: 'Tek alanda çalıştığımız için kararları hızlı verir, bildiğimiz çözümleri tekrar tekrar sıfırdan denemeyiz.',
  },
  {
    title: 'Okunabilir kod',
    text: 'Kodu başkasının da anlayabileceği şekilde yazarız. Projenin sahibi sensin, kodu da teslim ederiz.',
  },
]

const FLOATS = [
  { glyph: '( )', x: '8%', y: '12%', size: '5rem', speed: 1, rot: 16 },
  { glyph: '#', x: '90%', y: '30%', size: '6rem', speed: 1.3, rot: -22 },
  { glyph: '</>', x: '78%', y: '82%', size: '4rem', speed: 0.6, rot: 12 },
]

export default function Why() {
  const root = useRef(null)
  useReveals(root)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const el = root.current
      // Cümle, kaydırdıkça kelime kelime aydınlanır
      gsap.from(el.querySelectorAll('.sw'), {
        opacity: 0.14,
        stagger: 0.12,
        ease: 'none',
        scrollTrigger: { trigger: el.querySelector('.statement'), start: 'top 78%', end: 'bottom 40%', scrub: true },
      })
      // Noktalar yanlardan değişen yönlerle gelir
      el.querySelectorAll('.point').forEach((p, i) => {
        gsap.from(p, {
          opacity: 0,
          x: (i - 1) * 90,
          y: 50,
          rotation: (i - 1) * 3,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: p, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
        gsap.from(p.querySelector('.point__rule'), {
          scaleX: 0,
          transformOrigin: '0% 50%',
          duration: 1.2,
          ease: 'power3.inOut',
          scrollTrigger: { trigger: p, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="why" id="neden-hooks" ref={root}>
      <Floaters items={FLOATS} />
      <div className="wrap">
        <Words as="h2" className="section__title" text="Neden Hooks" />
        <p className="statement" aria-label={STATEMENT}>
          {STATEMENT.split(' ').map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className="sw">{w}</span>{' '}
            </span>
          ))}
        </p>

        <div className="points">
          {POINTS.map((p) => (
            <div className="point" key={p.title}>
              <span className="point__rule" aria-hidden="true" />
              <h3>{p.title}</h3>
              <p>{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
