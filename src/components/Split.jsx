import { Fragment } from 'react'

/** Kelime kelime maskelenmiş metin. [data-reveal="words"] ile useReveals tarafından açılır. */
export function Words({ text, as: Tag = 'span', className }) {
  return (
    <Tag className={className} aria-label={text} data-reveal="words">
      {text.split(' ').map((word, i) => (
        <Fragment key={i}>
          <span className="w" aria-hidden="true">
            <span className="w__in">{word}</span>
          </span>{' '}
        </Fragment>
      ))}
    </Tag>
  )
}

/** Harf harf bölünmüş metin (hero başlığı ve footer yazısı için). */
export function Chars({ text }) {
  const words = text.split(' ')
  return (
    <>
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="word" aria-hidden="true">
            {Array.from(word).map((ch, ci) => (
              <span className="ch" key={ci}>
                {ch}
              </span>
            ))}
          </span>
          {wi < words.length - 1 ? ' ' : null}
        </Fragment>
      ))}
    </>
  )
}
