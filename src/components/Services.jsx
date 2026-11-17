import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { useTilt } from '../lib/hooks.js'
import { Words } from './Split.jsx'

// Çizgi ikonlar: pathLength=1 sayesinde "çizilerek" belirir.
const ICONS = {
  panel: (
    <>
      <rect className="draw" pathLength="1" x="8" y="10" width="48" height="44" rx="5" />
      <path className="draw" pathLength="1" d="M8 22H56" />
      <path className="draw" pathLength="1" d="M22 22V54" />
    </>
  ),
  saas: (
    <>
      <path className="draw" pathLength="1" d="M32 8L56 20L32 32L8 20Z" />
      <path className="draw" pathLength="1" d="M8 32L32 44L56 32" />
      <path className="draw" pathLength="1" d="M8 44L32 56L56 44" />
    </>
  ),
  flow: (
    <>
      <circle className="draw" pathLength="1" cx="14" cy="16" r="6" />
      <circle className="draw" pathLength="1" cx="50" cy="16" r="6" />
      <circle className="draw" pathLength="1" cx="32" cy="48" r="6" />
      <path className="draw" pathLength="1" d="M20 16H44" />
      <path className="draw" pathLength="1" d="M17 21L28 43" />
      <path className="draw" pathLength="1" d="M47 21L36 43" />
    </>
  ),
  api: (
    <>
      <path className="draw" pathLength="1" d="M22 14L8 32L22 50" />
      <path className="draw" pathLength="1" d="M42 14L56 32L42 50" />
      <path className="draw" pathLength="1" d="M36 10L28 54" />
    </>
  ),
  booking: (
    <>
      <rect className="draw" pathLength="1" x="8" y="14" width="48" height="42" rx="5" />
      <path className="draw" pathLength="1" d="M8 26H56" />
      <path className="draw" pathLength="1" d="M20 8V18" />
      <path className="draw" pathLength="1" d="M44 8V18" />
      <path className="draw" pathLength="1" d="M22 38L29 45L43 31" />
    </>
  ),
  ship: (
    <>
      <rect className="draw" pathLength="1" x="8" y="10" width="48" height="16" rx="4" />
      <rect className="draw" pathLength="1" x="8" y="38" width="48" height="16" rx="4" />
      <path className="draw" pathLength="1" d="M18 18H30" />
      <path className="draw" pathLength="1" d="M18 46H30" />
      <path className="draw" pathLength="1" d="M46 18H46.1" />
      <path className="draw" pathLength="1" d="M46 46H46.1" />
    </>
  ),
}

const SERVICES = [
  {
    icon: 'panel',
    title: 'Yönetim ve müşteri panelleri',
    text: 'Ekibinin ya da müşterilerinin veriyle çalıştığı, rol ve yetkilere göre ayrılmış paneller.',
  },
  {
    icon: 'saas',
    title: 'SaaS ürünleri',
    text: 'Üyelik, abonelik ve ödeme akışlarıyla birlikte, tarayıcıdan kullanılan tam bir ürün.',
  },
  {
    icon: 'flow',
    title: 'İş akışı uygulamaları',
    text: 'Tablolarda, e-postalarda ve kâğıtlarda yürüyen süreçleri tek bir uygulamaya taşıma.',
  },
  {
    icon: 'api',
    title: 'API ve entegrasyonlar',
    text: 'Ödeme, muhasebe, CRM gibi mevcut sistemlerine güvenli ve izlenebilir bağlantılar.',
  },
  {
    icon: 'booking',
    title: 'Sipariş ve rezervasyon sistemleri',
    text: 'Stok, sipariş ya da randevu mantığı senin işine göre kurulmuş web uygulamaları.',
  },
  {
    icon: 'ship',
    title: 'Yayın ve bakım',
    text: 'Sunucu kurulumu, izleme, yedekleme ve güncellemeler. Uygulama yayına çıktıktan sonra da yanındayız.',
  },
]

export default function Services() {
  const root = useRef(null)
  const track = useRef(null)
  const bar = useRef(null)
  useTilt(track, '.card')

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    // Masaüstü: bölüm sabitlenir, kartlar yana doğru akar.
    mm.add(`(min-width: 900px) and ${MOTION_OK}`, () => {
      const el = root.current
      const t = track.current
      const dist = () => Math.max(0, t.scrollWidth - window.innerWidth + 80)

      gsap.from(el.querySelectorAll('.hscroll__head .w__in'), {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      })
      gsap.from(el.querySelectorAll('.hscroll__head [data-reveal="fade"]'), {
        opacity: 0,
        y: 24,
        duration: 1,
        stagger: 0.12,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      })

      const move = gsap.to(t, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: el,
          pin: true,
          scrub: 1,
          start: 'top top',
          end: () => `+=${dist()}`,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      })

      gsap.fromTo(
        bar.current,
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: 'none',
          scrollTrigger: { trigger: el, start: 'top top', end: () => `+=${dist()}`, scrub: true, invalidateOnRefresh: true },
        },
      )

      el.querySelectorAll('.card').forEach((card) => {
        const st = { trigger: card, containerAnimation: move, start: 'left 88%', toggleActions: 'play none none reverse' }
        gsap.from(card.querySelectorAll('.draw'), {
          strokeDashoffset: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          stagger: 0.12,
          scrollTrigger: st,
        })
        gsap.from(card, {
          opacity: 0.15,
          scale: 0.9,
          duration: 0.8,
          ease: 'power3.out',
          scrollTrigger: st,
        })
      })
    })

    // Mobil: dikey liste, kartlar sırayla gelir.
    mm.add(`(max-width: 899px) and ${MOTION_OK}`, () => {
      const el = root.current
      gsap.from(el.querySelectorAll('.hscroll__head .w__in'), {
        yPercent: 115,
        duration: 1,
        ease: 'power4.out',
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 80%' },
      })
      el.querySelectorAll('.card').forEach((card) => {
        gsap.from(card, {
          opacity: 0,
          y: 50,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
        gsap.from(card.querySelectorAll('.draw'), {
          strokeDashoffset: 1,
          duration: 1.2,
          ease: 'power2.inOut',
          stagger: 0.12,
          scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="hscroll" id="hizmetler" ref={root}>
      <div className="hscroll__pin">
        <div className="wrap hscroll__head">
          <Words as="h2" className="section__title" text="Tek işimiz var: çalışan web uygulamaları" />
          <div className="hscroll__side">
            <p className="section__intro" data-reveal="fade">
              Dağılmadan tek alana odaklanıyoruz. Bu yüzden her projede hem arayüzün hem de arka planın nasıl
              çalıştığını baştan biliyoruz.
            </p>
            <p className="boundary" data-reveal="fade">
              Mobil uygulama ve masaüstü yazılımı geliştirmiyoruz.
            </p>
          </div>
        </div>

        <ul className="hscroll__track" ref={track}>
          {SERVICES.map((s) => (
            <li className="card" key={s.title}>
              <svg className="card__icon" viewBox="0 0 64 64" fill="none" aria-hidden="true">
                {ICONS[s.icon]}
              </svg>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
            </li>
          ))}
        </ul>

        <div className="hscroll__bar" aria-hidden="true">
          <span ref={bar} />
        </div>
      </div>
    </section>
  )
}
