import { useEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger, prefersReducedMotion } from '../lib/gsap.js'
import Btn from './Btn.jsx'
import './Navbar.css'

const LINKS = [
  { href: '#hizmetler', label: 'Hizmetler' },
  { href: '#ornek', label: 'Örnek' },
  { href: '#teknoloji', label: 'Teknoloji' },
  { href: '#surec', label: 'Süreç' },
  { href: '#neden-hooks', label: 'Neden Hooks' },
]

export default function Navbar({ ready }) {
  const ref = useRef(null)
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const openRef = useRef(false)
  openRef.current = open

  // Açılıştan önce menü yukarıda bekler.
  useEffect(() => {
    if (prefersReducedMotion()) return
    gsap.set(ref.current, { yPercent: -130 })
  }, [])

  useEffect(() => {
    if (!ready || prefersReducedMotion()) return
    gsap.to(ref.current, { yPercent: 0, duration: 0.9, ease: 'power3.out', delay: 0.5 })
  }, [ready])

  // Aşağı kaydırınca gizlenir, yukarı kaydırınca geri gelir.
  useEffect(() => {
    if (prefersReducedMotion()) return
    const el = ref.current
    let hidden = false
    const st = ScrollTrigger.create({
      start: 0,
      end: 'max',
      onUpdate: (self) => {
        const y = self.scroll()
        setSolid(y > 24)
        if (self.direction === 1 && y > 260 && !hidden && !openRef.current) {
          hidden = true
          gsap.to(el, { yPercent: -130, duration: 0.5, ease: 'power3.out', overwrite: true })
        } else if ((self.direction === -1 || y <= 260) && hidden) {
          hidden = false
          gsap.to(el, { yPercent: 0, duration: 0.5, ease: 'power3.out', overwrite: true })
        }
      },
    })
    return () => st.kill()
  }, [])

  const close = () => setOpen(false)

  return (
    <header ref={ref} className={`nav${solid || open ? ' nav--solid' : ''}`}>
      <div className="wrap nav__inner">
        <a className="nav__brand" href="#top" onClick={close}>
          <img src="/logo-mark.png" alt="" width="38" height="34" />
          <span>Hooks Software Solutions</span>
        </a>

        <button
          type="button"
          className="nav__toggle"
          aria-expanded={open}
          aria-controls="menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? 'Kapat' : 'Menü'}
        </button>

        <nav id="menu" className={`nav__links${open ? ' is-open' : ''}`} aria-label="Ana menü">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={close}>
              {l.label}
            </a>
          ))}
          <Btn href="#iletisim" size="sm" onClick={close}>
            İletişim
          </Btn>
        </nav>
      </div>
    </header>
  )
}
