import Lenis from 'lenis'
import { gsap, ScrollTrigger, prefersReducedMotion } from './gsap.js'
import { smooth } from './state.js'

let lenis = null

// Yumuşak scroll (Lenis) ile GSAP ScrollTrigger'ı aynı saate bağlar.
// Bağlantılara tıklayınca state.js içindeki goTo() bu Lenis örneğini kullanır.
export function initScroll() {
  if (prefersReducedMotion()) return () => {}

  lenis = new Lenis({ lerp: 0.09, wheelMultiplier: 0.95 })
  smooth.lenis = lenis
  lenis.on('scroll', ScrollTrigger.update)

  const tick = (time) => lenis.raf(time * 1000)
  gsap.ticker.add(tick)
  gsap.ticker.lagSmoothing(0)

  return () => {
    gsap.ticker.remove(tick)
    lenis.destroy()
    lenis = null
    smooth.lenis = null
  }
}

export function lockScroll() {
  document.documentElement.classList.add('is-locked')
  if (lenis) lenis.stop()
}

export function unlockScroll() {
  document.documentElement.classList.remove('is-locked')
  if (lenis) lenis.start()
}
