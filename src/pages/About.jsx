import { useState, useEffect } from 'react'
import { Link } from 'react-router'
import { RiArrowRightLine } from 'react-icons/ri'

const CSS = `
  .about-page {
    padding: 60px 48px;
    min-height: 100vh;
    background: #000;
  }

  .about-top {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 50px;
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
    gap: 60px;
    align-items: start;
  }

  .about-left {
    position: sticky;
    top: 100px;
  }

  /* ── Image Slider ── */
  .about-image-frame {
    width: 100%;
    aspect-ratio: 4 / 5;
    background: #111;
    border: 1px solid var(--c-border);
    position: relative;
    overflow: hidden;
    margin-bottom: 24px;
  }

  .about-slider-img {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0;
    transition: opacity 1.2s cubic-bezier(0.4, 0, 0.2, 1);
  }

  .about-slider-img.active {
    opacity: 1;
  }

  .about-name-sub {
    font-family: var(--font-display);
    font-size: 38px;
    color: var(--c-white);
    text-transform: uppercase;
    margin-bottom: 8px;
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

  /* ── Refined Stats ── */
  .about-stats {
    display: flex;
    gap: 32px;
    margin-top: 32px;
    padding-top: 32px;
    border-top: 1px solid var(--c-border);
  }

  .about-stat {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .about-stat__number {
    font-family: var(--font-display);
    font-size: 32px;
    color: var(--c-white);
  }

  .about-stat__label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-muted);
    line-height: 1.4;
  }

  .about-stat__sub {
    font-size: 7px;
    opacity: 0.6;
    display: block;
    margin-top: 2px;
  }

  .about-right {
    display: flex;
    flex-direction: column;
    gap: 24px;
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
    padding-top: 32px;
    border-top: 1px solid var(--c-border);
  }

  .about-credits__label {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-bottom: 16px;
  }

  .about-credits__list {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .about-credit-tag {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--c-white);
    border: 1px solid var(--c-border);
    padding: 6px 14px;
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
    gap: 24px;
  }

  .about-cta__link {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #000;
    background: var(--c-white);
    text-decoration: none;
    padding: 14px 28px;
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
  'Oshamo', 'Simi', 'Olamide', 'Wagada', 'SYN',
  'Alexa Vibez', 'Meta AI', 'He_is_Megar'
]

const SLIDER_IMAGES = [
  'bee.jpeg',
  'bee2.jpeg',
  'olamide.jpeg',
]

export function About() {
  injectCSS('about-css', CSS)

  const [currentImg, setCurrentImg] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImg((prev) => (prev + 1) % SLIDER_IMAGES.length)
    }, 3000) 
    return () => clearInterval(timer)
  }, [])

  return (
    <main className="about-page">
      <div className="about-top">
        <span className="about-top__label">Director's Profile</span>
        <div className="about-top__rule" />
        <span className="about-top__label">Available Worldwide</span>
      </div>

      <div className="about-body">
        <div className="about-left">
          <div className="about-image-frame">
            {SLIDER_IMAGES.map((src, idx) => (
              <img
                key={src}
                src={src}
                alt="Director Bee"
                className={`about-slider-img ${idx === currentImg ? 'active' : ''}`}
              />
            ))}
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
              <span className="about-stat__number">30+</span>
              <span className="about-stat__label">Projects</span>
            </div>
            <div className="about-stat">
              <span className="about-stat__number">2+</span>
              <span className="about-stat__label">Years</span>
            </div>
            <div className="about-stat">
              <span className="about-stat__number">3+</span>
              <span className="about-stat__label">
                Labels
                <span className="about-stat__sub">Including management teams</span>
              </span>
            </div>
          </div>
        </div>

        <div className="about-right">
          <p className="about-lead">
            Building worlds frame by frame: where <em>culture meets cinema</em>, and every visual <em>scales the artist</em>.
          </p>

          <p className="about-body-text">
            Director Bee is a Lagos-based visual strategist and director crafting immersive visual worlds that push African music beyond the expected. Her work lives at the intersection of culture and the surreal; where grounded realities meet elevated, almost supernatural expressions.
          </p>

          <p className="about-body-text">
            Known for translating bold concepts into striking visuals, she approaches every frame as both art and strategy. From shaping an artist’s visual identity to directing full-scale productions, she builds cohesive rollouts that don’t just support the music, but expand its reach and impact.
          </p>

          <p className="about-body-text">
            Her philosophy is rooted in narrative longevity. In a fast-moving content landscape, she focuses on creating distinct visual languages that position artists for global recognition. Based in Lagos, Nigeria, she works with artists and teams across markets on projects and select collaborations, bringing a refined West African perspective to the global stage.
          </p>

          <div className="about-credits">
            <p className="about-credits__label">Selected Collaborations</p>
            <div className="about-credits__list">
              {CREDITS.map((name) => (
                <span key={name} className="about-credit-tag">{name}</span>
              ))}
            </div>
          </div>

          <div className="about-credits" style={{ borderTop: 'none', paddingTop: 0 }}>
             <p className="about-credits__label">Management Teams</p>
             <div className="about-credits__list">
              <span className="about-credit-tag">JMB records</span>
              <span className="about-credit-tag">emPAWA Africa</span>
                <span className="about-credit-tag">Afrolit</span>
                
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