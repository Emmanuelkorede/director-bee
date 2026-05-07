import { useEffect, useRef } from 'react'
import { NavLink, useLocation , Link } from 'react-router'
import { RiInstagramLine, RiTiktokLine, RiMailLine } from 'react-icons/ri'

const NAV_LINKS = [
  { to: '/',              label: 'Cinema',        index: '01' },
  { to: '/music-videos',  label: 'Music Videos',  index: '02' },
  { to: '/rollout',       label: 'Rollout',       index: '03' },
  { to: '/mobile-content',label: 'Mobile',index: '04' },
  { to: '/frames',        label: 'Frames',        index: '05' },
  { to: '/about',         label: 'About',         index: '06' },
  { to: '/contact',       label: 'Contact',       index: '07' },

]

const CSS = `
  .hmenu-overlay {
    position: fixed;
    inset: 0;
    z-index: 99;
    pointer-events: none;
    visibility: hidden;
  }

  .hmenu-overlay.open {
    pointer-events: all;
    visibility: visible;
  }

  .hmenu-backdrop {
    position: absolute;
    inset: 0;
    background: rgba(9,9,9,0.6);
    opacity: 0;
    transition: opacity 0.5s ease;
  }

  .hmenu-overlay.open .hmenu-backdrop {
    opacity: 1;
  }

  .hmenu-panel {
    position: absolute;
    top: 0; right: 0;
    width: min(420px, 90vw);
    height: 100%;
    background: #0e0d0b;
    border-left: 1px solid var(--c-border);
    transform: translateX(100%);
    transition: transform 0.55s cubic-bezier(0.76, 0, 0.24, 1);
    display: flex;
    flex-direction: column;
    padding: 80px 48px 48px;
    overflow-y: auto;
  }

  .hmenu-overlay.open .hmenu-panel {
    transform: translateX(0);
  }

  .hmenu-section-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-bottom: 32px;
  }

  .hmenu-links {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 4px;
    flex: 1;
  }

  .hmenu-link-item {
    overflow: hidden;
  }

  .hmenu-link {
    display: flex;
    align-items: baseline;
    gap: 16px;
    text-decoration: none;
    padding: 12px 0;
    border-bottom: 1px solid var(--c-border);
    color: var(--c-white);
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.5s ease,
      transform 0.5s ease,
      color 0.2s ease;
  }

  .hmenu-overlay.open .hmenu-link {
    opacity: 1;
    transform: translateY(0);
  }

  .hmenu-overlay.open .hmenu-link:nth-child(1) { transition-delay: 0.15s; }
  .hmenu-overlay.open .hmenu-link:nth-child(2) { transition-delay: 0.20s; }
  .hmenu-overlay.open .hmenu-link:nth-child(3) { transition-delay: 0.25s; }
  .hmenu-overlay.open .hmenu-link:nth-child(4) { transition-delay: 0.30s; }
  .hmenu-overlay.open .hmenu-link:nth-child(5) { transition-delay: 0.35s; }
  .hmenu-overlay.open .hmenu-link:nth-child(6) { transition-delay: 0.40s; }

  .hmenu-link__index {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    color: var(--c-muted);
    flex-shrink: 0;
  }

  .hmenu-link__label {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(28px, 5vw, 38px);
    letter-spacing: 0.04em;
    line-height: 1;
    transition: letter-spacing 0.3s ease;
  }

  .hmenu-link:hover .hmenu-link__label,
  .hmenu-link.active .hmenu-link__label {
    color: var(--c-accent);
    letter-spacing: 0.08em;
  }

  .hmenu-link.active .hmenu-link__index {
    color: var(--c-accent);
  }

  .hmenu-footer {
    margin-top: 28px;
    padding-top: 24px;
    border-top: 1px solid var(--c-border);
    display: flex;
    gap: 24px;
    align-items: center;
  }

  .hmenu-footer a {
    color: var(--c-muted);
    font-size: 20px;
    text-decoration: none;
    transition: color 0.2s ease;
    display: flex;
    align-items: center;
  }

  .hmenu-footer a:hover { color: var(--c-white); }

  .start-project-btn {
    background: var(--c-accent);
    color: var(--c-black);
    border: 1px solid var(--c-accent);
    padding: 12px 24px;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    transition: background 0.2s ease, color 0.2s ease;
    margin-top : 20px ;
  }

  .start-project-btn:hover {
    background: var(--c-black);
    color: var(--c-accent);
  }
`

function injectMenuCSS() {
  if (typeof document === 'undefined') return
  if (document.getElementById('hmenu-css')) return
  const tag = document.createElement('style')
  tag.id = 'hmenu-css'
  tag.textContent = CSS
  document.head.appendChild(tag)
}

export function HamburgerMenu({ isOpen, onClose }) {
  injectMenuCSS()

  const panelRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    if (!isOpen) return
    function onKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  useEffect(() => {
    onClose()
  }, [location.pathname])

  useEffect(() => {
    if (isOpen && panelRef.current) {
      const focusable = panelRef.current.querySelectorAll(
        'a, button, [tabindex]:not([tabindex="-1"])'
      )
      focusable[0]?.focus()
    }
  }, [isOpen])

  return (
    <div
      id="main-menu"
      className={`hmenu-overlay${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
    >
      <div
        className="hmenu-backdrop"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="hmenu-panel"https ref={panelRef}>
        <p className="hmenu-section-label">Navigation</p>

        <ul className="hmenu-links" role="list">
          {NAV_LINKS.map(({ to, label, index }) => (
            <li key={to} className="hmenu-link-item">
              <NavLink
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `hmenu-link${isActive ? ' active' : ''}`
                }
              >
                <span className="hmenu-link__index" aria-hidden="true">
                  {index}
                </span>
                <span className="hmenu-link__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>

        <Link  to="/contact" className="start-project-btn">
          Start a project
        </Link>

        <div className="hmenu-footer">
          <a
            href="https://www.instagram.com/directorbee_?igsh=MTl5ZmQ2NGFkazhtMw=="
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiInstagramLine />
          </a>
          <a
            href="https://www.tiktok.com/@directorbee_?_r=1&_t=ZS-967fIuAWCHQ"
            target="_blank"
            rel="noopener noreferrer"
          >
            <RiTiktokLine />
          </a>
          <a href="mailto:officialdirectorbee@gmail.com">
            <RiMailLine />
          </a>
        </div>
      </div>
    </div>
  )
}