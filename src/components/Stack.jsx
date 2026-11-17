import { useLayoutEffect, useRef } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { useReveals } from '../lib/hooks.js'
import { Words } from './Split.jsx'
import Floaters from './Floaters.jsx'

// Kullandığın teknolojilere göre bu listeyi düzenle.

const LAYERS = [
  {
    name: "Arayüz",
    side: "client",
    items: [
      "React",
      "JavaScript",
      "Vite",
      "HTML5",
      "CSS3",
      "Modern CSS",
      "React Router",
      "Axios",
    ],
  },
  {
    name: "Durum ve Form Yönetimi",
    side: "client",
    items: ["Redux Toolkit", "React Redux", "Context API", "Formik", "Yup"],
  },
  {
    name: "Sunucu",
    side: "server",
    items: [
      "Node.js",
      "Express.js",
      "REST API",
      "JWT",
      "Cookie Management",
      "Session Management",
      "CORS",
      "Kimlik Doğrulama",
    ],
  },
  {
    name: "Veri",
    side: "server",
    items: [
      "MongoDB",
      "Mongoose",
      "Database Modeling",
      "Aggregation",
      "Data Validation",
    ],
  },
  {
    name: "Entegrasyonlar",
    side: "server",
    items: ["iyzico", "SMTP", "Brevo", "Payment Integration", "Email Services"],
  },
  {
    name: "Yayın ve DevOps",
    side: "server",
    items: ["Git", "GitHub", "Vercel", "Render", "Cloudflare", "CI/CD"],
  },
];


const FLOATS = [
  { glyph: '=>', x: '88%', y: '8%', size: '4.5rem', speed: 1.2, rot: 25 },
  { glyph: '[ ]', x: '4%', y: '70%', size: '5.5rem', speed: 0.8, rot: -20 },
]

export default function Stack() {
  const root = useRef(null)
  useReveals(root)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      root.current.querySelectorAll('.layer').forEach((layer) => {
        const tl = gsap.timeline({
          scrollTrigger: { trigger: layer, start: 'top 85%', toggleActions: 'play none none reverse' },
        })
        tl.from(layer.querySelector('.layer__rule'), {
          scaleX: 0,
          transformOrigin: '0% 50%',
          duration: 1.1,
          ease: 'power3.inOut',
        })
          .from(layer.querySelector('.layer__name'), { opacity: 0, x: -20, duration: 0.7 }, 0.1)
          .from(
            layer.querySelectorAll('.layer__items li'),
            {
              clipPath: 'inset(0 100% 0 0)',
              x: -24,
              opacity: 0,
              duration: 0.9,
              ease: 'power3.out',
              stagger: 0.1,
            },
            0.2,
          )
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section className="stack" id="teknoloji" ref={root}>
      <Floaters items={FLOATS} />
      <div className="wrap">
        <Words as="h2" className="section__title" text="Her katmanda bildiğimiz araçlar" />
        <p className="section__intro" data-reveal="fade">
          Yaygın, iyi belgelenmiş teknolojiler kullanıyoruz. Yarın başka bir geliştirici projeni devralmak isterse
          zorlanmaz.
        </p>

        <ul className="legend" aria-label="Renk açıklaması" data-reveal="fade">
          <li className="legend__item legend__item--client">Tarayıcıda çalışır</li>
          <li className="legend__item legend__item--server">Sunucuda çalışır</li>
        </ul>

        <div className="layers">
          {LAYERS.map((layer) => (
            <div key={layer.name} className={`layer layer--${layer.side}`}>
              <span className="layer__rule" aria-hidden="true" />
              <h3 className="layer__name">{layer.name}</h3>
              <ul className="layer__items">
                {layer.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
