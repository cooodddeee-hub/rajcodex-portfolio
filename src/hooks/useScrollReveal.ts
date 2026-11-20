import { useEffect } from 'react'

/** Adds reversible viewport-triggered reveals without hiding content when motion is reduced. */
export function useScrollReveal() {
  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (reducedMotion.matches || !('IntersectionObserver' in window)) return
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-section-reveal]')
    let observer: IntersectionObserver | undefined
    try {
      observer = new IntersectionObserver(entries => {
        for (const entry of entries) {
          const target = entry.target as HTMLElement
          target.classList.toggle('is-visible', entry.isIntersecting)
        }
      }, { threshold: 0.04, rootMargin: '-5% 0px -5% 0px' })
      targets.forEach(target => observer?.observe(target))
    } catch {
      observer?.disconnect()
      // Keep the document visible if observer setup fails partway through.
      return
    }
    // Only activate the CSS hidden state after observation setup succeeds.
    document.documentElement.classList.add('reveal-enabled')

    // A single passive scroll listener drives only the small number of marked
    // parallax elements, and only while they are near the viewport.
    const parallaxTargets = [...document.querySelectorAll<HTMLElement>('[data-parallax]')]
    const activeParallax = new Set<HTMLElement>()
    let parallaxFrame = 0
    const updateParallax = () => {
      parallaxFrame = 0
      for (const target of activeParallax) {
        const rect = target.getBoundingClientRect()
        const distance = (window.innerHeight * 0.5 - (rect.top + rect.height * 0.5)) / window.innerHeight
        const offset = Math.max(-8, Math.min(8, distance * 10))
        target.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
      }
    }
    const requestParallaxFrame = () => {
      if (!parallaxFrame) parallaxFrame = window.requestAnimationFrame(updateParallax)
    }
    const parallaxObserver = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const target = entry.target as HTMLElement
        if (entry.isIntersecting) activeParallax.add(target)
        else activeParallax.delete(target)
      }
      requestParallaxFrame()
    }, { rootMargin: '100px 0px' })
    parallaxTargets.forEach(target => parallaxObserver.observe(target))
    window.addEventListener('scroll', requestParallaxFrame, { passive: true })
    window.addEventListener('resize', requestParallaxFrame, { passive: true })
    requestParallaxFrame()

    return () => {
      observer?.disconnect()
      parallaxObserver.disconnect()
      window.removeEventListener('scroll', requestParallaxFrame)
      window.removeEventListener('resize', requestParallaxFrame)
      if (parallaxFrame) window.cancelAnimationFrame(parallaxFrame)
      document.documentElement.classList.remove('reveal-enabled')
    }
  }, [])
}
