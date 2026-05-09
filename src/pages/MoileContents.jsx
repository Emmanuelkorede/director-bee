import { useState, useEffect } from 'react'
import { getMobileVideos } from '../hooks/useVideos' 
import { VideoCard } from '../components/cinema/VideoCard'
import { TheaterModal } from '../components/cinema/TheaterModal'
import { Spinner } from '../components/ui/Spinner'

const CSS = `
  .mobile-archive-page { padding: 48px 32px 80px; min-height: 100vh; }

  .mobile-archive-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-border);
    gap: 16px; flex-wrap: wrap;
  }

  .mobile-archive-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--c-accent);
    margin-bottom: 6px;
  }

  .mobile-archive-h1 {
    font-family: var(--font-display);
    font-weight: 300; font-size: clamp(28px, 4vw, 44px);
    letter-spacing: 0.08em; color: var(--c-white); line-height: 1;
  }

  .mobile-archive-count {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.2em;
    color: var(--c-muted); opacity: 0.6; flex-shrink: 0;
  }

  /* ── 9:16 Vertical Optimized Grid ── */
  .mobile-archive-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 400px; /* Taller rows for vertical content */
    gap: 4px;
  }

  .mobile-archive-loading { display: flex; justify-content: center; padding: 80px 0; }

  .mobile-archive-empty {
    padding: 80px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--c-muted); opacity: 0.45;
  }

  .mobile-archive-error {
    padding: 60px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--c-accent);
  }

  .mobile-archive-desc {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.16em;
    color: var(--c-muted); opacity: 0.7;
    line-height: 1.8;
    max-width: 550px;
    margin-bottom: 40px;
  }

  /* ── Responsive Adjustments ── */
  @media (max-width: 1100px) {
    .mobile-archive-grid { 
      grid-template-columns: repeat(3, 1fr); 
      grid-auto-rows: 350px;
    }
  }

  @media (max-width: 768px) {
    .mobile-archive-grid { 
      grid-template-columns: repeat(2, 1fr); 
      grid-auto-rows: 300px;
    }
    .mobile-archive-page { padding: 32px 20px 60px; }
  }

  @media (max-width: 480px) {
    /* On tiny screens, keep 2 columns to show the vertical scale */
    .mobile-archive-grid { 
      grid-template-columns: repeat(2, 1fr); 
      grid-auto-rows: 260px; 
    }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

export function MobileContent() {
  injectCSS('mobile-content-css', CSS)

  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    let cancelled = false
    // Using the specific mobile content hook
    getMobileVideos().then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error.message)
      else setVideos(data ?? [])
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <section className="mobile-archive-page" aria-labelledby="mobile-heading">
        
        <div className="mobile-archive-header">
          <div>
            <p className="mobile-archive-eyebrow">Social & Vertical</p>
            <h1 className="mobile-archive-h1" id="mobile-heading">Mobile Content</h1>
          </div>
          {!loading && !error && (
            <span className="mobile-archive-count">
              PHONE CINEMATIC CONTENT
            </span>
          )}
        </div>

        <p className="mobile-archive-desc">
          Short-form narratives and organic mobile experiences 
          designed for vertical, social, and high-impact engagement.
        </p>

        {loading && (
          <div className="mobile-archive-loading">
            <Spinner label="Loading Archive…" />
          </div>
        )}

        {error && (
          <p className="mobile-archive-error" role="alert">{error}</p>
        )}

        {!loading && !error && videos.length === 0 && (
          <p className="mobile-archive-empty">No mobile content available.</p>
        )}

        {!loading && !error && videos.length > 0 && (
          <div className="mobile-archive-grid">
            {videos.map((v) => (
              <VideoCard 
                key={v.id} 
                video={v} 
                onClick={() => setActiveVideo(v)} 
              />
            ))}
          </div>
        )}
      </section>

      <TheaterModal 
        video={activeVideo} 
        onClose={() => setActiveVideo(null)} 
      />
    </>
  )
}