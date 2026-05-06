import { Link } from 'react-router'
import { RiInstagramLine, RiTiktokLine, RiTwitterXLine, RiArrowRightUpLine } from 'react-icons/ri'

const CSS = `
  .footer-root {
    border-top: 1px solid var(--c-border);
    padding: 60px 48px 40px; /* Reduced from 100px/60px */
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 40px; /* Reduced from 60px */
  }

  .footer-brand {
    max-width: 450px;
  }

  .footer-brand__name {
    font-family: var(--font-display);
    font-size: 38px;
    font-weight: 700;
    letter-spacing: -0.01em;
    text-transform: uppercase;
    color: var(--c-white);
    text-decoration: none;
    display: inline-block;
    position: relative;
    margin-bottom: 8px; /* Slightly reduced */
  }

  .footer-brand__name::after {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    background: var(--c-accent);
    border-radius: 50%;
    margin-left: 4px;
  }

  .footer-brand__rule {
    width: 40px; /* Shortened rule */
    height: 2px;
    background: var(--c-accent);
    margin: 12px 0 16px; /* Reduced vertical margin */
    border: none;
  }

  .footer-brand__tagline {
    font-family: var(--font-primary);
    font-size: 15px;
    line-height: 1.5; /* Slightly tighter leading */
    color: var(--c-muted);
    max-width: 340px;
  }

  .footer-content {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 30px; /* Reduced from 50px */
  }

  .footer-actions {
    display: flex;
    gap: 12px; /* Tighter button grouping */
  }

  .footer-btn {
    font-family: var(--font-mono);
    font-size: 11px; /* Slightly smaller text */
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--c-white);
    text-decoration: none;
    padding: 12px 24px; /* Reduced from 16px 36px */
    border: 1px solid var(--c-border);
    display: flex;
    align-items: center;
    gap: 8px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
  }

  .footer-btn:hover {
    border-color: var(--c-accent);
    color: var(--c-accent);
    transform: translateY(-2px);
  }

  .footer-social-wrap {
    text-align: right;
  }

  .social-label {
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.2em;
    color: var(--c-muted);
    display: block;
    margin-bottom: 12px; /* Reduced from 20px */
  }

  .footer-socials {
    display: flex;
    gap: 20px; /* Reduced from 24px */
  }

  .footer-socials a {
    color: var(--c-accent);
    font-size: 24px; /* Slightly smaller icons */
    transition: transform 0.3s ease, filter 0.3s ease;
  }

  .footer-socials a:hover {
    transform: scale(1.1);
    filter: brightness(1.3);
  }

  .footer-legal {
    padding: 24px 48px; /* Reduced from 40px */
    border-top: 1px solid var(--c-border);
    display: flex;
    justify-content: space-between;
    font-family: var(--font-mono);
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.15em;
    color: var(--c-muted);
  }

  @media (max-width: 900px) {
    .footer-root {
      flex-direction: column;
      padding: 40px 24px;
      gap: 32px;
    }
    .footer-content {
      align-items: flex-start;
    }
    .footer-social-wrap {
      text-align: left;
    }
    .footer-legal {
      padding: 24px;
      flex-direction: column;
      gap: 10px;
    }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id
  tag.textContent = css
  document.head.appendChild(tag)
}

export function Footer() {
  injectCSS('footer-css', CSS)
  const year = new Date().getFullYear()

  return (
    <footer>
      <div className="footer-root">
        <div className="footer-brand">
          <Link to="/" className="footer-brand__name">
            Director Bee
          </Link>
          <hr className="footer-brand__rule" />
          <p className="footer-brand__tagline">
            Director & Visual Strategist. Elevating artist identity through 
            bespoke cinematic storytelling and growth-focused visual strategy.
          </p>
        </div>

        <div className="footer-content">
          <div className="footer-actions">
            <Link to="/about" className="footer-btn">
              About
            </Link>
            <Link to="/contact" className="footer-btn">
              Contact <RiArrowRightUpLine />
            </Link>
          </div>

          <div className="footer-social-wrap">
            <span className="social-label">Socials</span>
            <div className="footer-socials">
              <a href="https://www.instagram.com/directorbee_?igsh=MTl5ZmQ2NGFkazhtMw==" target="_blank" rel="noopener noreferrer">
                <RiInstagramLine />
              </a>
              <a href="https://www.tiktok.com/@directorbee_?_r=1&_t=ZS-967fIuAWCHQ" target="_blank" rel="noopener noreferrer">
                <RiTiktokLine />
              </a>
              <a href="https://x.com/Blessing_Jobt" target="_blank" rel="noopener noreferrer">
                <RiTwitterXLine />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-legal">
        <span>© {year} Director Bee</span>
        <span>Creative Direction — Visual Strategy — Narrative</span>
      </div>
    </footer>
  )
}