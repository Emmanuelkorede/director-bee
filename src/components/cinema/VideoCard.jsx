// src/components/cinema/VideoCard.jsx
//
// A single grid tile. Loads the YouTube maxresdefault thumbnail,
// falls back to hqdefault if the high-res image returns a 404
// (YouTube doesn't guarantee maxresdefault for every video).
// Clicking calls onCick() — the grid opens TheaterModal with this video.

import { useState } from 'react'
import { getYoutubeThumbnail } from '../../hooks/useVideos'

const CSS = `
  /* ── Card shell ── */
  .vcard {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #111;
    display: block;
    border: none;
    padding: 0;
    width: 100%;
    height: 100%;
  }

  /* ── Thumbnail image ── */
  .vcard__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94),
                filter 0.5s ease;
    filter: brightness(0.82) saturate(0.9);
    will-change: transform;
  }

  .vcard:hover .vcard__img,
  .vcard:focus-visible .vcard__img {
    transform: scale(1.06);
    filter: brightness(0.55) saturate(0.7);
  }

  /* ── Overlay: visible only on hover ── */
  .vcard__overlay {
    position: absolute;
    inset: 0;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 24px;
    background: linear-gradient(
      to top,
      rgba(9,9,9,0.95) 0%,
      rgba(9,9,9,0.4) 45%,
      transparent 100%
    );
    opacity: 0;
    transform: translateY(6px);
    transition: opacity 0.4s ease, transform 0.4s ease;
  }

  .vcard:hover .vcard__overlay,
  .vcard:focus-visible .vcard__overlay {
    opacity: 1;
    transform: translateY(0);
  }

  /* ── Play button ── */
  .vcard__play {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 56px;
    height: 56px;
    border-radius: 50%;
    border: 1.5px solid rgba(240,236,226,0.6);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.35s ease, transform 0.35s ease, border-color 0.2s ease;
    backdrop-filter: blur(4px);
    background: rgba(9,9,9,0.3);
  }

  .vcard:hover .vcard__play,
  .vcard:focus-visible .vcard__play {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    border-color: var(--c-white);
  }

  .vcard__play svg {
    margin-left: 3px; /* optical centre for triangle */
  }

  /* ── Text metadata ── */
  .vcard__meta { position: relative; z-index: 1; }

  .vcard__artist {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-accent);
    margin-bottom: 5px;
    display: block;
  }

  .vcard__title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(16px, 2.2vw, 22px);
    letter-spacing: 0.06em;
    color: var(--c-white);
    line-height: 1.1;
  }

  /* ── Category badge — top-left corner ── */
  .vcard__badge {
    position: absolute;
    top: 16px;
    left: 16px;
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--c-black);
    background: var(--c-white);
    padding: 4px 8px;
    opacity: 0;
    transition: opacity 0.35s ease;
  }

  .vcard:hover .vcard__badge,
  .vcard:focus-visible .vcard__badge {
    opacity: 1;
  }

  /* ── Focus ring (accessibility) ── */
  .vcard:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 2px;
  }

  /* ── Skeleton img placeholder ── */
  .vcard__img-placeholder {
    width: 100%;
    height: 100%;
    background: rgba(255,255,255,0.04);
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
 *   video: {
 *     id: string,
 *     youtube_id: string,
 *     title: string,
 *     artist_name?: string,
 *     category: string,
 *     custom_thumbnail_url?: string
 *   },
 *   onClick: () => void
 * }} props
 */
export function VideoCard({ video, onClick }) {
  injectCSS('vcard-css', CSS)

  const [imgSrc, setImgSrc] = useState(
    video.custom_thumbnail_url || getYoutubeThumbnail(video.youtube_id, 'maxresdefault')
  )
  const [imgLoaded, setImgLoaded] = useState(false)

  function handleImgError() {
    if (imgSrc.includes('maxresdefault')) {
      setImgSrc(getYoutubeThumbnail(video.youtube_id, 'hqdefault'))
    }
  }

  const categoryLabel = video.category === 'music_video' ? 'Music Video' : 'Rollout'

  return (
    <button
      className="vcard"
      onClick={onClick}
      aria-label={`Play ${video.title}`}
      type="button"
    >
      {/* 1. The Placeholder/Skeleton should only show if not loaded */}
      {!imgLoaded && <div className="vgrid-skel-item" style={{ height: '100%', width: '100%' }} />}

      <img
        className="vcard__img"
        src={imgSrc}
        alt=""
        loading="lazy"
        onLoad={() => setImgLoaded(true)}
        onError={handleImgError}
        style={{ 
          // 2. Change display:none to opacity for better loading reliability
          opacity: imgLoaded ? 1 : 0,
          transition: 'opacity 0.4s ease',
          position: imgLoaded ? 'relative' : 'absolute'
        }}
      />

      <span className="vcard__badge">{categoryLabel}</span>

      <div className="vcard__play" aria-hidden="true">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M6 3.5l9 5.5-9 5.5V3.5z" fill="currentColor"/>
        </svg>
      </div>

      <div className="vcard__overlay">
        <div className="vcard__meta">
          {video.artist_name && <span className="vcard__artist">{video.artist_name}</span>}
          <p className="vcard__title">{video.title}</p>
        </div>
      </div>
    </button>
  )
}