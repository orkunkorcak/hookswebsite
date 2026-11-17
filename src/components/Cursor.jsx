import { useEffect, useRef } from 'react'
import { gsap, hasFinePointer, prefersReducedMotion } from '../lib/gsap.js'
import './Cursor.css'

// Yalnızca fare olan cihazlarda çalışır; yerel imleç gizlenmez, üstüne bir halka eklenir.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!hasFinePointer() || prefersReducedMotion()) return

    const d = dot.current
    const r = ring.current
    const dx = gsap.quickTo(d, 'x', { duration: 0.08, ease: 'power3' })
    const dy = gsap.quickTo(d, 'y', { duration: 0.08, ease: 'power3' })
    const rx = gsap.quickTo(r, 'x', { duration: 0.5, ease: 'power3' })
    const ry = gsap.quickTo(r, 'y', { duration: 0.5, ease: 'power3' })

    const move = (e) => {
      d.classList.add('is-visible')
      r.classList.add('is-visible')
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
    }
    const over = (e) => {
      const hit = e.target.closest && e.target.closest('a, button, input, textarea, [data-cursor]')
      r.classList.toggle('is-active', Boolean(hit))
    }
    const leave = () => {
      d.classList.remove('is-visible')
      r.classList.remove('is-visible')
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    document.addEventListener('pointerleave', leave)
    return () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
      document.removeEventListener('pointerleave', leave)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
