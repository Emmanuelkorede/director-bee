

import { useState, useEffect } from 'react'
import { getShoots, getShootFrames } from '../../hooks/useFrames'
import { FrameCard } from './FrameCard'
import { Lightbox } from './Lightbox'

// ── CSS ──────────────────────────────────────────────────────────────────────

const CSS = `
  /* ── Page section ── */
  .sgallery-section {
    padding: 48px 32px 80px;
    min-height: 80vh;
  }

  /* ── Page header ── */
  .sgallery-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 56px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-border);
  }

  .sgallery-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--c-accent);
    margin-bottom: 6px;
  }

  .sgallery-title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(28px, 4vw, 44px);
    letter-spacing: 0.08em;
    color: var(--c-white);
    line-height: 1;
  }

  .sgallery-shoot-count {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--c-muted);
    opacity: 0.6;
  }

  /* ── Individual shoot block ── */
  .sgallery-shoot {
    margin-bottom: 72px;
  }

  .sgallery-shoot:last-child { margin-bottom: 0; }

  /* Shoot title row — clickable accordion trigger */
  .sgallery-shoot__trigger {
    width: 100%;
    background: none;
    border: none;
    border-bottom: 1px solid var(--c-border);
    padding: 0 0 16px;
    margin-bottom: 24px;
    cursor: pointer;
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 16px;
    text-align: left;
  }

  .sgallery-shoot__trigger:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 4px;
  }

  .sgallery-shoot__name {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(20px, 3vw, 30px);
    letter-spacing: 0.06em;
    color: var(--c-white);
    line-height: 1;
  }

  .sgallery-shoot__info {
    display: flex;
    align-items: center;
    gap: 20px;
    flex-shrink: 0;
  }

  .sgallery-shoot__frame-count {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0.6;
  }

  /* Chevron icon — rotates when expanded */
  .sgallery-chevron {
    display: flex;
    align-items: center;
    color: var(--c-muted);
    transition: transform 0.35s ease, color 0.2s ease;
  }

  .sgallery-shoot__trigger[aria-expanded='true'] .sgallery-chevron {
    transform: rotate(180deg);
    color: var(--c-accent);
  }

  /* ── Masonry-style frame grid ── */
  .sgallery-grid {
    columns: 3;
    column-gap: 3px;
    /* CSS columns give a Pinterest-style layout — images fill column height naturally */
  }

  .sgallery-grid .fcard {
    break-inside: avoid;        /* never slice a card across a column break */
    margin-bottom: 3px;
    display: block;
    width: 100%;
    /* Height is intrinsic to the image — no fixed row height needed */
  }

  /* ── Frames loading state ── */
  .sgallery-frames-loading {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 3px;
    margin-bottom: 3px;
  }

  .sgallery-frames-loading__item {
    height: 200px;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.06) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: sgSkelShimmer 1.6s ease infinite;
  }

  @keyframes sgSkelShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Responsive ── */
/* ── Responsive ── */
  @media (max-width: 900px) {
    .sgallery-grid { 
      columns: 2; 
      column-gap: 4px; /* Slightly wider gap for touch */
    }
    .sgallery-frames-loading { grid-template-columns: repeat(2, 1fr); }
  }

  @media (max-width: 560px) {
    .sgallery-section { padding: 32px 12px 60px; }
    
    /* This stops the "Endless Scroll" - keeps 2 columns on mobile */
    .sgallery-grid { 
      columns: 2; 
      column-gap: 4px; 
    }
    
    .sgallery-grid .fcard {
      margin-bottom: 4px; /* Match the gap */
    }

    .sgallery-frames-loading { grid-template-columns: repeat(2, 1fr); }

    /* Shrink the titles slightly on mobile so they don't wrap weirdly */
    .sgallery-shoot__name {
      font-size: 18px;
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

// ── Lightbox (self-contained, no external deps) ───────────────────────────────



// ── Single Shoot Block ────────────────────────────────────────────────────────

function ShootBlock({ shoot }) {
  const [expanded,      setExpanded]      = useState(false)
  const [frames,        setFrames]        = useState([])
  const [framesLoading, setFramesLoading] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(null)

  // Lazy-load frames on first expand
  async function handleToggle() {
    const willExpand = !expanded
    setExpanded(willExpand)

    if (willExpand && frames.length === 0) {
      setFramesLoading(true)
      const { data } = await getShootFrames(shoot.id)


      setFrames(data ?? [])
      setFramesLoading(false)
    }
  }

  function openLightbox(index) { setLightboxIndex(index) }
  function closeLightbox()     { setLightboxIndex(null) }
  function prevFrame() {
    setLightboxIndex((i) => (i - 1 + frames.length) % frames.length)
  }
  function nextFrame() {
    setLightboxIndex((i) => (i + 1) % frames.length)
  }

  return (
    <div className="sgallery-shoot">
      {/* Accordion trigger */}
      <button
        className="sgallery-shoot__trigger"
        aria-expanded={expanded}
        aria-controls={`shoot-frames-${shoot.id}`}
        onClick={handleToggle}
        type="button"
      >
        <h2 className="sgallery-shoot__name">{shoot.title}</h2>
        <div className="sgallery-shoot__info">
          <span className="sgallery-shoot__frame-count">
            {shoot.frame_count} {shoot.frame_count === 1 ? 'frame' : 'frames'}
          </span>
          <span className="sgallery-chevron" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 6l5 5 5-5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </button>

      {/* Frames panel */}
      <div id={`shoot-frames-${shoot.id}`}>
        {expanded && framesLoading && (
          <div className="sgallery-frames-loading" aria-busy="true">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sgallery-frames-loading__item" />
            ))}
          </div>
        )}

        {expanded && !framesLoading && frames.length > 0 && (
          <div className="sgallery-grid">
            {frames.map((frame, index) => (
              <FrameCard
                key={frame.id}
                frame={frame}
                onClick={() => openLightbox(index)}
              />
            ))}
          </div>
        )}

        {expanded && !framesLoading && frames.length === 0 && (
          <p style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'var(--c-muted)',
            opacity: 0.5,
            padding: '24px 0',
          }}>
            No frames uploaded yet.
          </p>
        )}
      </div>

      {/* Lightbox (per-shoot, so navigation stays within the shoot) */}
      <Lightbox
        frames={frames}
        currentIndex={lightboxIndex}
        onClose={closeLightbox}
        onPrev={prevFrame}
        onNext={nextFrame}
      />
    </div>
  )
}

// ── ShootGallery (page-level component) ──────────────────────────────────────

export function ShootGallery() {
  injectCSS('sgallery-css', CSS)

  const [shoots,  setShoots]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      const { data, error } = await getShoots()
      if (cancelled) return
      if (error) setError(error.message)
      else setShoots(data ?? [])
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="sgallery-section" aria-labelledby="frames-heading">

      {/* Page header */}
      <div className="sgallery-header">
        <div>
          <p className="sgallery-eyebrow">Stills from projects</p>
          <h1 className="sgallery-title" id="frames-heading">Frames</h1>
        </div>
        {!loading && !error && (
          <span className="sgallery-shoot-count">
            {shoots.length.toString().padStart(2, '0')} shoots
          </span>
        )}
      </div>

      {/* States */}
      {loading && (
        <div aria-busy="true">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} style={{ marginBottom: '56px' }}>
              <div style={{
                height: '1px',
                background: 'var(--c-border)',
                marginBottom: '24px',
              }} />
              <div className="sgallery-frames-loading">
                {Array.from({ length: 6 }).map((_, j) => (
                  <div key={j} className="sgallery-frames-loading__item" />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {error && (
        <p style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          color: 'var(--c-accent)',
          padding: '48px 0',
        }}>
          {error}
        </p>
      )}

      {!loading && !error && shoots.map((shoot) => (
        <ShootBlock key={shoot.id} shoot={shoot} />
      ))}

    </section>
  )
}