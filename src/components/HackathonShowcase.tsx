import { useEffect, useRef, useState } from 'react'
import RLogo from './RLogo'

const gallery = [
  {
    title: 'First Prize Certificate',
    kind: 'Certificate',
    src: '/images/hackathon/first-prize-certificate.jpeg',
    alt: 'First prize certificate from Hackathon 4.0',
  },
  {
    title: 'Finalist Certificate',
    kind: 'Certificate',
    src: '/images/hackathon/finalist-certificate.jpeg',
    alt: 'Finalist certificate from Hackathon 4.0',
  },
  {
    title: 'Award Ceremony',
    kind: 'Event photograph',
    src: '/images/hackathon/award-ceremony.jpeg',
    alt: 'Group photograph at the Hackathon 4.0 award ceremony',
  },
  {
    title: 'Team Moments',
    kind: 'Event photograph',
    src: '/images/hackathon/team-moments.jpeg',
    alt: 'Team moments from Hackathon 4.0',
  },
]

export default function HackathonShowcase() {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeButtonRef = useRef<HTMLButtonElement>(null)
  const returnFocusRef = useRef<HTMLButtonElement | null>(null)
  const touchStartX = useRef<number | null>(null)
  const isOpen = selectedIndex !== null

  useEffect(() => {
    const originalTitle = document.title
    document.title = 'Hackathon 4.0 — RAJ'
    return () => { document.title = originalTitle }
  }, [])

  useEffect(() => {
    if (!isOpen) return
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeButtonRef.current?.focus()
    const returnFocus = returnFocusRef.current
    return () => {
      document.body.style.overflow = originalOverflow
      if (returnFocus?.isConnected) returnFocus.focus()
    }
  }, [isOpen])

  useEffect(() => {
    if (selectedIndex === null) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        setSelectedIndex(null)
      } else if (event.key === 'ArrowRight') {
        event.preventDefault()
        setSelectedIndex(index => index === null ? 0 : (index + 1) % gallery.length)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        setSelectedIndex(index => index === null ? gallery.length - 1 : (index - 1 + gallery.length) % gallery.length)
      } else if (event.key === 'Tab') {
        const controls = dialogRef.current?.querySelectorAll<HTMLButtonElement>('[data-lightbox-control]')
        if (!controls?.length) return
        const first = controls[0]
        const last = controls[controls.length - 1]
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault()
          last.focus()
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault()
          first.focus()
        }
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [selectedIndex])

  const openImage = (index: number, trigger: HTMLButtonElement) => {
    returnFocusRef.current = trigger
    setSelectedIndex(index)
  }

  const moveImage = (direction: -1 | 1) => {
    setSelectedIndex(index => index === null ? 0 : (index + direction + gallery.length) % gallery.length)
  }

  const handleTouchEnd = (event: React.TouchEvent<HTMLDivElement>) => {
    if (touchStartX.current === null) return
    const distance = event.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (Math.abs(distance) < 48) return
    moveImage(distance < 0 ? 1 : -1)
  }

  return <div className="hackathon-page" id="top">
    <header className="hackathon-header">
      <a href="/" className="hackathon-brand" aria-label="R logo — back to portfolio"><RLogo className="r-logo" /></a>
      <a href="/" className="hackathon-back"><span aria-hidden="true">←</span> Back to Portfolio</a>
    </header>

    <main className="hackathon-main">
      <section className="hackathon-hero" aria-labelledby="hackathon-title">
        <div className="hackathon-hero-copy">
          <p className="hackathon-eyebrow"><span /> ACHIEVEMENT / MUMBAI</p>
          <p className="hackathon-edition">HACKATHON <span>4.0</span></p>
          <h1 id="hackathon-title">A Journey from<br /><em>Finalist to First Position.</em></h1>
          <div className="hackathon-organizers">
            <span>IES MCRC</span><i />
            <span>Avenir Analytics Club</span><i />
            <span>2026</span>
          </div>
        </div>
        <div className="hackathon-award" aria-label="First position — OpsGenie AI">
          <span className="award-index">01 / RECOGNITION</span>
          <span className="award-star" aria-hidden="true">✳</span>
          <span className="award-first">FIRST<br />POSITION</span>
          <span className="award-project">OPSGENIE AI</span>
        </div>
      </section>

      <section className="hackathon-gallery-section" aria-labelledby="certificates-title">
        <div className="hackathon-section-heading">
          <div><span className="hackathon-section-index">01</span><p className="hackathon-eyebrow">PROOF OF THE JOURNEY</p></div>
          <h2 id="certificates-title">Certificates<span>.</span></h2>
        </div>
        <div className="hackathon-certificate-grid">
          {gallery.slice(0, 2).map((image, index) => <button
            className="hackathon-image-card certificate-card"
            key={image.src}
            type="button"
            onClick={event => openImage(index, event.currentTarget)}
            aria-label={`View ${image.title} in full screen`}
          >
            <span className="hackathon-image-window certificate-window"><img src={image.src} alt={image.alt} loading="lazy" /></span>
            <span className="hackathon-image-caption"><span><small>{image.kind}</small><strong>{image.title}</strong></span><i aria-hidden="true">↗</i></span>
          </button>)}
        </div>
      </section>

      <section className="hackathon-gallery-section event-gallery" aria-labelledby="photographs-title">
        <div className="hackathon-section-heading">
          <div><span className="hackathon-section-index">02</span><p className="hackathon-eyebrow">PEOPLE MAKE THE MOMENT</p></div>
          <h2 id="photographs-title">The day<span>.</span></h2>
        </div>
        <div className="hackathon-photo-grid">
          {gallery.slice(2).map((image, galleryIndex) => {
            const index = galleryIndex + 2
            return <button
              className="hackathon-image-card photo-card"
              key={image.src}
              type="button"
              onClick={event => openImage(index, event.currentTarget)}
              aria-label={`View ${image.title} in full screen`}
            >
              <span className="hackathon-image-window photo-window"><img src={image.src} alt={image.alt} loading="lazy" /></span>
              <span className="hackathon-image-caption"><span><small>{image.kind}</small><strong>{image.title}</strong></span><i aria-hidden="true">↗</i></span>
            </button>
          })}
        </div>
      </section>
    </main>

    <footer className="hackathon-footer">
      <a href="/" className="hackathon-footer-back">← Back to Portfolio</a>
      <span>© {new Date().getFullYear()} — MADE WITH INTENTION</span>
      <a href="#top" onClick={event => { event.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>BACK TO TOP ↑</a>
    </footer>

    {selectedIndex !== null && <div
      className="hackathon-lightbox-backdrop"
      role="presentation"
      onClick={event => { if (event.target === event.currentTarget) setSelectedIndex(null) }}
    >
      <div className="hackathon-lightbox" role="dialog" aria-modal="true" aria-label={`${gallery[selectedIndex].title} image viewer`} ref={dialogRef}>
        <div className="lightbox-toolbar">
          <p><span>{String(selectedIndex + 1).padStart(2, '0')}</span> / {String(gallery.length).padStart(2, '0')} <b>{gallery[selectedIndex].title}</b></p>
          <button type="button" className="lightbox-close" data-lightbox-control ref={closeButtonRef} onClick={() => setSelectedIndex(null)} aria-label="Close image viewer">×</button>
        </div>
        <div
          className="lightbox-stage"
          onTouchStart={event => { touchStartX.current = event.changedTouches[0].clientX }}
          onTouchEnd={handleTouchEnd}
        >
          <button type="button" className="lightbox-arrow lightbox-previous" data-lightbox-control onClick={() => moveImage(-1)} aria-label="Previous image">←</button>
          <img className="lightbox-image" src={gallery[selectedIndex].src} alt={gallery[selectedIndex].alt} />
          <button type="button" className="lightbox-arrow lightbox-next" data-lightbox-control onClick={() => moveImage(1)} aria-label="Next image">→</button>
        </div>
        <p className="lightbox-caption">{gallery[selectedIndex].alt}</p>
      </div>
    </div>}
  </div>
}
