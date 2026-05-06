// src/components/ui/Badge.jsx
//
// Small label pill for categories, statuses, and counts.
//
// Variants: 'default' | 'accent' | 'success' | 'warning' | 'ghost'
// Sizes:    'sm' | 'md'
//
// Usage:
//   <Badge>Music Video</Badge>
//   <Badge variant="accent">Featured</Badge>
//   <Badge variant="success" size="sm">Live</Badge>

const CSS = `
  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font-mono);
    text-transform: uppercase;
    letter-spacing: 0.22em;
    white-space: nowrap;
    border: 1px solid transparent;
    line-height: 1;
    cursor: default;
  }

  /* ── Sizes ── */
  .badge--sm {
    font-size: 8px;
    padding: 3px 7px;
  }

  .badge--md {
    font-size: 9px;
    padding: 5px 10px;
  }

  /* ── Variants ── */

  /* default — subtle outline */
  .badge--default {
    color: var(--c-muted);
    border-color: var(--c-border);
    background: transparent;
  }

  /* accent — director's red-orange signature */
  .badge--accent {
    color: var(--c-accent);
    border-color: rgba(200,75,47,0.35);
    background: rgba(200,75,47,0.08);
  }

  /* success — featured / live */
  .badge--success {
    color: #5a9e6f;
    border-color: rgba(90,158,111,0.35);
    background: rgba(90,158,111,0.08);
  }

  /* warning — unlisted / pending */
  .badge--warning {
    color: #b8933a;
    border-color: rgba(184,147,58,0.35);
    background: rgba(184,147,58,0.08);
  }

  /* ghost — white text, very faint bg */
  .badge--ghost {
    color: var(--c-white);
    border-color: var(--c-border);
    background: rgba(240,236,226,0.05);
  }

  /* ── Dot indicator (optional, prepended via prop) ── */
  .badge__dot {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    flex-shrink: 0;
    background: currentColor;
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
 *   children:  React.ReactNode,
 *   variant?:  'default' | 'accent' | 'success' | 'warning' | 'ghost',
 *   size?:     'sm' | 'md',
 *   dot?:      boolean,   — prepend a coloured dot
 *   className?: string,
 * }} props
 */
export function Badge({
  children,
  variant   = 'default',
  size      = 'md',
  dot       = false,
  className = '',
  ...rest
}) {
  injectCSS('badge-css', CSS)

  return (
    <span
      className={`badge badge--${size} badge--${variant} ${className}`.trim()}
      {...rest}
    >
      {dot && <span className="badge__dot" aria-hidden="true" />}
      {children}
    </span>
  )
}