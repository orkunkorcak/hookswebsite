import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { Words } from './Split.jsx'

const NAV = ['Özet', 'Siparişler', 'Müşteriler', 'Raporlar']
const KPIS = [
  { label: 'Aktif kullanıcı', value: 12480, suffix: '' },
  { label: 'Sipariş', value: 3264, suffix: '' },
  { label: 'Dönüşüm', value: 4.8, suffix: '%', decimals: 1 },
]
const BARS = [38, 52, 44, 70, 58, 86, 64, 92]
const ROWS = [
  ['#4821', 'Atlas Lojistik', 'Hazırlanıyor', '₺8.420'],
  ['#4820', 'Demir Yapı', 'Yolda', '₺3.150'],
  ['#4819', 'Mavi Kırtasiye', 'Teslim edildi', '₺1.980'],
  ['#4818', 'Kuzey Gıda', 'Teslim edildi', '₺12.700'],
]
const CAPS = [
  { title: 'Arayüz', text: 'Ekranlar, formlar ve grafikler tarayıcıda akıcı çalışır.' },
  { title: 'Veri', text: 'Kayıtlar güvenle saklanır, filtrelenir ve raporlanır.' },
  { title: 'Yayın', text: 'Canlıya alınır, izlenir ve düzenli yedeklenir.' },
]

const fmt = (v, d = 0) => v.toLocaleString('tr-TR', { minimumFractionDigits: d, maximumFractionDigits: d })

export default function Showcase() {
  const root = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    const build = (scrollTrigger) => {
      const el = root.current
      const q = (s) => el.querySelectorAll(s)
      const win = el.querySelector('.win')
      const caps = q('.cap')
      const kpiEls = q('.kpi__value')
      const path = el.querySelector('.line__stroke')
      const area = el.querySelector('.line__area')
      const toast = el.querySelector('.toast')

      // Sayaçlar 0'dan başlar
      kpiEls.forEach((k, i) => {
        k.textContent = fmt(0, KPIS[i].decimals || 0) + KPIS[i].suffix
      })

      const tl = gsap.timeline({ defaults: { ease: 'power2.out' }, scrollTrigger })

      tl.fromTo(
        win,
        { rotationX: 55, scale: 0.55, y: 140, opacity: 0.1, transformPerspective: 1400, transformOrigin: '50% 100%' },
        { rotationX: 6, scale: 1, y: 0, opacity: 1, duration: 2.2 },
      )
        .to(caps[0], { opacity: 1, x: 0, duration: 0.6 }, '<0.8')
        .from(q('.win__nav li'), { x: -26, opacity: 0, stagger: 0.12, duration: 0.6 }, '>-0.6')
        .from(q('.kpi'), { y: 34, opacity: 0, scale: 0.9, stagger: 0.18, duration: 0.8 }, '<0.2')

      kpiEls.forEach((k, i) => {
        const o = { v: 0 }
        tl.to(
          o,
          {
            v: KPIS[i].value,
            duration: 1.4,
            ease: 'power1.out',
            onUpdate: () => {
              k.textContent = fmt(o.v, KPIS[i].decimals || 0) + KPIS[i].suffix
            },
          },
          i === 0 ? '<0.2' : '<0.18',
        )
      })

      tl.to(caps[0], { opacity: 0.28, x: -10, duration: 0.5 }, '>0.2')
        .to(caps[1], { opacity: 1, x: 0, duration: 0.6 }, '<')
        .from(q('.bar'), { scaleY: 0, transformOrigin: '50% 100%', stagger: 0.09, duration: 0.9 }, '<')
        .fromTo(path, { strokeDashoffset: 1 }, { strokeDashoffset: 0, duration: 1.6, ease: 'power1.inOut' }, '<0.2')
        .from(area, { opacity: 0, duration: 1 }, '>-0.6')
        .from(q('.trow'), { x: 50, opacity: 0, stagger: 0.14, duration: 0.7 }, '<0.2')
        .to(caps[1], { opacity: 0.28, x: -10, duration: 0.5 }, '>0.3')
        .to(caps[2], { opacity: 1, x: 0, duration: 0.6 }, '<')
        .from(toast, { y: 40, opacity: 0, scale: 0.9, duration: 0.7, ease: 'back.out(1.8)' }, '<0.2')
        .to(win, { rotationX: 0, rotationY: -7, duration: 1.4, ease: 'power1.inOut' }, '<0.3')
        .to({}, { duration: 0.6 })
      return tl
    }

    // Masaüstü: sabitlenir, kaydırmayla adım adım kurulur.
    mm.add(`(min-width: 900px) and ${MOTION_OK}`, () => {
      const el = root.current
      gsap.from(el.querySelectorAll('.showcase__copy .w__in'), {
        yPercent: 115,
        duration: 1.1,
        ease: 'power4.out',
        stagger: 0.07,
        scrollTrigger: { trigger: el, start: 'top 70%' },
      })
      gsap.set(el.querySelectorAll('.cap'), { opacity: 0.28, x: -10 })
      const tl = build({
        trigger: el,
        pin: true,
        start: 'top top',
        end: '+=320%',
        scrub: 1,
        anticipatePin: 1,
      })
      return () => tl.kill()
    })

    // Mobil: sabitleme yok, görününce bir kez oynar.
    mm.add(`(max-width: 899px) and ${MOTION_OK}`, () => {
      const el = root.current
      gsap.set(el.querySelectorAll('.cap'), { opacity: 1, x: 0 })
      const tl = build({ trigger: el.querySelector('.win'), start: 'top 80%', toggleActions: 'play none none none' })
      tl.timeScale(1.6)
      return () => tl.kill()
    })

    // Hareket kapalıysa son durumu göster
    mm.add('(prefers-reduced-motion: reduce)', () => {
      const el = root.current
      el.querySelectorAll('.kpi__value').forEach((k, i) => {
        k.textContent = fmt(KPIS[i].value, KPIS[i].decimals || 0) + KPIS[i].suffix
      })
    })

    return () => mm.revert()
  }, [])

  return (
    <section className="showcase" id="ornek" ref={root}>
      <div className="showcase__pin">
        <div className="showcase__copy">
          <Words as="h2" className="section__title" text="Ekranda gördüğün, arkada çalışan bir sistemdir" />
          <ul className="caps">
            {CAPS.map((c) => (
              <li className="cap" key={c.title}>
                <h3>{c.title}</h3>
                <p>{c.text}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="stage">
          <div className="win" role="img" aria-label="Örnek bir yönetim paneli arayüzü">
            <div className="win__bar">
              <i />
              <i />
              <i />
              <span className="win__url">panel.ornek-sirket.com</span>
              <em>Örnek veri</em>
            </div>
            <div className="win__body">
              <ul className="win__nav">
                {NAV.map((n, i) => (
                  <li key={n} className={i === 0 ? 'is-on' : undefined}>
                    {n}
                  </li>
                ))}
              </ul>
              <div className="win__main">
                <div className="kpis">
                  {KPIS.map((k) => (
                    <div className="kpi" key={k.label}>
                      <span className="kpi__label">{k.label}</span>
                      <span className="kpi__value">{fmt(k.value, k.decimals || 0) + k.suffix}</span>
                    </div>
                  ))}
                </div>
                <div className="charts">
                  <div className="chart">
                    <span className="chart__title">Haftalık sipariş</span>
                    <div className="bars">
                      {BARS.map((h, i) => (
                        <span className={`bar${i % 3 === 2 ? ' bar--warm' : ''}`} key={i} style={{ height: `${h}%` }} />
                      ))}
                    </div>
                  </div>
                  <div className="chart">
                    <span className="chart__title">Ziyaretçi eğilimi</span>
                    <svg className="line" viewBox="0 0 300 120" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="lineFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0" stopColor="#2fb7d9" stopOpacity="0.35" />
                          <stop offset="1" stopColor="#2fb7d9" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path
                        className="line__area"
                        d="M0 96 C30 92 50 70 80 74 S130 98 160 62 S220 36 250 40 S285 20 300 14 V120 H0 Z"
                        fill="url(#lineFill)"
                      />
                      <path
                        className="line__stroke"
                        pathLength="1"
                        d="M0 96 C30 92 50 70 80 74 S130 98 160 62 S220 36 250 40 S285 20 300 14"
                        fill="none"
                        stroke="#2fb7d9"
                        strokeWidth="2.5"
                        vectorEffect="non-scaling-stroke"
                      />
                    </svg>
                  </div>
                </div>
                <ul className="table">
                  {ROWS.map((r) => (
                    <li className="trow" key={r[0]}>
                      <span>{r[0]}</span>
                      <span>{r[1]}</span>
                      <span className="chip">{r[2]}</span>
                      <span>{r[3]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="toast">Sipariş #4822 kaydedildi</div>
          </div>
        </div>
      </div>
    </section>
  )
}
