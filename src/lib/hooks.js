import { useEffect, useLayoutEffect } from 'react'
import { gsap, MOTION_OK, FINE_POINTER } from './gsap.js'

/**
 * Bir bölümün içindeki [data-reveal] öğelerini görününce açar.
 *  - words: başlık kelimeleri maskenin altından yükselir
 *  - fade:  paragraf bulanıklıktan netleşerek gelir
 * Sabitlenmiş (pin) bölümlerin içinde kullanılmaz.
 */
export function useReveals(ref) {
  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      const root = ref.current
      if (!root) return
      root.querySelectorAll('[data-reveal="words"]').forEach((el) => {
        gsap.from(el.querySelectorAll('.w__in'), {
          yPercent: 115,
          duration: 1.1,
          ease: 'power4.out',
          stagger: 0.07,
          scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none reverse' },
        })
      })
      root.querySelectorAll('[data-reveal="fade"]').forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          y: 24,
          filter: 'blur(10px)',
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 90%', toggleActions: 'play none none reverse' },
        })
      })
    })
    return () => mm.revert()
  }, [ref])
}

/** İmleç yaklaşınca öğeyi kendine çeker (manyetik efekt). */
export function useMagnetic(ref, strength = 0.35) {
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const mm = gsap.matchMedia()
    mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
      const xTo = gsap.quickTo(el, 'x', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
      const yTo = gsap.quickTo(el, 'y', { duration: 0.6, ease: 'elastic.out(1, 0.45)' })
      const onMove = (e) => {
        const r = el.getBoundingClientRect()
        const cx = r.left + r.width / 2
        const cy = r.top + r.height / 2
        const dx = e.clientX - cx
        const dy = e.clientY - cy
        const reach = Math.max(r.width, r.height) * 0.9
        if (Math.hypot(dx, dy) < reach) {
          xTo(dx * strength)
          yTo(dy * strength)
        } else {
          xTo(0)
          yTo(0)
        }
      }
      window.addEventListener('pointermove', onMove, { passive: true })
      return () => {
        window.removeEventListener('pointermove', onMove)
        gsap.set(el, { x: 0, y: 0 })
      }
    })
    return () => mm.revert()
  }, [ref, strength])
}

/** Kart üzerinde imlece göre 3B eğilme ve parlama. */
export function useTilt(ref, selector = '.card') {
  useEffect(() => {
    const root = ref.current
    if (!root) return
    const mm = gsap.matchMedia()
    mm.add(`${FINE_POINTER} and ${MOTION_OK}`, () => {
      const cards = Array.from(root.querySelectorAll(selector))
      const cleanups = cards.map((card) => {
        const onMove = (e) => {
          const r = card.getBoundingClientRect()
          const px = (e.clientX - r.left) / r.width
          const py = (e.clientY - r.top) / r.height
          gsap.to(card, {
            rotationY: (px - 0.5) * 14,
            rotationX: (0.5 - py) * 14,
            transformPerspective: 900,
            duration: 0.5,
            ease: 'power3.out',
            overwrite: 'auto',
          })
          card.style.setProperty('--mx', `${px * 100}%`)
          card.style.setProperty('--my', `${py * 100}%`)
        }
        const onLeave = () => {
          gsap.to(card, { rotationX: 0, rotationY: 0, duration: 0.8, ease: 'elastic.out(1, 0.5)', overwrite: 'auto' })
        }
        card.addEventListener('pointermove', onMove)
        card.addEventListener('pointerleave', onLeave)
        return () => {
          card.removeEventListener('pointermove', onMove)
          card.removeEventListener('pointerleave', onLeave)
          gsap.set(card, { clearProps: 'rotationX,rotationY,transformPerspective' })
        }
      })
      return () => cleanups.forEach((fn) => fn())
    })
    return () => mm.revert()
  }, [ref, selector])
}
