// src/components/cinema/VideoGrid.jsx
//
// The home cinema grid. Fetches is_featured=true videos on mount,
// renders VideoCard tiles in an asymmetric masonry-style grid,
// and passes the selected video up to open TheaterModal.

import { useState, useEffect } from 'react'
import { getFeaturedVideos } from '../../hooks/useVideos'
import { VideoCard } from './VideoCard'

const CSS = `
  /* ── Section wrapper ── */
  .vgrid-section {
    padding: 48px 32px 80px;
    min-height: 100vh;
  }

  /* ── Header row ── */
  .vgrid-header {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-border);
  }

  .vgrid-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.32em;
    text-transform: uppercase;
    color: var(--c-accent);
  }

  .vgrid-title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(28px, 4vw, 44px);
    letter-spacing: 0.08em;
    color: var(--c-white);
    line-height: 1;
  }

  .vgrid-count {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    color: var(--c-muted);
    opacity: 0.6;
  }

  /* ── The Grid ──
     Columns: 2 wide + 1 tall on the right, then flips.
     grid-auto-rows keeps cards proportional without fixed heights. */
  .vgrid-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 260px;
    gap: 3px;
  }

  /* Every 7th card (1st in each visual "block") spans 2 cols × 2 rows */
  .vgrid-grid .vcard:nth-child(7n+1) {
    grid-column: span 2;
    grid-row: span 2;
  }

  /* Every 7th+3 card spans 1 col × 2 rows (the tall right column) */
  .vgrid-grid .vcard:nth-child(7n+3) {
    grid-row: span 2;
  }

  /* ── Loading skeleton ── */
  .vgrid-skeleton {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 260px;
    gap: 3px;
  }

  .vgrid-skel-item {
    background: linear-gradient(
      90deg,
      rgba(255,255,255,0.03) 0%,
      rgba(255,255,255,0.07) 50%,
      rgba(255,255,255,0.03) 100%
    );
    background-size: 200% 100%;
    animation: skelShimmer 1.6s ease infinite;
  }

  .vgrid-skel-item:nth-child(1) { grid-column: span 2; grid-row: span 2; }
  .vgrid-skel-item:nth-child(3) { grid-row: span 2; }

  @keyframes skelShimmer {
    0%   { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  /* ── Error state ── */
  .vgrid-error {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    padding: 80px 0;
    color: var(--c-muted);
  }

  .vgrid-error__code {
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.2em;
    color: var(--c-accent);
    text-transform: uppercase;
  }

  .vgrid-error__msg {
    font-family: var(--font-display);
    font-size: 18px;
    font-weight: 300;
    color: var(--c-white);
  }

  /* ── Responsive ── */
  @media (max-width: 900px) {
    .vgrid-grid,
    .vgrid-skeleton {
      grid-template-columns: repeat(2, 1fr);
      grid-auto-rows: 220px;
    }

    .vgrid-grid .vcard:nth-child(7n+1) { grid-column: span 2; grid-row: span 2; }
    .vgrid-grid .vcard:nth-child(7n+3) { grid-row: span 1; }
    .vgrid-skel-item:nth-child(3) { grid-row: span 1; }
  }

  @media (max-width: 560px) {
    .vgrid-section { padding: 32px 16px 60px; }

    .vgrid-grid,
    .vgrid-skeleton {
      grid-template-columns: 1fr;
      grid-auto-rows: 240px;
    }

    /* Reset all span overrides on mobile — single column feed */
    .vgrid-grid .vcard:nth-child(7n+1),
    .vgrid-grid .vcard:nth-child(7n+3) {
      grid-column: span 1;
      grid-row: span 1;
    }

    .vgrid-skel-item:nth-child(1),
    .vgrid-skel-item:nth-child(3) {
      grid-column: span 1;
      grid-row: span 1;
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

// ── Skeleton placeholder ─────────────────────────────────────────────────────

function GridSkeleton() {
  return (
    <div className="vgrid-skeleton" aria-busy="true" aria-label="Loading featured videos">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="vgrid-skel-item" />
      ))}
    </div>
  )
}

// ── Component ────────────────────────────────────────────────────────────────

/**
 * @param {{ onSelectVideo: (video: object) => void }} props
 */
export function VideoGrid({ onSelectVideo }) {
  injectCSS('vgrid-css', CSS)

  const [videos,  setVideos]  = useState([])
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const { data, error } = await getFeaturedVideos()
      if (cancelled) return

      if (error) {
        setError(error.message)
      } else {
        setVideos(data ?? [])
      }
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  return (
    <section className="vgrid-section" aria-labelledby="cinema-heading">

      {/* Header */}
      <div className="vgrid-header">
        <div>
          <p className="vgrid-eyebrow">Selected Works</p>
          <h1 className="vgrid-title" id="cinema-heading">Cinema</h1>
        </div>
        {!loading && !error && (
          <span className="vgrid-count">
            {videos.length.toString().padStart(2, '0')} films
          </span>
        )}
      </div>

      {/* States */}
      {loading && <GridSkeleton />}

      {error && (
        <div className="vgrid-error" role="alert">
          <span className="vgrid-error__code">Error loading reel</span>
          <p className="vgrid-error__msg">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <div className="vgrid-grid">
          {videos.map((video) => (
            <VideoCard
              key={video.id}
              video={video}
              onClick={() => onSelectVideo(video)}
            />
          ))}
        </div>
      )}

    </section>
  )
}