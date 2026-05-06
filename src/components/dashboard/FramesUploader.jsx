

import { useState, useEffect, useCallback } from 'react'
import {
  getShoots,
  createShoot,
  deleteShoot,
  uploadFrames,
} from '../../hooks/useFrames'
import { Button }  from '../ui/Button'
import { Badge }   from '../ui/Badge'
import { Spinner } from '../ui/Spinner'

const CSS = `
  .fup { display: flex; flex-direction: column; gap: 0; }

  .fup__header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 0 24px; border-bottom: 1px solid var(--c-border);
    margin-bottom: 32px; flex-wrap: wrap; gap: 16px;
  }

  .fup__heading {
    font-family: var(--font-display); font-weight: 300;
    font-size: 26px; letter-spacing: 0.08em; color: var(--c-white);
  }

  .fup__columns {
    display: grid; grid-template-columns: 1fr 1.4fr;
    gap: 32px; margin-bottom: 48px;
  }

  .fup__col-label {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.28em;
    text-transform: uppercase; color: var(--c-muted); opacity: 0.6; margin-bottom: 16px;
  }

  /* ── Create form ── */
  .fup__create-form { display: flex; flex-direction: column; gap: 14px; }
  .fup__field { display: flex; flex-direction: column; gap: 6px; }

  .fup__field label {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.26em;
    text-transform: uppercase; color: var(--c-muted); opacity: 0.7;
  }

  .fup__input, .fup__textarea {
    background: rgba(240,236,226,0.05); border: 1px solid var(--c-border);
    color: var(--c-white); font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 0.07em; padding: 10px 12px;
    width: 100%; outline: none; transition: border-color 0.2s ease;
    appearance: none; -webkit-appearance: none;
  }

  .fup__input:focus, .fup__textarea:focus { border-color: var(--c-accent); }
  .fup__input::placeholder, .fup__textarea::placeholder { color: var(--c-muted); opacity: 0.4; }
  .fup__textarea { resize: vertical; min-height: 70px; }
  .fup__form-error { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em; color: var(--c-accent); }

  /* ── Upload column ── */
  .fup__upload-col { display: flex; flex-direction: column; gap: 14px; }

  /* ── Drop zone — a <label> element so clicking it always opens the file picker ── */
  .fup__dropzone {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 12px; padding: 40px 24px;
    border: 1px dashed var(--c-border); cursor: pointer; text-align: center;
    transition: border-color 0.25s ease, background 0.25s ease;
    user-select: none; -webkit-user-select: none;
  }

  .fup__dropzone:hover { border-color: rgba(240,236,226,0.25); }
  .fup__dropzone--active { border-color: var(--c-accent) !important; background: rgba(200,75,47,0.06); }
  .fup__dropzone--blocked { opacity: 0.4; cursor: not-allowed; pointer-events: none; }

  /* Real input — visually hidden but accessible, label's htmlFor connects it */
  .fup__file-input {
    position: absolute; width: 1px; height: 1px;
    margin: -1px; padding: 0; overflow: hidden;
    clip: rect(0,0,0,0); border: 0; white-space: nowrap;
  }

  .fup__drop-icon { color: var(--c-muted); opacity: 0.45; }

  .fup__drop-title {
    font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--c-white); opacity: 0.8;
  }

  .fup__drop-sub {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.18em;
    text-transform: uppercase; color: var(--c-muted); opacity: 0.5;
  }

  /* ── Inline shoot picker (inside drop zone, >1 shoot) ── */
  .fup__inline-pick {
    display: flex; flex-direction: column; align-items: center; gap: 8px;
    width: 100%; max-width: 260px;
  }

  .fup__inline-pick p {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.2em;
    text-transform: uppercase; color: var(--c-muted); opacity: 0.6;
  }

  .fup__inline-select {
    background: rgba(240,236,226,0.08); border: 1px solid rgba(240,236,226,0.2);
    color: var(--c-white); font-family: var(--font-mono);
    font-size: 11px; letter-spacing: 0.06em; padding: 9px 14px;
    width: 100%; outline: none; cursor: pointer;
    appearance: none; -webkit-appearance: none;
    transition: border-color 0.2s ease;
  }

  .fup__inline-select:focus { border-color: var(--c-accent); }
  .fup__inline-select option { background: #1a1916; }

  /* Shoot context pill shown below the zone */
  .fup__active-shoot {
    display: flex; align-items: center; justify-content: space-between; gap: 12px;
    padding: 8px 12px; border: 1px solid var(--c-border);
    background: rgba(240,236,226,0.03);
  }

  .fup__active-shoot__name {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.16em;
    text-transform: uppercase; color: var(--c-muted);
  }

  .fup__active-shoot__name span { color: var(--c-white); }

  /* ── Progress ── */
  .fup__progress-list { display: flex; flex-direction: column; gap: 8px; }

  .fup__progress-item { display: flex; align-items: center; gap: 10px; }

  .fup__progress-name {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.08em;
    color: var(--c-muted); max-width: 160px; overflow: hidden;
    text-overflow: ellipsis; white-space: nowrap; flex-shrink: 0;
  }

  .fup__progress-bar-wrap { flex: 1; height: 2px; background: rgba(255,255,255,0.07); overflow: hidden; }
  .fup__progress-bar { height: 100%; background: var(--c-accent); transition: width 0.35s ease; }
  .fup__progress-bar--error { background: #b84040; }

  .fup__progress-status {
    font-family: var(--font-mono); font-size: 8px; letter-spacing: 0.16em;
    text-transform: uppercase; width: 40px; text-align: right; flex-shrink: 0;
  }

  .fup__progress-status--done    { color: #5a9e6f; }
  .fup__progress-status--error   { color: var(--c-accent); }
  .fup__progress-status--pending { color: var(--c-muted); opacity: 0.4; }

  /* ── Shoots list ── */
  .fup__shoots-section { margin-top: 8px; }

  .fup__shoots-header {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 16px; border-bottom: 1px solid var(--c-border);
  }

  .fup__shoots-title {
    font-family: var(--font-display); font-weight: 300;
    font-size: 18px; letter-spacing: 0.08em; color: var(--c-white);
  }

  .fup__shoot-row {
    display: grid; grid-template-columns: 1fr auto auto;
    align-items: center; gap: 16px; padding: 16px 0;
    border-bottom: 1px solid var(--c-border);
  }

  .fup__shoot-name {
    font-family: var(--font-display); font-weight: 300;
    font-size: 16px; letter-spacing: 0.04em; color: var(--c-white);
  }

  .fup__shoot-desc {
    font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.12em;
    color: var(--c-muted); opacity: 0.6; margin-top: 3px;
  }

  .fup__shoot-actions { display: flex; align-items: center; gap: 8px; }
  .fup__confirm { display: flex; align-items: center; gap: 8px; }
  .fup__confirm-text { font-family: var(--font-mono); font-size: 9px; letter-spacing: 0.14em; text-transform: uppercase; color: var(--c-accent); }

  .fup__empty {
    padding: 40px 0; text-align: center;
    font-family: var(--font-mono); font-size: 10px;
    letter-spacing: 0.2em; text-transform: uppercase;
    color: var(--c-muted); opacity: 0.4;
  }

  @media (max-width: 768px) {
    .fup__columns { grid-template-columns: 1fr; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}


function ShootRow({ shoot, onDeleted }) {
  const [confirming, setConfirming] = useState(false)
  const [deleting,   setDeleting]   = useState(false)

  async function handleDelete() {
    setDeleting(true)
    const { error } = await deleteShoot(shoot.id)
    if (!error) onDeleted(shoot.id)
    else setDeleting(false)
  }

  return (
    <div className="fup__shoot-row">
      <div>
        <p className="fup__shoot-name">{shoot.title}</p>
        {shoot.description && <p className="fup__shoot-desc">{shoot.description}</p>}
      </div>

      <Badge variant="ghost" size="sm">{shoot.frame_count ?? 0} frames</Badge>

      <div className="fup__shoot-actions">
        {!confirming ? (
          <Button variant="danger" size="sm" onClick={() => setConfirming(true)}>Delete</Button>
        ) : (
          <div className="fup__confirm">
            <span className="fup__confirm-text">Sure?</span>
            <Button variant="danger" size="sm" isLoading={deleting} onClick={handleDelete}>Yes</Button>
            <Button variant="ghost"  size="sm" onClick={() => setConfirming(false)}>No</Button>
          </div>
        )}
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export function FramesUploader() {
  injectCSS('fup-css', CSS)

  const [shoots,      setShoots]      = useState([])
  const [loadingS,    setLoadingS]    = useState(true)
  const [selectedId,  setSelectedId]  = useState('')
  const [isDragging,  setIsDragging]  = useState(false)
  const [uploadItems, setUploadItems] = useState([])
  const [isUploading, setIsUploading] = useState(false)

  const [newTitle,  setNewTitle]  = useState('')
  const [creating,  setCreating]  = useState(false)
  const [createErr, setCreateErr] = useState(null)

  // ── Load shoots ──────────────────────────────────────────────────────────
  useEffect(() => {
    let cancelled = false
    getShoots().then(({ data }) => {
      if (cancelled) return
      const list = data ?? []
      setShoots(list)
      if (list.length === 1) setSelectedId(list[0].id)  // auto-select if only one
      setLoadingS(false)
    })
    return () => { cancelled = true }
  }, [])

  // ── Create shoot ─────────────────────────────────────────────────────────
  async function handleCreateShoot() {
    setCreateErr(null)
    if (!newTitle.trim()) { setCreateErr('Shoot title is required.'); return }
    setCreating(true)

    const { data, error } = await createShoot({
      title:       newTitle.trim(),
      sort_order:  shoots.length,
    })

    if (error) {
      setCreateErr(error.message.includes('unique') ? 'That title already exists.' : error.message)
    } else {
      setShoots((prev) => {
        const next = [...prev, { ...data, frame_count: 0 }]
        // Auto-select the newly created shoot
        setSelectedId(data.id)
        return next
      })
      setNewTitle('')
    }
    setCreating(false)
  }

  // ── Upload ───────────────────────────────────────────────────────────────
  const processFiles = useCallback(async (fileList) => {
    if (!selectedId || !fileList?.length) return

    const files = Array.from(fileList)
    setUploadItems(files.map((f) => ({ name: f.name, status: 'pending' })))
    setIsUploading(true)

    const { succeeded, failed } = await uploadFrames(selectedId, files, {
      onFileComplete: (doneIndex) => {
        setUploadItems((prev) =>
          prev.map((item, i) => i === doneIndex - 1 ? { ...item, status: 'done' } : item)
        )
      },
    })

    failed.forEach(({ file }) => {
      setUploadItems((prev) =>
        prev.map((item) => item.name === file.name ? { ...item, status: 'error' } : item)
      )
    })

    if (succeeded.length > 0) {
      setShoots((prev) =>
        prev.map((s) =>
          s.id === selectedId ? { ...s, frame_count: (s.frame_count ?? 0) + succeeded.length } : s
        )
      )
    }

    setIsUploading(false)
  }, [selectedId])

  function handleFileChange(e) {
    processFiles(e.target.files)
    e.target.value = ''  // reset so same files can trigger again
  }

  function handleDragOver(e)  { e.preventDefault(); e.stopPropagation(); setIsDragging(true) }
  function handleDragLeave(e) { e.preventDefault(); e.stopPropagation(); setIsDragging(false) }
  function handleDrop(e) {
    e.preventDefault(); e.stopPropagation(); setIsDragging(false)
    processFiles(e.dataTransfer.files)
  }

  function handleShootDeleted(id) {
    setShoots((prev) => {
      const next = prev.filter((s) => s.id !== id)
      if (selectedId === id) setSelectedId(next.length === 1 ? next[0].id : '')
      return next
    })
  }

  // ── Zone logic ────────────────────────────────────────────────────────────
  const noShoots  = !loadingS && shoots.length === 0
  const needsPick = shoots.length > 1 && !selectedId
  const isBlocked = noShoots || isUploading
  // Disable file input if there's no shoot selected or zone is blocked
  const inputDisabled = isBlocked || needsPick

  const activeName = shoots.find((s) => s.id === selectedId)?.title

  return (
    <div className="fup">

      {/* Header */}
      <div className="fup__header">
        <h2 className="fup__heading">Frames Manager</h2>
        <Badge variant="ghost">{shoots.length} Shoots</Badge>
      </div>

      <div className="fup__columns">

        {/* Col 1 — Create shoot */}
        <div>
          <p className="fup__col-label">Create a Shoot</p>
          <div className="fup__create-form">
            <div className="fup__field">
              <label htmlFor="shoot-title">Shoot Title *</label>
              <input id="shoot-title" className="fup__input"
                value={newTitle} onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Essence — Lagos Set"
                onKeyDown={(e) => { if (e.key === 'Enter') handleCreateShoot() }} />
            </div>

            {createErr && <p className="fup__form-error" role="alert">{createErr}</p>}
            <Button size="sm" isLoading={creating} onClick={handleCreateShoot}>
              Create Shoot
            </Button>
          </div>
        </div>

        {/* Col 2 — Upload zone */}
        <div className="fup__upload-col">
          <p className="fup__col-label">Upload Frames</p>

          {/*
            The file input is visually hidden.
            The <label htmlFor="fup-input"> IS the drop zone.
            Clicking the label = clicking the input = browser file picker opens.
            No JS .click() needed. Drag events sit on the same label.
          */}

          {/* Visually hidden real input */}
          <input
            id="fup-input"
            type="file"
            multiple
            accept="image/jpeg,image/png,image/webp,image/heic"
            disabled={inputDisabled}
            onChange={handleFileChange}
            className="fup__file-input"
            aria-label="Upload frame images"
          />

          <label
            htmlFor="fup-input"
            className={[
              'fup__dropzone',
              isDragging && selectedId ? 'fup__dropzone--active' : '',
              isBlocked               ? 'fup__dropzone--blocked' : '',
            ].filter(Boolean).join(' ')}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            // Prevent label from triggering file input when
            // director is clicking the inline select inside
            onClick={(e) => {
              if (['SELECT', 'OPTION'].includes(e.target.tagName)) {
                e.preventDefault()
              }
            }}
          >
            <div className="fup__drop-icon" aria-hidden="true">
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M16 4v16M8 12l8-8 8 8M6 24h20"
                  stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>

            {/* ── Zone states ── */}

            {/* 0 shoots */}
            {noShoots && (
              <>
                <p className="fup__drop-title">No shoots yet</p>
                <p className="fup__drop-sub">Create a shoot on the left first</p>
              </>
            )}

            {/* >1 shoots, none picked — inline selector */}
            {!noShoots && needsPick && (
              <div className="fup__inline-pick" onClick={(e) => e.preventDefault()}>
                <p className="fup__drop-title">Which shoot are these for?</p>
                <select
                  className="fup__inline-select"
                  value={selectedId}
                  onChange={(e) => { e.stopPropagation(); setSelectedId(e.target.value) }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <option value="">— Pick a shoot —</option>
                  {shoots.map((s) => (
                    <option key={s.id} value={s.id}>{s.title}</option>
                  ))}
                </select>
                <p>Then drop images or click to browse</p>
              </div>
            )}

            {/* Shoot selected, ready */}
            {!noShoots && !needsPick && !isUploading && (
              <>
                <p className="fup__drop-title">
                  {isDragging ? 'Drop to upload' : 'Drop frames here or click to browse'}
                </p>
                <p className="fup__drop-sub">JPG · PNG · WEBP · HEIC</p>
              </>
            )}

            {/* Uploading */}
            {isUploading && <Spinner size="sm" label="Uploading…" />}
          </label>

          {/* Active shoot context + change button */}
          {activeName && !isUploading && (
            <div className="fup__active-shoot">
              <p className="fup__active-shoot__name">
                Uploading to: <span>{activeName}</span>
              </p>
              {shoots.length > 1 && (
                <Button variant="ghost" size="sm" onClick={() => setSelectedId('')}>
                  Change
                </Button>
              )}
            </div>
          )}

          {/* Progress */}
          {uploadItems.length > 0 && (
            <div className="fup__progress-list" aria-live="polite">
              {uploadItems.map((item, i) => (
                <div key={i} className="fup__progress-item">
                  <span className="fup__progress-name" title={item.name}>{item.name}</span>
                  <div className="fup__progress-bar-wrap">
                    <div className={`fup__progress-bar${item.status === 'error' ? ' fup__progress-bar--error' : ''}`}
                      style={{ width: item.status === 'pending' ? '0%' : '100%' }} />
                  </div>
                  <span className={`fup__progress-status fup__progress-status--${item.status}`}>
                    {item.status === 'done' ? 'Done' : item.status === 'error' ? 'Fail' : '…'}
                  </span>
                </div>
              ))}
              {!isUploading && (
                <Button variant="ghost" size="sm" style={{ alignSelf: 'flex-end' }}
                  onClick={() => setUploadItems([])}>
                  Clear
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Shoots list */}
      <div className="fup__shoots-section">
        <div className="fup__shoots-header">
          <h3 className="fup__shoots-title">All Shoots</h3>
          {loadingS && <Spinner size="sm" />}
        </div>
        {!loadingS && shoots.length === 0 && (
          <p className="fup__empty">No shoots yet. Create one above.</p>
        )}
        {shoots.map((shoot) => (
          <ShootRow key={shoot.id} shoot={shoot} onDeleted={handleShootDeleted} />
        ))}
      </div>
    </div>
  )
}