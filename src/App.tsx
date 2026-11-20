import { useEffect, useRef, useState } from 'react'
import InteractivePortrait from './components/InteractivePortrait'
import RLogo from './components/RLogo'
import ThemeLamp from './components/ThemeLamp'
import { navigation, projects, technologies } from './data/portfolio'
import { useAnchorScroll } from './hooks/useAnchorScroll'
import { useScrollReveal } from './hooks/useScrollReveal'

function App() {
  useScrollReveal()
  useAnchorScroll()
  const [theme, setTheme] = useState<'dark' | 'light'>(() => document.documentElement.dataset.theme === 'light' ? 'light' : 'dark')
  const themeDemoPreview = useRef(false)
  const [menuOpen, setMenuOpen] = useState(false)
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    if (themeDemoPreview.current) return
    try { localStorage.setItem('raj-theme', theme) } catch { /* storage may be unavailable */ }
  }, [theme])

  return <>
    <header className="site-header">
      <a className="brand" href="#top" aria-label="R logo"><RLogo className="r-logo" /></a>
      <button className="menu-toggle" aria-label={menuOpen ? 'Close navigation' : 'Open navigation'} aria-expanded={menuOpen} onClick={() => setMenuOpen(!menuOpen)}><span /><span /></button>
      <nav className={menuOpen ? 'navigation is-open' : 'navigation'} aria-label="Main navigation">
        {navigation.map(item => <a key={item.href} href={item.href} onClick={() => setMenuOpen(false)}>{item.label}</a>)}
      </nav>
      <ThemeLamp
        theme={theme}
        onToggle={() => setTheme(current => current === 'dark' ? 'light' : 'dark')}
        onDemoToggle={() => {
          themeDemoPreview.current = !themeDemoPreview.current
          setTheme(current => current === 'dark' ? 'light' : 'dark')
        }}
      />
    </header>

    <main id="top">
      <section className="hero section-wrap" aria-labelledby="hero-title">
        <div className="hero-copy">
          <p className="eyebrow" data-reveal="hero-eyebrow"><span className="eyebrow-line" /> FULL-STACK DEVELOPER <span className="eyebrow-handle">/ @rajcodex</span></p>
          <h1 id="hero-title" className="hero-headline">HEY, I'M<br /><span>RAJ</span><i className="hero-star" aria-hidden="true">✳</i></h1>
          <p className="hero-tagline" data-reveal="hero-tagline">I build things<br />for the <em>web.</em></p>
          <div className="hero-actions"><a className="button button-primary" data-reveal="hero-cta" style={{ '--reveal-delay': '330ms' } as React.CSSProperties} href="#projects">Explore projects <span aria-hidden="true">↘</span></a><a className="button button-quiet" data-reveal="hero-cta" style={{ '--reveal-delay': '410ms' } as React.CSSProperties} href="#contact">Get in touch <span aria-hidden="true">↗</span></a></div>
          <div className="hero-index" data-reveal="hero-index"><span>01 / 06</span><span>SCROLL TO EXPLORE <span aria-hidden="true">↓</span></span></div>
        </div>
        <div className="hero-art" data-reveal="portrait"><div className="hero-art-inner" data-parallax><InteractivePortrait /><div className="hero-side-note" aria-hidden="true">A LITTLE CODE.<br />A LOT OF CURIOSITY.</div></div></div>
      </section>

      <section className="about section-wrap section-block" id="about" data-section-reveal="about">
        <div className="section-kicker" data-reveal><span>01</span><span>THE PERSON BEHIND THE PIXELS</span></div>
        <div className="about-grid"><h2 data-reveal="about-heading">Nice to meet<br /><span>you<span className="blue-period">.</span></span></h2><div className="about-copy" data-reveal="about-copy"><p>I’m a Computer Engineering student at Vishwakarma Institute of Technology, Pune, and a Data Science student exploring the intersection of full-stack development, artificial intelligence and creative problem-solving. I enjoy turning ideas into useful digital products, experimenting with emerging technologies and building solutions to real-world problems.</p><a href="#contact" className="text-link">Let’s connect <span>↗</span></a></div></div>
        <div className="education-strip" data-reveal><span className="education-stamp">VIT</span><div><strong>Vishwakarma Institute of Technology</strong><span>Computer Engineering · Second year · Data Science</span></div><span className="education-place">PUNE, INDIA</span></div>
        <div className="about-footnote"><span>THOUGHTFUL BY DESIGN</span><span>BUILT WITH INTENTION <b>✳</b></span></div>
      </section>

      <section className="stack section-wrap section-block" id="skills" data-section-reveal="skills">
        <div className="section-kicker" data-reveal><span>02</span><span>TOOLS OF THE TRADE</span></div>
        <div className="section-heading-row"><h2 data-reveal>A curious<br /><em>toolkit.</em></h2><p data-reveal>Technologies I work with and ideas<br />I’m excited to keep exploring.</p></div>
        <div className="tech-grid">{technologies.map((item, index) => <div className={`tech-card tech-${item.color}`} key={item.name} data-reveal style={{ '--reveal-delay': `${index * 65}ms` } as React.CSSProperties}><span className="tech-mark" aria-hidden="true">{item.mark}</span><span className="tech-name">{item.name}</span><span className="tech-index">0{index + 1}</span></div>)}</div>
      </section>

      <section className="projects section-wrap section-block" id="projects" data-section-reveal="projects">
        <div className="section-kicker" data-reveal><span>03</span><span>SELECTED WORK · BUILT BY ME</span></div>
        <div className="section-heading-row"><h2 data-reveal>Ideas made<br /><em>real.</em></h2><p data-reveal>Five projects, each an excuse<br />to solve something differently.</p></div>
        <div className="project-grid">{projects.map((project, index) => <a className={`project-card ${project.featured ? 'project-featured' : ''}`} key={project.title} href={project.liveUrl} target="_blank" rel="noopener noreferrer" aria-label={`${project.title}: ${project.summary} Open project website in a new tab`} data-reveal style={{ '--reveal-delay': `${index * 90}ms` } as React.CSSProperties}>
          <div className="project-visual" aria-hidden="true"><span className="project-monogram">{project.mark}</span><span className="project-visual-index">0{index + 1} / 05</span><span className="project-visual-orbit" /></div>
          <div className="project-details"><div className="project-title-row"><h3>{project.title}</h3>{project.featured && <span className="featured-label"><i /> PROUDLY BUILT</span>}</div><p>{project.summary}</p><div className="project-bottom"><div className="project-stack" aria-label="Technologies">{project.stack.map(tool => <span key={tool}>{tool}</span>)}</div><span className="project-external" aria-hidden="true">↗</span></div></div>
        </a>)}</div>
      </section>

      <section className="achievement section-wrap section-block" id="achievement" data-section-reveal="achievement">
        <div className="section-kicker" data-reveal><span>04</span><span>A MOMENT WORTH FRAMING</span></div>
        <div className="achievement-card" data-reveal>
          <div className="achievement-visual" data-reveal style={{ '--reveal-delay': '80ms' } as React.CSSProperties} aria-hidden="true"><span className="achievement-orbit orbit-one" /><span className="achievement-orbit orbit-two" /><span className="achievement-visual-kicker">RECOGNITION / 01</span><span className="achievement-medal">✳</span><p className="achievement-first">FIRST<br />PRIZE</p><span className="achievement-visual-foot">MUMBAI · OPENGEN AI</span></div>
          <div className="achievement-copy" data-reveal style={{ '--reveal-delay': '180ms' } as React.CSSProperties}><span className="achievement-overline">FIRST PRIZE · OPENGEN AI</span><h2>First prize.<br /><em>Mumbai Hackathon.</em></h2><p>Organized by IES MCRC (IES Management College and Research Centre).</p><div className="award-bottom"><span>₹5,000 <small>CASH PRIZE</small></span><span className="award-domain">DOMAIN <b>OpenGen AI</b></span></div></div>
        </div>
      </section>

      <section className="contact section-wrap section-block" id="contact" data-section-reveal="contact">
        <div className="section-kicker" data-reveal><span>05</span><span>OPEN CHANNEL</span></div>
        <div className="contact-content" data-reveal><p className="eyebrow"><span className="live-dot" /> HAVE A GOOD ONE IN MIND?</p><h2>Let’s make<br /><em>it real.</em></h2><a className="button button-primary contact-button" href="mailto:salunkherajvardhan612@gmail.com">Email me <span aria-hidden="true">↗</span></a></div>
        <div className="contact-bottom" data-reveal="contact-bottom"><p>Good conversations make<br />great starting points.</p><div className="contact-social-column"><div className="social-links"><a href="https://github.com/Raj-s-salunkhe" target="_blank" rel="noopener noreferrer">GitHub <span>↗</span></a><a href="https://www.linkedin.com/in/raj-salunkhe-373b7539b" target="_blank" rel="noopener noreferrer">LinkedIn <span>↗</span></a><a href="https://www.instagram.com/rajj_salunkhe/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)"><span className="instagram-icon" aria-hidden="true">◎</span>Instagram <span>↗</span></a></div><div className="social-cards" aria-label="Social profiles">
          <a className="social-card" href="https://github.com/Raj-s-salunkhe" target="_blank" rel="noopener noreferrer" aria-label="Visit Raj on GitHub, opens in a new tab" data-reveal="social-card" style={{ '--reveal-delay': '70ms' } as React.CSSProperties}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 .9a11.1 11.1 0 0 0-3.51 21.63c.55.1.76-.24.76-.54v-2.1c-3.1.68-3.75-1.32-3.75-1.32-.5-1.29-1.23-1.63-1.23-1.63-1.01-.69.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 .1.75 2.78 3.71 1.97.1-.73.4-1.22.72-1.5-2.47-.28-5.07-1.24-5.07-5.51 0-1.22.44-2.21 1.15-2.99-.11-.28-.5-1.42.11-2.95 0 0 .94-.3 3.05 1.14a10.6 10.6 0 0 1 5.55 0c2.11-1.44 3.05-1.14 3.05-1.14.61 1.53.22 2.67.11 2.95.72.78 1.15 1.77 1.15 2.99 0 4.28-2.61 5.22-5.1 5.5.4.35.76 1.03.76 2.08v3.08c0 .3.2.65.77.54A11.1 11.1 0 0 0 12 .9Z" /></svg><span>GitHub</span><b aria-hidden="true">↗</b></a>
          <a className="social-card" href="https://www.linkedin.com/in/raj-salunkhe-373b7539b" target="_blank" rel="noopener noreferrer" aria-label="Visit Raj on LinkedIn, opens in a new tab" data-reveal="social-card" style={{ '--reveal-delay': '140ms' } as React.CSSProperties}><svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M5.2 3.5a2.2 2.2 0 1 1 0 4.4 2.2 2.2 0 0 1 0-4.4ZM3.3 9.6h3.8v11.1H3.3V9.6Zm6.2 0h3.6v1.5h.1c.5-.9 1.7-1.9 3.5-1.9 3.8 0 4.5 2.5 4.5 5.7v5.8h-3.8v-5.2c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9v5.3H9.5V9.6Z" /></svg><span>LinkedIn</span><b aria-hidden="true">↗</b></a>
          <a className="social-card" href="https://www.instagram.com/rajj_salunkhe/" target="_blank" rel="noopener noreferrer" aria-label="Visit Raj on Instagram, opens in a new tab" data-reveal="social-card" style={{ '--reveal-delay': '210ms' } as React.CSSProperties}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/><circle cx="17.6" cy="6.7" r="1.2" fill="currentColor"/></svg><span>Instagram</span><b aria-hidden="true">↗</b></a>
        </div></div></div>
      </section>
    </main>

    <footer className="site-footer section-wrap"><a className="footer-brand" href="#top" aria-label="R logo"><RLogo className="r-logo" /></a><div className="footer-socials"><a href="https://github.com/Raj-s-salunkhe" target="_blank" rel="noopener noreferrer">GH</a><a href="https://www.linkedin.com/in/raj-salunkhe-373b7539b" target="_blank" rel="noopener noreferrer">in</a><a href="https://www.instagram.com/rajj_salunkhe/" target="_blank" rel="noopener noreferrer" aria-label="Instagram (opens in a new tab)"><span className="instagram-icon" aria-hidden="true">◎</span></a></div><span>© {new Date().getFullYear()} — MADE WITH INTENTION</span><a href="#top" className="back-top">BACK TO TOP ↑</a></footer>
  </>
}

export default App
