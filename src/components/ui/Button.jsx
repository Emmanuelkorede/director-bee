// src/components/ui/Button.jsx
//
// Core button primitive used across the dashboard and public site.
//
// Variants: 'primary' | 'secondary' | 'ghost' | 'danger'
// Sizes:    'sm' | 'md' | 'lg'
//
// Usage:
//   <Button onClick={save}>Save Changes</Button>
//   <Button variant="danger" size="sm" onClick={del}>Delete</Button>
//   <Button variant="ghost" isLoading>Uploading…</Button>
//   <Button as="a" href="/contact" variant="primary">Book a Project</Button>

import { Spinner } from './Spinner'

const CSS = `
  .btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    font-family: var(--font-mono);
    letter-spacing: 0.2em;
    text-transform: uppercase;
    text-decoration: none;
    border: 1px solid transparent;
    cursor: pointer;
    white-space: nowrap;
    transition:
      background   0.22s ease,
      color        0.22s ease,
      border-color 0.22s ease,
      opacity      0.22s ease,
      transform    0.15s ease;
    position: relative;
    flex-shrink: 0;
    user-select: none;
    -webkit-user-select: none;
  }

  .btn:active:not(:disabled) { transform: scale(0.97); }

  .btn:focus-visible {
    outline: 2px solid var(--c-accent);
    outline-offset: 3px;
  }

  .btn:disabled,
  .btn[aria-disabled='true'] {
    opacity: 0.38;
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Sizes ── */
  .btn--sm  { font-size: 9px;  padding: 8px 14px;  }
  .btn--md  { font-size: 10px; padding: 11px 20px; }
  .btn--lg  { font-size: 11px; padding: 14px 28px; }

  /* ── Icon-only (square) ── */
  .btn--icon-sm { padding: 8px;  width: 34px; height: 34px; }
  .btn--icon-md { padding: 10px; width: 42px; height: 42px; }

  /* ── primary: white fill, black text ── */
  .btn--primary {
    background: var(--c-white);
    color: var(--c-black);
    border-color: var(--c-white);
  }

  .btn--primary:hover:not(:disabled) {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-white);
  }

  /* ── secondary: accent outline ── */
  .btn--secondary {
    background: transparent;
    color: var(--c-white);
    border-color: var(--c-border);
  }

  .btn--secondary:hover:not(:disabled) {
    border-color: var(--c-white);
    background: rgba(240,236,226,0.05);
  }

  /* ── ghost: no border, text only ── */
  .btn--ghost {
    background: transparent;
    color: var(--c-muted);
    border-color: transparent;
  }

  .btn--ghost:hover:not(:disabled) {
    color: var(--c-white);
    background: rgba(240,236,226,0.04);
  }

  /* ── danger: red-orange destructive action ── */
  .btn--danger {
    background: transparent;
    color: var(--c-accent);
    border-color: rgba(200,75,47,0.35);
  }

  .btn--danger:hover:not(:disabled) {
    background: var(--c-accent);
    border-color: var(--c-accent);
    color: var(--c-white);
  }

  /* ── Full width modifier ── */
  .btn--full { width: 100%; }

  /* ── Loading state — hide content, show spinner ── */
  .btn--loading { pointer-events: none; }

  .btn__content {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    transition: opacity 0.15s ease;
  }

  .btn--loading .btn__content { opacity: 0; }

  .btn__spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    opacity: 0;
    transition: opacity 0.15s ease;
  }

  .btn--loading .btn__spinner { opacity: 1; }
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
 *   children:    React.ReactNode,
 *   variant?:   'primary' | 'secondary' | 'ghost' | 'danger',
 *   size?:      'sm' | 'md' | 'lg',
 *   isLoading?: boolean,
 *   isFullWidth?: boolean,
 *   iconOnly?:  boolean,
 *   as?:        string,  — render as a different element, e.g. 'a'
 *   disabled?:  boolean,
 *   className?: string,
 *   [key: string]: any,  — any other valid HTML button / anchor props
 * }} props
 */
export function Button({
  children,
  variant     = 'primary',
  size        = 'md',
  isLoading   = false,
  isFullWidth = false,
  iconOnly    = false,
  as: Tag     = 'button',
  disabled    = false,
  className   = '',
  ...rest
}) {
  injectCSS('btn-css', CSS)

  const iconClass = iconOnly ? ` btn--icon-${size}` : ''
  const classes   = [
    'btn',
    `btn--${size}`,
    `btn--${variant}`,
    isLoading   ? 'btn--loading'  : '',
    isFullWidth ? 'btn--full'     : '',
    iconClass,
    className,
  ].filter(Boolean).join(' ')

  return (
    <Tag
      className={classes}
      disabled={Tag === 'button' ? (disabled || isLoading) : undefined}
      aria-disabled={disabled || isLoading || undefined}
      aria-busy={isLoading || undefined}
      type={Tag === 'button' ? (rest.type ?? 'button') : undefined}
      {...rest}
    >
      {/* Visible content — hidden during loading */}
      <span className="btn__content">
        {children}
      </span>

      {/* Spinner — visible only during loading */}
      {isLoading && (
        <span className="btn__spinner" aria-hidden="true">
          <Spinner size={size === 'sm' ? 'xs' : 'sm'} />
        </span>
      )}
    </Tag>
  )
}