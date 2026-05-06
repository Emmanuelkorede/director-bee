
const CSS = `
  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner {
    display: inline-block;
    border-radius: 50%;
    border-style: solid;
    border-color: transparent;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  /* ── Sizes ── */
  .spinner--xs { width: 12px; height: 12px; border-width: 1.5px; }
  .spinner--sm { width: 18px; height: 18px; border-width: 2px; }
  .spinner--md { width: 28px; height: 28px; border-width: 2px; }
  .spinner--lg { width: 44px; height: 44px; border-width: 2.5px; }

  /* ── Colours (top border drives the visible arc) ── */
  .spinner--white {
    border-top-color: rgba(240,236,226,0.85);
    border-right-color: rgba(240,236,226,0.15);
  }

  .spinner--accent {
    border-top-color: var(--c-accent);
    border-right-color: rgba(200,75,47,0.2);
  }

  .spinner--muted {
    border-top-color: var(--c-muted);
    border-right-color: rgba(107,102,96,0.2);
  }

  /* ── Wrapper (centres spinner + optional label) ── */
  .spinner-wrap {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 14px;
  }

  .spinner-wrap--inline {
    flex-direction: row;
    gap: 10px;
  }

  .spinner-label {
    font-family: var(--font-mono);
    font-size: 9px;
    letter-spacing: 0.28em;
    text-transform: uppercase;
    color: var(--c-muted);
    opacity: 0.6;
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


export function Spinner({
  size      = 'md',
  color     = 'white',
  label,
  inline    = false,
  className = '',
}) {
  injectCSS('spinner-css', CSS)

  const arc = (
    <span
      className={`spinner spinner--${size} spinner--${color} ${className}`.trim()}
      role="status"
      aria-label={label ?? 'Loading'}
    />
  )

  if (!label) return arc

  return (
    <div className={`spinner-wrap${inline ? ' spinner-wrap--inline' : ''}`}>
      {arc}
      <span className="spinner-label" aria-hidden="true">{label}</span>
    </div>
  )
}