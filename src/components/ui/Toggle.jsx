

const CSS = `
  /* ── Wrapper ── */
  .toggle-wrap {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    cursor: pointer;
    user-select: none;
    -webkit-user-select: none;
  }

  .toggle-wrap--disabled {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Hidden native checkbox (drives a11y) ── */
  .toggle-input {
    position: absolute;
    opacity: 0;
    width: 0;
    height: 0;
  }

  /* ── Track ── */
  .toggle-track {
    position: relative;
    width: 36px;
    height: 20px;
    border-radius: 20px;
    border: 1px solid var(--c-border);
    background: rgba(240,236,226,0.05);
    transition: background 0.25s ease, border-color 0.25s ease;
    flex-shrink: 0;
  }

  /* Focus ring on the hidden input transfers to the track */
  .toggle-input:focus-visible + .toggle-track {
    outline: 2px solid var(--c-accent);
    outline-offset: 3px;
  }

  /* Checked state — track fills with accent */
  .toggle-input:checked + .toggle-track {
    background: var(--c-accent);
    border-color: var(--c-accent);
  }

  /* ── Thumb ── */
  .toggle-track::after {
    content: '';
    position: absolute;
    top: 3px;
    left: 3px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: var(--c-muted);
    transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1),
                background 0.25s ease;
  }

  /* Thumb moves right and turns white when checked */
  .toggle-input:checked + .toggle-track::after {
    transform: translateX(16px);
    background: var(--c-white);
  }

  /* ── Label ── */
  .toggle-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.22em;
    text-transform: uppercase;
    color: var(--c-muted);
    transition: color 0.2s ease;
    line-height: 1;
  }

  .toggle-wrap:has(.toggle-input:checked) .toggle-label {
    color: var(--c-white);
  }

  /* ── Cap warning tooltip ── */
  .toggle-cap-hint {
    font-family: var(--font-mono);
    font-size: 8px;
    letter-spacing: 0.14em;
    text-transform: uppercase;
    color: var(--c-accent);
    opacity: 0.7;
    margin-left: 2px;
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


export function Toggle({
  checked,
  onChange,
  label,
  disabled   = false,
  atCap      = false,
  id,
  className  = '',
}) {
  injectCSS('toggle-css', CSS)

  // Show cap warning if the 10-video limit is hit and THIS toggle is off
  const showCapHint = atCap && !checked

  const inputId = id ?? `toggle-${Math.random().toString(36).slice(2, 7)}`

  return (
    <label
      className={`toggle-wrap${disabled ? ' toggle-wrap--disabled' : ''} ${className}`.trim()}
      htmlFor={inputId}
      title={showCapHint ? 'Featured limit reached (10/10). Un-feature another video first.' : undefined}
    >
      <input
        id={inputId}
        className="toggle-input"
        type="checkbox"
        role="switch"
        checked={checked}
        disabled={disabled}
        aria-checked={checked}
        aria-label={label ?? 'Toggle'}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-track" aria-hidden="true" />

      {label && (
        <span className="toggle-label">
          {label}
          {showCapHint && (
            <span className="toggle-cap-hint" aria-live="polite"> 10/10</span>
          )}
        </span>
      )}
    </label>
  )
}