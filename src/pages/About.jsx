import { Link } from 'react-router'
import { RiArrowRightLine } from 'react-icons/ri'

const CSS = `
  .about-page {
    padding: 60px 48px; /* Reduced from 100px */
    min-height: 100vh;
    background: #000;
  }

  .about-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 50px; /* Reduced from 80px */
  }

  .about-top__rule {
    flex: 1;
    height: 1px;
    background: var(--c-border);
  }

  .about-top__label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--c-muted);
  }

  .about-body {
    display: grid;
    grid-template-columns: 1fr 1.2fr;
    gap: 60px; /* Reduced from 100px */
    align-items: start;
  }

  .about-left {
    position: sticky;
    top: 100px;
  }

  .about-image-frame {
    width: 100%;
    aspect-ratio: 4 / 5;
    background: var(--c-border);
    border: 1px solid var(--c-border);
    position: relative;
    overflow: hidden;
    margin-bottom: 24px; /* Reduced from 40px */
  }

  .about-image-frame img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .about-name-sub {
    font-family: var(--font-display);
    font-size: 38px; /* Slightly smaller */
    color: var(--c-white);
    text-transform: uppercase;
    margin-bottom: 8px; /* Reduced from 12px */
  }

  .about-name-sub em {
    color: var(--c-accent);
    font-style: normal;
  }

  .about-role {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--c-muted);
    line-height: 1.8;
  }

  .about-stats {
    display: flex;
    gap: 32px; /* Reduced from 48px */
    margin-top: 32px; /* Reduced from 48px */
    padding-top: 32px; /* Reduced from 48px */
    border-top: 1px solid var(--c-border);
  }

  .about-stat {
    display: flex;
    flex-direction: column;
    gap: 4px; /* Reduced from 8px */
  }

  .about-stat__number {
    font-family: var(--font-display);
    font-size: 32px; /* Slightly smaller */
    color: var(--c-white);
  }

  .about-stat__label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-muted);
  }

  .about-right {
    display: flex;
    flex-direction: column;
    gap: 24px; /* Reduced from 40px */
  }

  .about-lead {
    font-family: var(--font-display);
    font-size: clamp(22px, 2.5vw, 32px);
    line-height: 1.3;
    color: var(--c-white);
    letter-spacing: -0.01em;
    margin-bottom: 8px;
  }

  .about-lead em {
    color: var(--c-accent);
    font-style: italic;
  }

  .about-body-text {
    font-family: var(--font-primary);
    font-size: 15px;
    line-height: 1.7;
    color: var(--c-muted);
    max-width: 580px;
  }

  .about-credits {
    margin-top: 16px;
    padding-top: 32px; /* Reduced from 40px */
    border-top: 1px solid var(--c-border);
  }

  .about-credits__label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-bottom: 16px; /* Reduced from 24px */
  }

  .about-credits__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px; /* Tighter tags */
  }

  .about-credit-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--c-white);
    border: 1px solid var(--c-border);
    padding: 6px 14px; /* Slightly tighter padding */
    transition: all 0.3s ease;
  }

  .about-credit-tag:hover {
    border-color: var(--c-accent);
    color: var(--c-accent);
  }

  .about-cta {
    margin-top: 20px;
    display: flex;
    align-items: center;
    gap: 24px; /* Reduced from 32px */
  }

  .about-cta__link {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #000;
    background: var(--c-white);
    text-decoration: none;
    padding: 14px 28px; /* Reduced from 18px 32px */
    display: inline-flex;
    align-items: center;
    gap: 10px;
    transition: all 0.3s ease;
  }

  .about-cta__link:hover {
    background: var(--c-accent);
    color: #fff;
  }

  .about-cta__secondary {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: var(--c-muted);
    text-decoration: none;
    transition: color 0.3s ease;
  }

  .about-cta__secondary:hover {
    color: var(--c-white);
  }

  @media (max-width: 1024px) {
    .about-body { grid-template-columns: 1fr; gap: 48px; }
    .about-left { position: static; max-width: 600px; }
    .about-page { padding: 40px 24px; }
    .about-top { margin-bottom: 40px; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

const CREDITS = [
  'Simi', 'Olamide', 'Wagada', 'SYN',
  'Rema', 'Asake', 'Alexa Vibez', 'Meta AI',
  'He_is_Megar', 'Oshamo',
]

export function About() {
  injectCSS('about-css', CSS)

  return (
    <main className="about-page">
      <div className="about-top">
        <span className="about-top__label">Director Profile</span>
        <div className="about-top__rule" />
        <span className="about-top__label">Available Worldwide</span>
      </div>

      <div className="about-body">
        <div className="about-left">
          <div className="about-image-frame">
            <img src="profile.jpeg" alt="Director Bee" />
          </div>

          <h1 className="about-name-sub">
            Director <em>Bee.</em>
          </h1>

          <p className="about-role">
            Visual Strategist<br />
            Narrative Director<br />
            Lagos, Nigeria
          </p>

          <div className="about-stats">
            <div className="about-stat">
              <span className="about-stat__number">40+</span>
              <span className="about-stat__label">Projects</span>
            </div>
            <div className="about-stat">
              <span className="about-stat__number">3+</span>
              <span className="about-stat__label">Years</span>
            </div>
            <div className="about-stat">
              <span className="about-stat__number">5+</span>
              <span className="about-stat__label">Record Lables</span>
            </div>
          </div>
        </div>

        <div className="about-right">
          <p className="about-lead">
            Building worlds frame by frame — where <em>culture meets cinema</em>, and every visual <em>scales the artist</em>.
          </p>

          <p className="about-body-text">
            Director Bee is a Lagos-based visual strategist and director whose work 
            redefines the boundaries of African music videos. By treating every frame 
            as a strategic asset, she creates immersive worlds that bridge the gap 
            between raw culture and high-end commercial cinema.
          </p>

          <p className="about-body-text">
            Her approach is rooted in narrative longevity. In an era of fleeting 
            content, she focuses on building iconic visual signatures that help 
            artists grow their global footprint. From creative direction to 
            full-scale production, she ensures the visual matches the ambition 
            of the sound.
          </p>

          <p className="about-body-text">
            Operating out of Lagos, Nigeria, she is available for commissions and 
            collaborations worldwide, bringing a sophisticated West African 
            perspective to the global stage.
          </p>

          <div className="about-credits">
            <p className="about-credits__label">Selected Collaborators</p>
            <div className="about-credits__list">
              {CREDITS.map((name) => (
                <span key={name} className="about-credit-tag">{name}</span>
              ))}
            </div>
          </div>

          <div className="about-cta">
            <Link to="/contact" className="about-cta__link">
              Start a Project <RiArrowRightLine />
            </Link>
            <Link to="/" className="about-cta__secondary">
              View Works
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}