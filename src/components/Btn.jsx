import { useRef } from 'react'
import { useMagnetic } from '../lib/hooks.js'
import { goTo } from '../lib/state.js'

/** Manyetik efektli bağlantı ya da buton. href "#" ile başlıyorsa yumuşak kaydırır. */
export default function Btn({ href, variant = 'primary', size, children, onClick, ...rest }) {
  const ref = useRef(null)
  useMagnetic(ref, 0.3)
  const cls = `btn btn--${variant}${size ? ` btn--${size}` : ''}`

  if (href) {
    const handle = (e) => {
      if (href.startsWith('#')) {
        e.preventDefault()
        goTo(href)
      }
      if (onClick) onClick(e)
    }
    return (
      <a ref={ref} className={cls} href={href} onClick={handle} {...rest}>
        <span className="btn__label">{children}</span>
      </a>
    )
  }
  return (
    <button ref={ref} className={cls} onClick={onClick} {...rest}>
      <span className="btn__label">{children}</span>
    </button>
  )
}
