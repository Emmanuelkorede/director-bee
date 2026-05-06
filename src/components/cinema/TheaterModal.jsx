// src/components/cinema/TheaterModal.jsx
//
// Full-screen cinema overlay. Opens when a VideoCard is clicked.
// Traps focus, locks body scroll, closes on: Escape, backdrop click, close btn.
// The YouTube iframe only loads (and autoplays) AFTER the modal is open
// to prevent background audio playing while the overlay animates in.

import { useEffect, useRef, useCallback } from 'react'
import { getYoutubeEmbedUrl } from '../../hooks/useVideos'

const CSS = `
  /* ── Backdrop ── */
  .theater-backdrop {
    position: fixed;
    inset: 0;
    z-index: 200;
    background: rgba(4,4,4,0.97);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;

    opacity: 0;
    visibility: hidden;
    transition: opacity 0.4s ease, visibility 0.4s ease;
  }

  .theater-backdrop.open {
    opacity: 1;
    visibility: visible;
  }

  /* ── Grain texture overlay (atmosphere) ── */
  .theater-backdrop::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    opacity: 0.6;
  }

  /* ── Close button ── */
  .theater-close {
    position: absolute;
    top: 24px;
    right: 28px;
    background: none;
    border: 1px solid var(--c-border);
    color: var(--c-white);
    cursor: pointer;
    width: 44px;
    height: 44px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: border-color 0.2s ease, background 0.2s ease;
    z-index: 10;
  }

  .theater-close:hover {
    border-color: var(--c-accent);
    background: rgba(200,75,47,0.1);
  }

  .theater-close:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 2px;
  }

  /* ── Video metadata strip ── */
  .theater-meta {
    width: 100%;
    max-width: 1100px;
    display: flex;
    align-items: baseline;
    gap: 20px;
    margin-bottom: 16px;
    opacity: 0;
    transform: translateY(-8px);
    transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s;
  }

  .theater-backdrop.open .theater-meta {
    opacity: 1;
    transform: translateY(0);
  }

  .theater-meta__artist {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.3em;
    text-transform: uppercase;
    color: var(--c-accent);
  }

  .theater-meta__sep {
    font-family: var(--font-mono);
    font-size: 9px;
    color: var(--c-muted);
    opacity: 0.4;
  }

  .theater-meta__title {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: clamp(16px, 2vw, 22px);
    letter-spacing: 0.08em;
    color: var(--c-white);
  }

  /* ── iframe wrapper — 16:9 aspect ratio ── */
  .theater-frame-wrap {
    position: relative;
    width: 100%;
    max-width: 1100px;
    aspect-ratio: 16 / 9;
    background: #000;
    box-shadow: 0 40px 120px rgba(0,0,0,0.9);

    opacity: 0;
    transform: scale(0.96);
    transition: opacity 0.5s ease 0.1s, transform 0.5s ease 0.1s;
  }

  .theater-backdrop.open .theater-frame-wrap {
    opacity: 1;
    transform: scale(1);
  }

  .theater-frame-wrap iframe {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    border: none;
  }

  /* ── Bottom hint ── */
  .theater-hint {
    margin-top: 14px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0;
    transition: opacity 0.5s ease 0.4s;
  }

  .theater-backdrop.open .theater-hint {
    opacity: 0.35;
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
 *   video: object | null,  — the selected video, or null when closed
 *   onClose: () => void
 * }} props
 */
export function TheaterModal({ video, onClose }) {
  injectCSS('theater-css', CSS)

  const closeRef   = useRef(null)
  const isOpen     = !!video

  // ── Keyboard: close on Escape ──────────────────────────────────────────────
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, handleKey])

  // ── Body scroll lock ───────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  // ── Focus the close button when modal opens ────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      // Small delay lets the CSS transition start first
      const t = setTimeout(() => closeRef.current?.focus(), 100)
      return () => clearTimeout(t)
    }
  }, [isOpen])

  // ── Backdrop click — close if clicking the outer backdrop, not the video ───
  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose()
  }

  return (
    <div
      className={`theater-backdrop${isOpen ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label={video ? `Now playing: ${video.title}` : 'Video player'}
      onClick={handleBackdropClick}
    >
      {/* Close button */}
      <button
        className="theater-close"
        ref={closeRef}
        onClick={onClose}
        aria-label="Close video"
        type="button"
      >
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
          <path d="M2 2l14 14M16 2L2 16" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>
        </svg>
      </button>

      {/* Metadata */}
      <div className="theater-meta" aria-hidden="true">
        {video?.artist_name && (
          <>
            <span className="theater-meta__artist">{video.artist_name}</span>
            <span className="theater-meta__sep">—</span>
          </>
        )}
        {video?.title && (
          <span className="theater-meta__title">{video.title}</span>
        )}
      </div>

      {/* 16:9 iframe — only render src when open to prevent background load */}
      <div className="theater-frame-wrap">
        {isOpen && video?.youtube_id && (
          <iframe
            src={getYoutubeEmbedUrl(video.youtube_id, true)}
            title={video.title}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
          />
        )}
      </div>

      {/* Keyboard hint */}
      <p className="theater-hint" aria-hidden="true">
        Press Esc to close
      </p>
    </div>
  )
}