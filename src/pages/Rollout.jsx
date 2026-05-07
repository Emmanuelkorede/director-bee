
import { useState, useEffect } from 'react'
import { getRolloutVideos } from '../hooks/useVideos'
import { VideoCard }    from '../components/cinema/VideoCard'
import { TheaterModal } from '../components/cinema/TheaterModal'
import { Spinner }      from '../components/ui/Spinner'

const CSS = `
  .rollout-page { padding: 48px 32px 80px; min-height: 100vh; }

  .rollout-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    margin-bottom: 40px;
    padding-bottom: 20px;
    border-bottom: 1px solid var(--c-border);
    gap: 16px; flex-wrap: wrap;
  }

  .rollout-eyebrow {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.32em;
    text-transform: uppercase; color: var(--c-accent);
    margin-bottom: 6px;
  }

  .rollout-h1 {
    font-family: var(--font-display);
    font-weight: 300; font-size: clamp(28px, 4vw, 44px);
    letter-spacing: 0.08em; color: var(--c-white); line-height: 1;
  }

  .rollout-count {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.2em;
    color: var(--c-muted); opacity: 0.6; flex-shrink: 0;
  }

  /* Slightly tighter grid — rollout clips tend to be shorter/vertical */
  .rollout-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    grid-auto-rows: 210px;
    gap: 3px;
  }

  .rollout-loading { display: flex; justify-content: center; padding: 80px 0; }

  .rollout-empty {
    padding: 80px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.22em; text-transform: uppercase;
    color: var(--c-muted); opacity: 0.45;
  }

  .rollout-error {
    padding: 60px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--c-accent);
  }

  /* Description strip below the header */
  .rollout-desc {
    font-family: var(--font-mono);
    font-size: 10px; letter-spacing: 0.16em;
    color: var(--c-muted); opacity: 0.6;
    line-height: 1.8;
    max-width: 500px;
    margin-bottom: 32px;
  }

  @media (max-width: 1000px) {
    .rollout-grid { grid-template-columns: repeat(3, 1fr); }
  }
  @media (max-width: 700px) {
    .rollout-grid { grid-template-columns: repeat(2, 1fr); grid-auto-rows: 180px; }
  }
  @media (max-width: 480px) {
    .rollout-page { padding: 32px 16px 60px; }
    .rollout-grid { grid-template-columns: 1fr; grid-auto-rows: 220px; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

export function Rollout() {
  injectCSS('rollout-css', CSS)

  const [videos,      setVideos]      = useState([])
  const [loading,     setLoading]     = useState(true)
  const [error,       setError]       = useState(null)
  const [activeVideo, setActiveVideo] = useState(null)

  useEffect(() => {
    let cancelled = false
    getRolloutVideos().then(({ data, error }) => {
      if (cancelled) return
      if (error) setError(error.message)
      else setVideos(data ?? [])
      setLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  return (
    <>
      <section className="rollout-page" aria-labelledby="rollout-heading">

        <div className="rollout-header">
          <div>
            <p className="rollout-eyebrow">Promotional Content</p>
            <h1 className="rollout-h1" id="rollout-heading">Rollout</h1>
          </div>
          {!loading && !error && (
            <span className="rollout-count">
              ACTIVE COLLECTION
            </span>
          )}
        </div>

        <p className="rollout-desc">
          Social teasers, visual trailers, and promotional content
          crafted to build anticipation before a release.
        </p>

        {loading  && <div className="rollout-loading"><Spinner label="Loading…" /></div>}
        {error    && <p className="rollout-error" role="alert">{error}</p>}
        {!loading && !error && videos.length === 0 && (
          <p className="rollout-empty">No rollout visuals yet.</p>
        )}
        {!loading && !error && videos.length > 0 && (
          <div className="rollout-grid">
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