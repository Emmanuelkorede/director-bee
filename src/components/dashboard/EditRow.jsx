import { useState } from 'react'
import { updateVideo, deleteVideo, toggleFeatured } from '../../hooks/useVideos'
import { extractYoutubeId, getThumbnailUrl } from '../../lib/youtube'
import { Toggle } from '../ui/Toggle'
import { Badge }  from '../ui/Badge'
import { Button } from '../ui/Button'
import { RiStarFill, RiStarLine } from 'react-icons/ri'

const CSS = `
  .erow-wrap { border-bottom: 1px solid var(--c-border); }

  .erow {
    display: grid;
    grid-template-columns: 56px 1fr 130px 120px 160px;
    align-items: center;
    min-height: 72px;
    transition: background 0.15s ease;
  }

  .erow:hover        { background: rgba(240,236,226,0.02); }
  .erow--editing     { background: rgba(240,236,226,0.03); }

  .erow__thumb {
    width: 56px; height: 72px;
    object-fit: cover; display: block;
    filter: brightness(0.78); flex-shrink: 0;
  }

  .erow__info {
    padding: 12px 16px;
    display: flex; flex-direction: column; gap: 4px;
    min-width: 0;
  }

  .erow__title {
    font-family: var(--font-display);
    font-weight: 300; font-size: 15px;
    letter-spacing: 0.04em; color: var(--c-white);
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  .erow__artist {
    font-family: var(--font-mono);
    font-size: 9px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--c-muted);
  }

  .erow__category { padding: 0 12px; }
  .erow__featured  { padding: 0 12px; }

  .erow__actions {
    padding: 0 12px;
    display: flex; align-items: center; gap: 6px; flex-wrap: wrap;
  }

  /* Edit form */
  .erow__edit-form {
    padding: 20px 16px;
    display: grid; grid-template-columns: 1fr 1fr; gap: 14px;
    background: rgba(240,236,226,0.02);
    border-top: 1px solid var(--c-border);
  }

  .erow__field { display: flex; flex-direction: column; gap: 6px; }
  .erow__field--full { grid-column: 1 / -1; }

  .erow__field label {
    font-family: var(--font-mono);
    font-size: 8px; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--c-muted); opacity: 0.7;
  }

  .erow__input, .erow__select {
    background: rgba(240,236,226,0.05);
    border: 1px solid var(--c-border);
    color: var(--c-white);
    font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.08em;
    padding: 9px 12px; width: 100%; outline: none;
    transition: border-color 0.2s ease;
    appearance: none; -webkit-appearance: none;
  }

  .erow__input:focus, .erow__select:focus { border-color: var(--c-accent); }
  .erow__input::placeholder { color: var(--c-muted); opacity: 0.4; }
  .erow__select option { background: #1a1916; }

  .erow__edit-actions {
    grid-column: 1 / -1;
    display: flex; gap: 10px; justify-content: flex-end; padding-top: 4px;
    align-items: center;
  }

  .erow__error {
    grid-column: 1 / -1;
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.16em; color: var(--c-accent);
  }

  .erow__confirm { display: flex; align-items: center; gap: 8px; }

  .erow__confirm-text {
    font-family: var(--font-mono); font-size: 9px;
    letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-accent);
  }

  @media (max-width: 768px) {
    .erow { grid-template-columns: 56px 1fr 44px 110px; }
    .erow__category { display: none; }
    .erow__featured { padding: 0 4px; }
    .erow__featured span { display: none; } /* Hide text on mobile, keep icon */
    .erow__edit-form { grid-template-columns: 1fr; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

export function EditRow({ video, featuredCount, onUpdated, onDeleted }) {
  injectCSS('erow-css', CSS)

  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [isTogglingF, setIsTogglingF] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState(null)

  const [draft, setDraft] = useState({
    title: video.title ?? '',
    artist_name: video.artist_name ?? '',
    youtube_id: video.youtube_id ?? '',
    category: video.category ?? 'music_video',
    sort_order: video.sort_order ?? 0,
  })

  const atCap = featuredCount >= 10
  const f = (key) => (e) => setDraft((p) => ({ ...p, [key]: e.target.value }))

  async function handleToggleFeatured(val) {
    setIsTogglingF(true); setError(null)
    const { error } = await toggleFeatured(video.id, val)
    if (error) {
      setError(error.message.includes('Featured limit')
        ? 'Cap reached: un-feature another video first (max 10).'
        : error.message)
    } else {
      onUpdated({ ...video, is_featured: val })
    }
    setIsTogglingF(false)
  }

  async function handleSave() {
    setError(null)
    if (!draft.title.trim()) { setError('Title is required.'); return }
    const resolvedId = extractYoutubeId(draft.youtube_id)
    if (!resolvedId) { setError('Invalid YouTube URL or ID.'); return }
    setIsSaving(true)
    const { data, error } = await updateVideo(video.id, {
      ...draft,
      youtube_id: resolvedId,
      title: draft.title.trim(),
      artist_name: draft.artist_name.trim() || null,
      sort_order: Number(draft.sort_order),
    })
    if (error) { setError(error.message) }
    else { onUpdated(data); setIsEditing(false) }
    setIsSaving(false)
  }

  async function handleDelete() {
    setIsDeleting(true); setError(null)
    const { error } = await deleteVideo(video.id)
    if (error) { setError(error.message); setIsDeleting(false) }
    else { onDeleted(video.id) }
  }

  const thumbSrc = video.custom_thumbnail_url || getThumbnailUrl(video.youtube_id, 'mqdefault')

  const FeaturedBtn = ({ simplified = false }) => (
    <button
      onClick={(e) => { e.stopPropagation(); handleToggleFeatured(!video.is_featured) }}
      disabled={isTogglingF || (atCap && !video.is_featured)}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        padding: simplified ? '8px' : '8px 12px',
        fontFamily: 'var(--font-mono)',
        fontSize: '10px',
        textTransform: 'uppercase',
        letterSpacing: '0.1em',
        cursor: isTogglingF ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        background: video.is_featured ? 'var(--c-accent)' : 'transparent',
        color: video.is_featured ? '#000' : 'var(--c-accent)',
        border: `1px solid var(--c-accent)`,
        fontWeight: video.is_featured ? '700' : '400',
        opacity: isTogglingF ? 0.5 : 1,
        borderRadius: 0,
        minWidth: simplified ? '40px' : 'auto'
      }}
    >
      {video.is_featured ? <RiStarFill size={14} /> : <RiStarLine size={14} />}
      <span>{video.is_featured ? 'Featured' : 'Mark Featured'}</span>
    </button>
  )

  return (
    <div className="erow-wrap">
      <div className={`erow${isEditing ? ' erow--editing' : ''}`}>
        <img className="erow__thumb" src={thumbSrc} alt="" aria-hidden="true"
          loading="lazy" onError={(e) => { e.currentTarget.style.display = 'none' }} />

        <div className="erow__info">
          <p className="erow__title" title={video.title}>{video.title}</p>
          {video.artist_name && <span className="erow__artist">{video.artist_name}</span>}
        </div>

        <div className="erow__category">
          <Badge 
            variant={
              video.category === 'music_video' ? 'ghost' : 
              video.category === 'mobile_content' ? 'success' : 'accent'
            } 
            size="sm"
          >
            {video.category === 'music_video' && 'Music Video'}
            {video.category === 'rollout' && 'Rollout'}
            {video.category === 'mobile_content' && 'Mobile'}
          </Badge>
        </div>

        <div className="erow__featured">
          <FeaturedBtn simplified />
        </div>

        <div className="erow__actions">
          {!confirmDelete ? (
            <>
              <Button variant="ghost" size="sm" onClick={() => { setIsEditing((p) => !p); setError(null) }}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Button>
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            </>
          ) : (
            <div className="erow__confirm">
              <span className="erow__confirm-text">Sure?</span>
              <Button variant="danger" size="sm" isLoading={isDeleting} onClick={handleDelete}>
                Yes
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setConfirmDelete(false)}>
                No
              </Button>
            </div>
          )}
        </div>
      </div>

      {isEditing && (
        <div className="erow__edit-form">
          <div className="erow__field">
            <label htmlFor={`et-${video.id}`}>Title *</label>
            <input id={`et-${video.id}`} className="erow__input"
              value={draft.title} onChange={f('title')} placeholder="Video title" />
          </div>

          <div className="erow__field">
            <label htmlFor={`ea-${video.id}`}>Artist</label>
            <input id={`ea-${video.id}`} className="erow__input"
              value={draft.artist_name} onChange={f('artist_name')} placeholder="Artist name" />
          </div>

          <div className="erow__field erow__field--full">
            <label htmlFor={`ey-${video.id}`}>YouTube URL or ID</label>
            <input id={`ey-${video.id}`} className="erow__input"
              value={draft.youtube_id} onChange={f('youtube_id')}
              placeholder="https://youtube.com/watch?v=… or bare ID" />
          </div>

          <div className="erow__field">
            <label htmlFor={`ec-${video.id}`}>Category</label>
            <select id={`ec-${video.id}`} className="erow__select"
              value={draft.category} onChange={f('category')}>
              <option value="music_video">Music Video</option>
              <option value="rollout">Rollout</option>
              <option value="mobile_content">Mobile Content</option>
            </select>
          </div>

          <div className="erow__field">
            <label htmlFor={`eo-${video.id}`}>Sort Order</label>
            <input id={`eo-${video.id}`} className="erow__input" type="number"
              min="0" value={draft.sort_order} onChange={f('sort_order')} />
          </div>

          {error && <p className="erow__error" role="alert">{error}</p>}

          <div className="erow__edit-actions">
            <div style={{ marginRight: 'auto' }}>
               <FeaturedBtn />
            </div>
            <Button variant="secondary" size="sm" onClick={() => { setIsEditing(false); setError(null) }}>
              Cancel
            </Button>
            <Button variant="primary" size="sm" isLoading={isSaving} onClick={handleSave}>
              Save Changes
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}