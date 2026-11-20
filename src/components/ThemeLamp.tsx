import { useEffect, useRef, useState } from 'react'

type Theme = 'dark' | 'light'

type ThemeLampProps = {
  theme: Theme
  onToggle: () => void
  onDemoToggle: () => void
}

type PointerStart = { id: number; y: number }
const ROPE_LENGTH = 78
const MAX_PULL = 56

export default function ThemeLamp({ theme, onToggle, onDemoToggle }: ThemeLampProps) {
  const buttonRef = useRef<HTMLButtonElement>(null)
  const pointerStart = useRef<PointerStart | null>(null)
  const suppressClick = useRef(false)
  const snapTimeout = useRef<number | undefined>(undefined)
  const welcomeTimeouts = useRef<number[]>([])
  const welcomeFrame = useRef<number | undefined>(undefined)
  const welcomeCancelled = useRef(false)
  const welcomePlayed = useRef(false)
  const welcomeActive = useRef(false)
  const welcomePreview = useRef(false)
  const onDemoToggleRef = useRef(onDemoToggle)
  onDemoToggleRef.current = onDemoToggle
  const currentPull = useRef(0)
  const [pulling, setPulling] = useState(false)
  const [snapping, setSnapping] = useState(false)
  const [autoPulling, setAutoPulling] = useState(false)

  useEffect(() => () => window.clearTimeout(snapTimeout.current), [])

  const clearWelcomeTimers = () => {
    welcomeTimeouts.current.forEach(window.clearTimeout)
    welcomeTimeouts.current = []
    if (welcomeFrame.current !== undefined) {
      window.cancelAnimationFrame(welcomeFrame.current)
      welcomeFrame.current = undefined
    }
  }

  const cancelWelcomeDemo = () => {
    welcomeCancelled.current = true
    clearWelcomeTimers()
    if (welcomePreview.current) {
      welcomePreview.current = false
      onDemoToggleRef.current()
    }
    welcomeActive.current = false
    window.clearTimeout(snapTimeout.current)
    setAutoPulling(false)
    setSnapping(false)
    const button = buttonRef.current
    button?.style.setProperty('--rope-pull', '0px')
    button?.style.setProperty('--rope-scale', '1')
  }

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)')
    if (motionPreference.matches) return

    const schedule = (callback: () => void, delay: number) => {
      const timeout = window.setTimeout(() => {
        welcomeTimeouts.current = welcomeTimeouts.current.filter(item => item !== timeout)
        callback()
      }, delay)
      welcomeTimeouts.current.push(timeout)
    }

    const startWelcomeDemo = () => {
      if (welcomeCancelled.current || welcomePlayed.current) return
      const button = buttonRef.current
      if (!button) return
      welcomePlayed.current = true
      welcomeActive.current = true
      setAutoPulling(true)
      welcomeFrame.current = window.requestAnimationFrame(() => {
        welcomeFrame.current = undefined
        if (welcomeCancelled.current || !welcomeActive.current) return
        const pull = 36
        button.style.setProperty('--rope-pull', `${pull}px`)
        button.style.setProperty('--rope-scale', String(1 + pull / ROPE_LENGTH))
        schedule(() => {
          if (!welcomeActive.current || welcomeCancelled.current) return
          welcomePreview.current = true
          onDemoToggleRef.current()
        }, 210)
        schedule(() => {
          if (!welcomeActive.current || welcomeCancelled.current) return
          if (welcomePreview.current) {
            welcomePreview.current = false
            onDemoToggleRef.current()
          }
          setAutoPulling(false)
          startSnap(pull)
          welcomeActive.current = false
        }, 620)
      })
    }

    const initialTimeout = window.setTimeout(() => {
      welcomeTimeouts.current = welcomeTimeouts.current.filter(item => item !== initialTimeout)
      startWelcomeDemo()
    }, 600)
    welcomeTimeouts.current.push(initialTimeout)
    const handleMotionPreferenceChange = () => {
      if (motionPreference.matches) cancelWelcomeDemo()
    }
    motionPreference.addEventListener('change', handleMotionPreferenceChange)
    return () => {
      clearWelcomeTimers()
      motionPreference.removeEventListener('change', handleMotionPreferenceChange)
    }
  }, [])

  const startSnap = (pull: number) => {
    const button = buttonRef.current
    if (button) {
      button.style.setProperty('--release-pull', `${pull}px`)
      button.style.setProperty('--release-scale', String(1 + pull / ROPE_LENGTH))
      button.style.setProperty('--rope-pull', '0px')
      button.style.setProperty('--rope-scale', '1')
    }
    setSnapping(true)
    window.clearTimeout(snapTimeout.current)
    snapTimeout.current = window.setTimeout(() => setSnapping(false), 920)
  }

  const switchLamp = () => {
    cancelWelcomeDemo()
    if (!snapping) startSnap(0)
    onToggle()
  }

  const handlePointerDown = (event: React.PointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    cancelWelcomeDemo()
    pointerStart.current = { id: event.pointerId, y: event.clientY }
    currentPull.current = 0
    window.clearTimeout(snapTimeout.current)
    setSnapping(false)
    event.currentTarget.style.setProperty('--rope-pull', '0px')
    event.currentTarget.style.setProperty('--rope-scale', '1')
    event.currentTarget.setPointerCapture(event.pointerId)
    setPulling(true)
  }

  const handlePointerMove = (event: React.PointerEvent<HTMLButtonElement>) => {
    const start = pointerStart.current
    const button = buttonRef.current
    if (!start || start.id !== event.pointerId || !button) return
    const rawPull = Math.max(0, event.clientY - start.y)
    // A rubber-band curve adds resistance near the safe maximum, so the rope
    // feels elastic but can never stretch far enough to detach from the shade.
    const pull = MAX_PULL * (1 - Math.exp(-rawPull / MAX_PULL))
    currentPull.current = pull
    button.style.setProperty('--rope-pull', `${pull}px`)
    button.style.setProperty('--rope-scale', String(1 + pull / ROPE_LENGTH))
  }

  const resetPull = (event: React.PointerEvent<HTMLButtonElement>, shouldSwitch: boolean) => {
    const start = pointerStart.current
    if (!start || start.id !== event.pointerId) return
    const distance = event.clientY - start.y
    const pull = currentPull.current
    pointerStart.current = null
    currentPull.current = 0
    setPulling(false)
    startSnap(pull)
    if (shouldSwitch && distance >= 10) {
      suppressClick.current = true
      window.setTimeout(() => { suppressClick.current = false }, 0)
      onToggle()
    }
  }

  const onButtonClick = () => {
    if (suppressClick.current) {
      suppressClick.current = false
      return
    }
    switchLamp()
  }

  const action = theme === 'dark' ? 'Turn the light on' : 'Turn the light off'

  return <button
    ref={buttonRef}
    className={`lamp-switch ${theme === 'light' ? 'lamp-on' : 'lamp-off'}${pulling ? ' is-pulling' : ''}${autoPulling ? ' is-auto-pulling' : ''}${snapping ? ' is-snapping' : ''}`}
    type="button"
    aria-label={`${action}; current theme is ${theme}`}
    aria-pressed={theme === 'light'}
    title={`${action} · ${theme} mode`}
    onClick={onButtonClick}
    onFocus={cancelWelcomeDemo}
    onKeyDown={event => {
      if (event.key === 'Enter' || event.key === ' ') cancelWelcomeDemo()
    }}
    onPointerDown={handlePointerDown}
    onPointerMove={handlePointerMove}
    onPointerUp={event => resetPull(event, true)}
    onPointerCancel={event => resetPull(event, false)}
  >
    <span className="lamp-glow" aria-hidden="true" />
    <svg className="lamp-svg" viewBox="0 0 48 120" aria-hidden="true" focusable="false">
      <path className="lamp-mount" d="M21 2h6v4h-6zM18 6h12v3H18z" />
      <path className="lamp-shade" d="M13 14c1.4-4.1 5.1-6.2 11-6.2S33.6 9.9 35 14l-3.4 13H16.4L13 14Z" />
      <path className="lamp-rim" d="M15 26.5h18" />
      <ellipse className="lamp-bulb" cx="24" cy="22" rx="3.1" ry="4.2" />
      <path className="lamp-ray" d="M10 12 7.5 9.5M38 12l2.5-2.5M24 4V1" />
      <g className="lamp-rope-group"><line className="lamp-cord" x1="24" y1="29" x2="24" y2="107" />
        <g className="lamp-pull-handle"><circle cx="24" cy="110" r="4.2" /><path d="M24 107v-3" /></g>
      </g>
    </svg>
    <span className="sr-only">{action}. Drag the cord down or activate to switch theme.</span>
  </button>
}
