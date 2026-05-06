import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { Menu, X } from 'lucide-react'
import { HamburgerMenu } from './HamburgerMenu'

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&family=Outfit:wght@300;500&display=swap');

  :root {
    --c-black: #050505;
    --c-white: #ffffff;
    --c-muted: #888888;
    --c-accent: #c84b2f;
    --c-border: rgba(255,255,255,0.1);
    --nav-h: 70px;
    --font-sans: 'Inter', sans-serif;
    --font-heading: 'Outfit', sans-serif;
  }

  body {
    background: var(--c-black);
    color: var(--c-white);
    font-family: var(--font-sans);
    -webkit-font-smoothing: antialiased;
  }

  .nav-root {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 100;
    height: var(--nav-h);
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--c-border);
    transition: all 0.3s ease;
  }

  .nav-root.scrolled {
    background: rgba(5,5,5,0.8);
    height: 60px;
  }

  .nav-logo {
    text-decoration: none;
    display: flex;
    flex-direction: column;
    line-height: 1.1;
  }

  .nav-logo__name {
    font-family: var(--font-heading);
    font-weight: 500;
    font-size: 22px;
    letter-spacing: -0.02em;
    color: var(--c-white);
    text-transform: uppercase;
  }

  .nav-logo__name span {
    color: var(--c-accent);
  }

  .nav-logo__role {
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--c-muted);
    font-weight: 400;
  }

  .nav-toggle-btn {
    background: none;
    border: none;
    color: var(--c-white);
    cursor: pointer;
    padding: 4px;
    transition: opacity 0.2s;
  }

  .nav-toggle-btn:hover {
    opacity: 0.7;
  }
`

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!document.getElementById('nav-styles')) {
      const tag = document.createElement('style')
      tag.id = 'nav-styles'
      tag.textContent = CSS
      document.head.appendChild(tag)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <nav className={`nav-root ${scrolled ? 'scrolled' : ''}`}>
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <span className="nav-logo__name">
            Director Bee<span>.</span>
          </span>
          
        </Link>

        <button
          className="nav-toggle-btn"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle Menu"
        >
          {menuOpen ? <X size={28} strokeWidth={1.5} /> : <Menu size={28} strokeWidth={1.5} />}
        </button>
      </nav>

      <HamburgerMenu isOpen={menuOpen} onClose={closeMenu} />
    </>
  )
}