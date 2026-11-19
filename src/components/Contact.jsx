import { useLayoutEffect, useRef, useState } from 'react'
import { gsap, MOTION_OK } from '../lib/gsap.js'
import { CONTACT_WHATSAPP } from '../config.js'
import { useReveals } from '../lib/hooks.js'
import { Words } from './Split.jsx'
import Btn from './Btn.jsx'

export default function Contact() {
  const root = useRef(null)
  const [sent, setSent] = useState(false)
  useReveals(root)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add(MOTION_OK, () => {
      gsap.from(root.current.querySelectorAll('.field, .form .btn'), {
        opacity: 0,
        y: 40,
        scale: 0.97,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.12,
        scrollTrigger: { trigger: root.current.querySelector('.form'), start: 'top 82%', toggleActions: 'play none none reverse' },
      })
    })
    return () => mm.revert()
  }, [])

  const onSubmit = (e) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const body = `Merhaba, ben ${data.get('name')}.\n\n${data.get('message')}`
    window.open(`https://wa.me/${CONTACT_WHATSAPP}?text=${encodeURIComponent(body)}`, '_blank', 'noopener,noreferrer')
    setSent(true)
  }

  return (
    <section className="contact" id="iletisim" ref={root}>
      <div className="wrap split">
        <div>
          <Words as="h2" className="section__title" text="Projeni anlat" />
          <p className="section__intro" data-reveal="fade">
            Birkaç cümle yeterli: ne yapmak istiyorsun, kimler kullanacak, ne zaman hazır olmasını istiyorsun? Okuyup
            sana dönüş yaparız.
          </p>
          <p className="direct" data-reveal="fade">
            WhatsApp üzerinden yazmak istersen: <a href={`https://wa.me/${CONTACT_WHATSAPP}`} target="_blank" rel="noreferrer">WhatsApp’ta sohbet et</a>
            <br />
            E-posta: <a href="mailto:info@hookssoftwaresolutions.com">info@hookssoftwaresolutions.com</a>
          </p>
        </div>

        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label htmlFor="name">Adın</label>
            <input id="name" name="name" type="text" autoComplete="name" required />
          </div>
          <div className="field">
            <label htmlFor="message">Projen</label>
            <textarea id="message" name="message" rows="6" required />
          </div>
          <Btn type="submit">Mesajı gönder</Btn>
          {sent && (
            <p className="form__status" role="status">
              WhatsApp açıldı. Sohbeti seçip mesajını gönderebilirsin.
            </p>
          )}
        </form>
      </div>
    </section>
  )
}
