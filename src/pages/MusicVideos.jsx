

import { useState, useEffect } from 'react'
import { getMusicVideos }  from '../hooks/useVideos'
import { VideoCard }    from '../components/cinema/VideoCard'
import { TheaterModal } from '../components/cinema/TheaterModal'
import { Spinner }      from '../components/ui/Spinner'

const CSS = `
  .archive-page { padding: 48px 32px 80px; min-height: 100vh; }

  .archive-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-border);
    gap: 16px;
    flex-wrap: wrap;
  }

  .archive-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--c-accent);
    margin-bottom: 6px;
  }

  .archive-h1 {
    font-family: var(--font-display);
    font-weight: 300; font-size: clamp(28px, 4vw, 44px);
    letter-spacing: 0.08em; color: var(--c-white); line-height: 1;
  }

  .archive-count {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.2em;
    color: var(--c-muted); opacity: 0.6; flex-shrink: 0;
  }

  .archive-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 240px;
    gap: 3px;
  }

  .archive-loading {
    display: flex; justify-content: center; padding: 80px 0;
  }

  .archive-empty {
    padding: 80px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--c-muted); opacity: 0.45;
  }

  .archive-error {
    padding: 60px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--c-accent);
  }

  @media (max-width: 900px) {
    .archive-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 210px; }
  }
  @media (max-width: 560px) {
    .archive-page { padding: 32px 16px 60px; }
    .archive-grid { grid-template-columns: 1fr; grid-auto-rows: 240px; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

export function MusicVideos() {
  injectCSS('archive-css', CSS)

  const [videos,      setVideos]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    let cancelled = false
    getMusicVideos().then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error.message)
      else setVideos(data ?? [])
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <section className="archive-page" aria-labelledby="mv-heading">

        <div className="archive-header">
          <div>
            <p className="archive-eyebrow">Complete Archive</p>
            <h1 className="archive-h1" id="mv-heading">Music Videos</h1>
          </div>
          {!loading && !error && (
            <span className="archive-count">
              ACTIVE COLLECTION
            </span>
          )}
        </div>

        {loading  && <div className="archive-loading"><Spinner label="Loading…" /></div>}
        {error    && <p className="archive-error" role="alert">{error}</p>}
        {!loading && !error && videos.length === 0 && (
          <p className="archive-empty">No music videos yet.</p>
        )}
        {!loading && !error && videos.length > 0 && (
          <div className="archive-grid">
            {videos.map((v) => (
              <VideoCard key={v.id} video={v} onClick={() => setActiveVideo(v)} />
            ))}
          </div>
        )}

      </section>

      <TheaterModal video={activeVideo} onClose={() => setActiveVideo(null)} />
    </>
  )
}