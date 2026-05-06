

import { useEffect, useRef, useCallback } from 'react'

const CSS = `
  /* ── Backdrop ── */
  .lb-backdrop {
    position: fixed;
    inset: 0;
    z-index: 400;
    background: rgba(4,4,4,0.97);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    visibility: hidden;
    transition: opacity 0.35s ease, visibility 0.35s ease;
  }

  .lb-backdrop.open {
    opacity: 1;
    visibility: visible;
  }

  /* Grain texture */
  .lb-backdrop::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.5;
  }

  /* ── Close button ── */
  .lb-close {
    position: absolute;
    top: 20px;
    right: 24px;
    background: rgba(0,0,0,0.5); /* Add a slight background for better clickability */
    border: 1px solid var(--c-border);
    color: var(--c-white);
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 999; /* Higher than everything else */
    transition: all 0.2s ease;
  }

  .lb-close:hover {
    border-color: var(--c-accent);
    background: rgba(200,75,47,0.1);
  }

  .lb-close:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 2px;
  }

  /* ── Prev / Next nav buttons ── */
  .lb-nav {
position: absolute;
    top: 100px;    /* Push down so it doesn't overlap the close button area */
    bottom: 80px; /* Push up so it doesn't overlap the footer */
    width: 12%;   /* Use percentage for safer hit areas */
    background: none;
    border: none;
    color: var(--c-white);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.25s ease;
    z-index: 10;
  }

  /* Show nav on hover over the whole backdrop */
  .lb-backdrop:hover .lb-nav,
  .lb-backdrop.open .lb-nav:focus-visible {
    opacity: 0.5;
  }

  .lb-nav:hover { opacity: 1 !important; }

  .lb-nav--prev { left: 0; }
  .lb-nav--next { right: 0; }

  .lb-nav:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: -2px;
    opacity: 1 !important;
  }

  /* Disable nav if only one image */
  .lb-nav:disabled {
    cursor: default;
    opacity: 0 !important;
  }

  /* ── Main image ── */
  .lb-img-wrap {
    max-width: min(88vw, 1200px);
    max-height: 82vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    z-index: 5;
  }

  .lb-img {
    max-width: 100%;
    max-height: 82vh;
    object-fit: contain;
    display: block;
    box-shadow: 0 48px 120px rgba(0,0,0,0.85);
    /* Fade between images */
    animation: lbFadeIn 0.25s ease;
  }

  @keyframes lbFadeIn {
    from { opacity: 0; transform: scale(0.98); }
    to   { opacity: 1; transform: scale(1); }
  }

  /* ── Caption + counter strip ── */
  .lb-footer {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6px;
    pointer-events: none;
    z-index: 10;
    white-space: nowrap;
  }

  .lb-caption {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: var(--c-white);
    opacity: 0.55;
  }

  .lb-counter {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.24em;
    color: var(--c-muted);
    opacity: 0.35;
  }

  /* ── Dot strip (thumbnail strip alternative — simple dots) ── */
  .lb-dots {
    position: absolute;
    bottom: 56px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    gap: 6px;
    align-items: center;
    pointer-events: none;
    z-index: 10;
    /* Only show when there are ≤ 20 images */
  }

  .lb-dot {
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background: var(--c-muted);
    opacity: 0.25;
    transition: opacity 0.2s ease, background 0.2s ease, transform 0.2s ease;
  }

  .lb-dot.active {
    opacity: 1;
    background: var(--c-accent);
    transform: scale(1.3);
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

export function Lightbox({ frames = [], currentIndex = null, onClose, onPrev, onNext }) {
  injectCSS('lb-css', CSS)

  const isOpen     = currentIndex !== null && frames.length > 0
  const frame      = isOpen ? frames[currentIndex] : null
  const closeRef   = useRef(null)
  const hasMany    = frames.length > 1
  const showDots   = frames.length > 1 && frames.length <= 20

  // ── Keyboard ──────────────────────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (!isOpen) return
    switch (e.key) {
      case 'Escape':     onClose(); break
      case 'ArrowLeft':  if (hasMany) onPrev(); break
      case 'ArrowRight': if (hasMany) onNext(); break
      default: break
    }
  }, [isOpen, hasMany, onClose, onPrev, onNext])

  useEffect(() => {
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [handleKey])

  // ── Body scroll lock ──────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Auto-focus close button on open ──────────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => closeRef.current?.focus(), 80)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Swipe support (touch) ─────────────────────────────────────────────────
  const touchStartX = useRef(null)

  function handleTouchStart(e) {
    touchStartX.current = e.touches[0].clientX
  }

  function handleTouchEnd(e) {
    if (touchStartX.current === null || !hasMany) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    if (Math.abs(delta) < 50) return   // too small — ignore
    delta < 0 ? onNext() : onPrev()
    touchStartX.current = null
  }

  return (
    <div
      className={`lb-backdrop${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={frame ? `Frame: ${ (currentIndex + 1)}` : 'Frame viewer'}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      

<button
  ref={closeRef}
  className="lb-close"
  onClick={(e) => {
    e.preventDefault()
    e.stopPropagation()
    onClose()
  }}
  aria-label="Close lightbox"
  type="button"
>
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path
      d="M2 2l14 14M16 2L2 16"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
    />
  </svg>
</button>


      {/* Prev */}
      {hasMany && (
        <button
          className="lb-nav lb-nav--prev"
          onClick={onPrev}
          aria-label="Previous frame"
          type="button"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M17 6l-8 8 8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Image */}
      <div className="lb-img-wrap">
        {frame && (
          <img
            key={frame.id}              /* re-triggers fade animation on change */
            className="lb-img"
            src={frame.image_url}
            alt={ `Frame ${currentIndex + 1}`}
          />
        )}
      </div>

      {/* Next */}
      {hasMany && (
        <button
          className="lb-nav lb-nav--next"
          onClick={onNext}
          aria-label="Next frame"
          type="button"
        >
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
            <path d="M11 6l8 8-8 8" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      )}

      {/* Dot strip */}
      {showDots && isOpen && (
        <div className="lb-dots" aria-hidden="true">
          {frames.map((_, i) => (
            <span
              key={i}
              className={`lb-dot${i === currentIndex ? ' active' : ''}`}
            />
          ))}
        </div>
      )}

      {/* Caption + counter */}
      {frame && (
        <div className="lb-footer" aria-live="polite">
          {frame.caption && (
            <p className="lb-caption">{frame.caption}</p>
          )}
          {hasMany && (
            <span className="lb-counter">
              {String(currentIndex + 1).padStart(2, '0')} / {String(frames.length).padStart(2, '0')}
            </span>
          )}
        </div>
      )}
    </div>
  )
}