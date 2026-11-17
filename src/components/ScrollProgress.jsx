import { useEffect, useRef } from 'react'
import { gsap, prefersReducedMotion } from '../lib/gsap.js'

export default function ScrollProgress() {
  const bar = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return
    const ctx = gsap.context(() => {
      gsap.to(bar.current, {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { start: 0, end: 'max', scrub: 0.2 },
      })
    })
    return () => ctx.revert()
  }, [])

  return <div className="progress" ref={bar} aria-hidden="true" />
}
