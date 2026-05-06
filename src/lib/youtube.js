// src/lib/youtube.js
//
// All YouTube URL construction utilities.
// Single source of truth — import from here, never hardcode YouTube URLs elsewhere.

// ── Thumbnail ──────────────────────────────────────────────────────────────

/**
 * YouTube thumbnail quality levels, highest to lowest.
 * maxresdefault (1280×720) is not guaranteed for every video —
 * use tryBestThumbnail() for automatic fallback logic.
 */
export const THUMB_QUALITY = {
  MAX:  'maxresdefault',  // 1280×720 — not always available
  HIGH: 'hqdefault',      // 480×360  — always available
  MED:  'mqdefault',      // 320×180
  SD:   'sddefault',      // 640×480 (letterboxed)
  DEFAULT: 'default',     // 120×90
}

/**
 * Returns a YouTube thumbnail URL for the given video ID and quality.
 *
 * @param {string} youtubeId
 * @param {string} quality — one of THUMB_QUALITY values
 * @returns {string}
 */
export function getThumbnailUrl(youtubeId, quality = THUMB_QUALITY.MAX) {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`
}

/**
 * Returns an array of thumbnail URLs in descending quality order.
 * Pass to an <img> onError handler to waterfall through qualities.
 *
 * Usage:
 *   const [src, setSrc] = useState(getThumbnailFallbacks(id)[0])
 *   <img src={src} onError={() => setSrc(getThumbnailFallbacks(id)[1])} />
 *
 * @param {string} youtubeId
 * @returns {string[]}
 */
export function getThumbnailFallbacks(youtubeId) {
  return [
    getThumbnailUrl(youtubeId, THUMB_QUALITY.MAX),
    getThumbnailUrl(youtubeId, THUMB_QUALITY.HIGH),
    getThumbnailUrl(youtubeId, THUMB_QUALITY.MED),
  ]
}

// ── Embed URL ──────────────────────────────────────────────────────────────

/**
 * Returns a YouTube embed URL.
 *
 * @param {string} youtubeId
 * @param {{
 *   autoplay?:       boolean,  default false
 *   rel?:            boolean,  default false  — show related videos at end
 *   modestbranding?: boolean,  default true   — reduce YouTube logo prominence
 *   start?:          number,   default 0      — start time in seconds
 *   mute?:           boolean,  default false
 * }} options
 * @returns {string}
 */
export function getEmbedUrl(youtubeId, options = {}) {
  const {
    autoplay       = false,
    rel            = false,
    modestbranding = true,
    start          = 0,
    mute           = false,
  } = options

  const params = new URLSearchParams({
    autoplay:       autoplay       ? '1' : '0',
    rel:            rel            ? '1' : '0',
    modestbranding: modestbranding ? '1' : '0',
    mute:           mute           ? '1' : '0',
    color:          'white',
  })

  if (start > 0) params.set('start', String(start))

  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`
}

// ── Watch URL ──────────────────────────────────────────────────────────────

/**
 * Returns the standard youtube.com/watch URL.
 * Useful for "open on YouTube" links.
 *
 * @param {string} youtubeId
 * @returns {string}
 */
export function getWatchUrl(youtubeId) {
  return `https://www.youtube.com/watch?v=${youtubeId}`
}

// ── ID extraction ──────────────────────────────────────────────────────────

/**
 * Extracts a YouTube video ID from any common YouTube URL format, or returns
 * the input unchanged if it's already an 11-character ID.
 *
 * Handles:
 *   https://www.youtube.com/watch?v=dQw4w9WgXcQ
 *   https://youtu.be/dQw4w9WgXcQ
 *   https://www.youtube.com/embed/dQw4w9WgXcQ
 *   https://youtube.com/shorts/dQw4w9WgXcQ
 *   dQw4w9WgXcQ  (bare ID — returned as-is)
 *
 * @param {string} input
 * @returns {string | null}  — null if no valid ID found
 */
export function extractYoutubeId(input) {
  if (!input) return null

  const trimmed = input.trim()

  // Already a bare 11-char ID
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) return trimmed

  const patterns = [
    /[?&]v=([a-zA-Z0-9_-]{11})/,          // watch?v=
    /youtu\.be\/([a-zA-Z0-9_-]{11})/,      // youtu.be/
    /\/embed\/([a-zA-Z0-9_-]{11})/,        // /embed/
    /\/shorts\/([a-zA-Z0-9_-]{11})/,       // /shorts/
    /\/v\/([a-zA-Z0-9_-]{11})/,            // /v/
  ]

  for (const pattern of patterns) {
    const match = trimmed.match(pattern)
    if (match) return match[1]
  }

  return null
}

/**
 * Returns true if the string is a valid 11-character YouTube video ID.
 *
 * @param {string} id
 * @returns {boolean}
 */
export function isValidYoutubeId(id) {
  return /^[a-zA-Z0-9_-]{11}$/.test(id)
}