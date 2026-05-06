

import { useState } from 'react'

const CSS = `
  /* ── Card shell ── */
  .fcard {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #111;
    border: none;
    padding: 0;
    width: 100%;
    display: block;
    /* Height driven by the gallery grid's row sizing */
  }

  /* ── Image ── */
  .fcard__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.65s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                filter 0.45s ease;
    filter: brightness(0.88) saturate(0.85);
    will-change: transform;
  }

  .fcard:hover .fcard__img,
  .fcard:focus-visible .fcard__img {
    transform: scale(1.05);
    filter: brightness(0.55) saturate(0.6);
  }

  /* ── Expand icon — top right ── */
  .fcard__expand {
    position: absolute;
    top: 14px;
    right: 14px;
    width: 34px;
    height: 34px;
    border: 1px solid rgba(240,236,226,0.5);
    background: rgba(9,9,9,0.3);
    backdrop-filter: blur(4px);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transform: scale(0.85);
    transition: opacity 0.3s ease, transform 0.3s ease;
    pointer-events: none;
  }

  .fcard:hover .fcard__expand,
  .fcard:focus-visible .fcard__expand {
    opacity: 1;
    transform: scale(1);
  }

  /* ── Caption overlay ── */
  .fcard__caption-wrap {
    position: absolute;
    bottom: 0; left: 0; right: 0;
    padding: 20px 16px 14px;
    background: linear-gradient(to top, rgba(9,9,9,0.9) 0%, transparent 100%);
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.35s ease, transform 0.35s ease;
  }

  .fcard:hover .fcard__caption-wrap,
  .fcard:focus-visible .fcard__caption-wrap {
    opacity: 1;
    transform: translateY(0);
  }

  .fcard__caption {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    text-transform: uppercase;
    color: var(--c-white);
    opacity: 0.75;
    line-height: 1.5;
  }

  /* ── Loading shimmer ── */
  .fcard__placeholder {
    width: 100%;
    height: 100%;
    min-height: 200px;
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: fSkelShimmer 1.6s ease infinite;
  }

  @keyframes fSkelShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Focus ring ── */
  .fcard:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 2px;
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

/**
 * @param {{
 *   frame: {
 *     id: string,
 *     image_url: string,
 *     image_path: string,
 *     caption?: string,
 *     sort_order: number
 *   },
 *   onClick: () => void
 * }} props
 */
export function FrameCard({ frame, onClick }) {
  injectCSS('fcard-css', CSS)

  const [loaded, setLoaded] = useState(false)

  return (
    <button
      className="fcard"
      onClick={onClick}
      type="button"
      aria-label={frame.caption ? `View frame: ${frame.caption}` : 'View frame'}
    >
      {/* Shimmer while loading */}
      {!loaded && <div className="fcard__placeholder" aria-hidden="true" />}

      {/* Image */}
      <img
  className="fcard__img"
  src={frame.image_url}
  alt="" 
  loading="eager" // Change to eager so they pop in faster
  decoding="async"
  onLoad={() => setLoaded(true)}
  // Add an onError to stop the shimmer if the image fails
  onError={() => setLoaded(true)} 
  style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.3s ease' }}
/>

      {/* Expand icon */}
      <div className="fcard__expand" aria-hidden="true">
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

    
    </button>
  )
}