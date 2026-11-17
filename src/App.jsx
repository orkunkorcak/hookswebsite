import { useCallback, useEffect, useState } from 'react'
import { ScrollTrigger, prefersReducedMotion } from './lib/gsap.js'
import { initScroll, lockScroll, unlockScroll } from './lib/scroll.js'
import { goTo } from './lib/state.js'
import Preloader from './components/Preloader.jsx'
import Cursor from './components/Cursor.jsx'
import ScrollProgress from './components/ScrollProgress.jsx'
import Navbar from './components/Navbar.jsx'
import Scene3D from './components/Scene3D.jsx'
import SceneDirector from './components/SceneDirector.jsx'
import Hero from './components/Hero.jsx'
import Marquee from './components/Marquee.jsx'
import Services from './components/Services.jsx'
import Showcase from './components/Showcase.jsx'
import Stats from './components/Stats.jsx'
import Stack from './components/Stack.jsx'
import Process from './components/Process.jsx'
import Why from './components/Why.jsx'
import Contact from './components/Contact.jsx'
import Footer from './components/Footer.jsx'

export default function App() {
  // Hareket azaltma açıksa açılış ekranı atlanır ve sayfa doğrudan görünür.
  const [ready, setReady] = useState(() => prefersReducedMotion())
  const onDone = useCallback(() => setReady(true), [])

  // Yumuşak scroll ve sayfa içi bağlantılar
  useEffect(() => {
    const destroy = initScroll()
    if (!prefersReducedMotion()) lockScroll()

    const onClick = (e) => {
      if (e.defaultPrevented) return // Btn kendi bağlantısını zaten yönetti
      const a = e.target.closest && e.target.closest('a[href^="#"]')
      if (!a) return
      const hash = a.getAttribute('href')
      if (!hash || hash === '#') return
      e.preventDefault()
      goTo(hash)
    }
    document.addEventListener('click', onClick)

    return () => {
      document.removeEventListener('click', onClick)
      destroy()
    }
  }, [])

  // Açılış ekranı bitince scroll açılır ve tüm tetikleyiciler yeniden ölçülür.
  useEffect(() => {
    if (!ready) return
    unlockScroll()
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => ScrollTrigger.refresh())
    }
    const t = setTimeout(() => ScrollTrigger.refresh(), 700)
    return () => clearTimeout(t)
  }, [ready])

  return (
    <>
      {!ready && <Preloader onDone={onDone} />}
      <Cursor />
      <ScrollProgress />
      <Navbar ready={ready} />
      <Scene3D ready={ready} />
      <main>
        <Hero ready={ready} />
        <Marquee />
        <Services />
        <Showcase />
        <Stats />
        <Stack />
        <Process />
        <Why />
        <Contact />
      </main>
      <Footer />
      <SceneDirector />
    </>
  )
}
