import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger, MOTION_OK } from '../lib/gsap.js'
import { useReveals } from '../lib/hooks.js'
import { Words } from './Split.jsx'

const STEPS = [
  {
    title: 'Konuşma',
    text: 'İhtiyacını, kullanıcılarını ve mevcut işleyişi dinleriz. Ne yapılacağına ve ne yapılmayacağına birlikte karar veririz.',
  },
  {
    title: 'Taslak',
    text: 'Kapsamı, ekran akışını ve sürüm planını yazılı olarak sunarız. Kod yazmadan önce onayına sunulur.',
  },
  {
    title: 'Geliştirme',
    text: 'Çalışan parçaları aralıklarla gösteririz. Eksikleri ve değişiklikleri proje bitmeden görür, düzeltiriz.',
  },
  {
    title: 'Yayın ve bakım',
    text: 'Uygulamayı yayına alırız. Sonrasında izleme, güncelleme ve yeni özellikler için devam ederiz.',
  },
]

export default function Process() {
  const root = useRef(null)
  const list = useRef(null)
  useReveals(root)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const ol = list.current
      // Kaydırdıkça yol çizgisi uzar
      gsap.fromTo(
        ol.querySelector('.trace__line-fill'),
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: '50% 0%',
          ease: 'none',
          scrollTrigger: { trigger: ol, start: 'top 60%', end: 'bottom 60%', scrub: true },
        },
      )
      // Çizgi bir adıma ulaşınca o adım yanar
      const triggers = Array.from(ol.querySelectorAll('li')).map((li) =>
        ScrollTrigger.create({
          trigger: li,
          start: 'top 60%',
          toggleClass: { targets: li, className: 'is-active' },
        }),
      )
      return () => triggers.forEach((t) => t.kill())
    })
    mm.add('(prefers-reduced-motion: reduce)', () => {
      list.current.querySelectorAll('li').forEach((li) => li.classList.add('is-active'))
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="process" id="surec" ref={root}>
      <div className="wrap split">
        <div className="split__sticky">
          <Words as="h2" className="section__title" text="Bir proje nasıl ilerler" />
          <p className="section__intro" data-reveal="fade">
            Dört adım. Her adımın sonunda elinde somut bir çıktı olur.
          </p>
        </div>

        <ol className="trace" ref={list}>
          <span className="trace__line" aria-hidden="true">
            <span className="trace__line-fill" />
          </span>
          {STEPS.map((s, i) => (
            <li key={s.title}>
              <span className="trace__node" aria-hidden="true">
                {i + 1}
              </span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
