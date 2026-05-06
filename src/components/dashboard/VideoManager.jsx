// src/components/dashboard/VideoManager.jsx
//
// Dashboard panel — full video CRUD.
// Top: "Add Video" form. Below: sortable table of all videos via EditRow.
// Tracks featured count live to pass the cap signal down to each Toggle.

import { useState, useEffect } from 'react'
import {
  getMusicVideos,
  getRolloutVideos,
  createVideo,
} from '../../hooks/useVideos'
import { extractYoutubeId, isValidYoutubeId } from '../../lib/youtube'
import { EditRow } from './EditRow'
import { Button }  from '../ui/Button'
import { Badge }   from '../ui/Badge'
import { Spinner } from '../ui/Spinner'

const CSS = `
  /* ── Section shell ── */
  .vmgr { display: flex; flex-direction: column; gap: 0; }

  /* ── Panel header ── */
  .vmgr__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 0 24px;
    border-bottom: 1px solid var(--c-border);
    margin-bottom: 32px;
    flex-wrap: wrap;
    gap: 16px;
  }

  .vmgr__heading {
    font-family: var(--font-display);
    font-weight: 300;
    font-size: 26px;
    letter-spacing: 0.08em;
    color: var(--c-white);
  }

  .vmgr__stats {
    display: flex;
    gap: 12px;
    align-items: center;
  }

  /* ── Add Video form ── */
  .vmgr__add-form {
    background: rgba(240,236,226,0.03);
    border: 1px solid var(--c-border);
    padding: 24px;
    margin-bottom: 32px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }

  .vmgr__add-form.collapsed { display: none; }

  .vmgr__form-title {
    grid-column: 1 / -1;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-muted);
    margin-bottom: 4px;
  }

  .vmgr__field {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .vmgr__field--full { grid-column: 1 / -1; }

  .vmgr__field label {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 0.26em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0.7;
  }

  .vmgr__input,
  .vmgr__select {
    background: rgba(240,236,226,0.05);
    border: 1px solid var(--c-border);
    color: var(--c-white);
    font-family: var(--font-mono);
    font-size: 11px;
    letter-spacing: 0.08em;
    padding: 10px 12px;
    width: 100%;
    outline: none;
    transition: border-color 0.2s ease;
    appearance: none;
    -webkit-appearance: none;
  }

  .vmgr__input:focus,
  .vmgr__select:focus { border-color: var(--c-accent); }

  .vmgr__input::placeholder { color: var(--c-muted); opacity: 0.5; }

  .vmgr__select option { background: #1a1916; }

  .vmgr__form-actions {
    grid-column: 1 / -1;
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    padding-top: 4px;
  }

  .vmgr__form-error {
    grid-column: 1 / -1;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.16em;
    color: var(--c-accent);
  }

  /* ── Category tabs ── */
  .vmgr__tabs {
    display: flex;
    gap: 0;
    border-bottom: 1px solid var(--c-border);
    margin-bottom: 0;
  }

  .vmgr__tab {
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    padding: 12px 20px;
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--c-muted);
    cursor: pointer;
    transition: color 0.2s ease, border-color 0.2s ease;
    margin-bottom: -1px;
  }

  .vmgr__tab:hover { color: var(--c-white); }

  .vmgr__tab--active {
    color: var(--c-white);
    border-bottom-color: var(--c-accent);
  }

  /* ── Table header row ── */
  .vmgr__table-head {
    display: grid;
    grid-template-columns: 56px 1fr 130px 100px 120px 120px;
    border-bottom: 1px solid var(--c-border);
    padding: 10px 0;
  }

  .vmgr__th {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0.5;
    padding: 0 12px;
  }

  .vmgr__th:first-child { padding-left: 0; }

  /* ── Empty state ── */
  .vmgr__empty {
    padding: 56px 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid var(--c-border);
  }

  .vmgr__empty-text {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0.5;
  }

  /* ── Loading ── */
  .vmgr__loading {
    padding: 48px 0;
    display: flex;
    justify-content: center;
  }

  /* ── Error ── */
  .vmgr__error {
    padding: 32px 0;
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.16em;
    color: var(--c-accent);
    text-transform: uppercase;
  }

  @media (max-width: 768px) {
    .vmgr__add-form { grid-template-columns: 1fr; }
    .vmgr__table-head { display: none; }
  }
`

const EMPTY_FORM = {
  title:       '',
  artist_name: '',
  youtube_url: '',       
  category:    'music_video',
  sort_order:  0,
}

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id
  tag.textContent = css
  document.head.appendChild(tag)
}

export function VideoManager() {
  injectCSS('vmgr-css', CSS)

  const [mvVideos,    setMvVideos]    = useState([])
  const [roVideos,    setRoVideos]    = useState([])
  const [loading,     setLoading]     = useState(true)
  const [loadError,   setLoadError]   = useState(null)
  const [activeTab,   setActiveTab]   = useState('music_video')
  const [showForm,    setShowForm]    = useState(false)
  const [form,        setForm]        = useState(EMPTY_FORM)
  const [formError,   setFormError]   = useState(null)
  const [isSaving,    setIsSaving]    = useState(false)

  // Derived — count featured across both categories
  const allVideos      = [...mvVideos, ...roVideos]
  const featuredCount  = allVideos.filter((v) => v.is_featured).length
  const displayVideos  = activeTab === 'music_video' ? mvVideos : roVideos

  // ── Load ────────────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      const [mv, ro] = await Promise.all([getMusicVideos(), getRolloutVideos()])
      if (cancelled) return

      if (mv.error || ro.error) {
        setLoadError((mv.error || ro.error).message)
      } else {
        setMvVideos(mv.data ?? [])
        setRoVideos(ro.data ?? [])
      }
      setLoading(false)
    }

    load()
    return () => { cancelled = true }
  }, [])

  // ── Add video ────────────────────────────────────────────────────────────
  async function handleAdd() {
    setFormError(null)

    if (!form.title.trim()) { setFormError('Title is required.'); return }

    const youtubeId = extractYoutubeId(form.youtube_url)
    if (!youtubeId || !isValidYoutubeId(youtubeId)) {
      setFormError('Enter a valid YouTube URL or 11-character video ID.')
      return
    }

    setIsSaving(true)

    const { data, error } = await createVideo({
      title:       form.title.trim(),
      artist_name: form.artist_name.trim() || null,
      youtube_id:  youtubeId,
      category:    form.category,
      sort_order:  Number(form.sort_order),
      is_featured: false,
    })

    if (error) {
      setFormError(
        error.message.includes('unique')
          ? 'That YouTube video is already in your library.'
          : error.message
      )
      setIsSaving(false)
      return
    }

    // Prepend to the correct list
    if (data.category === 'music_video') {
      setMvVideos((prev) => [data, ...prev])
    } else {
      setRoVideos((prev) => [data, ...prev])
    }

    setForm(EMPTY_FORM)
    setShowForm(false)
    setIsSaving(false)
  }

  // ── EditRow callbacks ────────────────────────────────────────────────────
  function handleUpdated(updated) {
    const setter = updated.category === 'music_video' ? setMvVideos : setRoVideos
    setter((prev) => prev.map((v) => v.id === updated.id ? updated : v))
  }

  function handleDeleted(id) {
    setMvVideos((prev) => prev.filter((v) => v.id !== id))
    setRoVideos((prev) => prev.filter((v) => v.id !== id))
  }

  const f = (field) => (e) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  return (
    <div className="vmgr">

      {/* ── Header ── */}
      <div className="vmgr__header">
        <h2 className="vmgr__heading">Video Library</h2>
        <div className="vmgr__stats">
          <Badge variant={featuredCount >= 10 ? 'accent' : 'success'} dot>
            {featuredCount}/10 Featured
          </Badge>
          <Badge variant="ghost">{allVideos.length} Total</Badge>
          <Button
            size="sm"
            variant={showForm ? 'secondary' : 'primary'}
            onClick={() => { setShowForm((p) => !p); setFormError(null) }}
          >
            {showForm ? 'Cancel' : '+ Add Video'}
          </Button>
        </div>
      </div>

      {/* ── Add form ── */}
      <div className={`vmgr__add-form${showForm ? '' : ' collapsed'}`}>
        <p className="vmgr__form-title">Add New Video</p>

        <div className="vmgr__field">
          <label htmlFor="add-title">Title *</label>
          <input id="add-title" className="vmgr__input" value={form.title}
            onChange={f('title')} placeholder="Video title" />
        </div>

        <div className="vmgr__field">
          <label htmlFor="add-artist">Artist</label>
          <input id="add-artist" className="vmgr__input" value={form.artist_name}
            onChange={f('artist_name')} placeholder="Artist name" />
        </div>

        <div className="vmgr__field vmgr__field--full">
          <label htmlFor="add-url">YouTube URL or ID *</label>
          <input id="add-url" className="vmgr__input" value={form.youtube_url}
            onChange={f('youtube_url')}
            placeholder="https://youtube.com/watch?v=… or dQw4w9WgXcQ" />
        </div>

        <div className="vmgr__field">
          <label htmlFor="add-cat">Category</label>
          <select id="add-cat" className="vmgr__select" value={form.category}
            onChange={f('category')}>
            <option value="music_video">Music Video</option>
            <option value="rollout">Rollout</option>
          </select>
        </div>

        <div className="vmgr__field">
          <label htmlFor="add-order">Sort Order</label>
          <input id="add-order" className="vmgr__input" type="number" min="0"
            value={form.sort_order} onChange={f('sort_order')} />
        </div>

        

        {formError && <p className="vmgr__form-error">{formError}</p>}

        <div className="vmgr__form-actions">
          <Button variant="secondary" size="sm"
            onClick={() => { setShowForm(false); setFormError(null); setForm(EMPTY_FORM) }}>
            Cancel
          </Button>
          <Button size="sm" isLoading={isSaving} onClick={handleAdd}>
            Add to Library
          </Button>
        </div>
      </div>

      {/* ── Category tabs ── */}
      <div className="vmgr__tabs" role="tablist">
        {[
          { key: 'music_video', label: 'Music Videos', count: mvVideos.length },
          { key: 'rollout',     label: 'Rollout',      count: roVideos.length },
        ].map(({ key, label, count }) => (
          <button
            key={key}
            role="tab"
            aria-selected={activeTab === key}
            className={`vmgr__tab${activeTab === key ? ' vmgr__tab--active' : ''}`}
            onClick={() => setActiveTab(key)}
            type="button"
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* ── Table header ── */}
      <div className="vmgr__table-head" aria-hidden="true">
        <span className="vmgr__th" />
        <span className="vmgr__th">Title</span>
        <span className="vmgr__th">Category</span>
        <span className="vmgr__th">Featured</span>
        <span className="vmgr__th" />
      </div>

      {/* ── States ── */}
      {loading && (
        <div className="vmgr__loading">
          <Spinner label="Loading library…" />
        </div>
      )}

      {loadError && (
        <p className="vmgr__error">{loadError}</p>
      )}

      {!loading && !loadError && displayVideos.length === 0 && (
        <div className="vmgr__empty">
          <p className="vmgr__empty-text">No videos yet. Add one above.</p>
        </div>
      )}

      {!loading && !loadError && displayVideos.map((video) => (
        <EditRow
          key={video.id}
          video={video}
          featuredCount={featuredCount}
          onUpdated={handleUpdated}
          onDeleted={handleDeleted}
        />
      ))}

    </div>
  )
}