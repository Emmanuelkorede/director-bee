import { useState } from 'react'
import { Button } from '../components/ui/Button'
import { RiCheckLine } from 'react-icons/ri'

const CSS = `
  .contact-page {
    padding: 60px 48px;
    min-height: 100vh;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: start;
    background: #000;
  }

  .contact-info { position: sticky; top: 100px; }

  .contact-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px; 
    letter-spacing: 0.3em;
    text-transform: uppercase; 
    color: var(--c-accent);
    margin-bottom: 16px;
    display: block;
  }

  .contact-h1 {
    font-family: var(--font-display);
    font-weight: 700; 
    font-size: clamp(36px, 5vw, 64px);
    letter-spacing: -0.02em; 
    color: var(--c-white);
    line-height: 1.1; 
    margin-bottom: 24px;
    text-transform: uppercase;
  }

  .contact-h1 em { 
    display: block; 
    font-style: italic; 
    color: var(--c-accent); 
    font-weight: 300;
  }

  .contact-tagline {
    font-family: var(--font-primary);
    font-size: 15px; 
    color: var(--c-muted); 
    line-height: 1.6;
    max-width: 380px; 
    margin-bottom: 40px;
  }

  .contact-details { display: flex; flex-direction: column; gap: 24px; }

  .contact-detail {
    display: flex; 
    flex-direction: column; 
    gap: 6px;
    padding-bottom: 16px; 
    border-bottom: 1px solid var(--c-border);
  }

  .contact-detail:last-child { border-bottom: none; }

  .contact-detail__label {
    font-family: var(--font-mono);
    font-size: 9px; 
    letter-spacing: 0.2em;
    text-transform: uppercase; 
    color: var(--c-muted);
  }

  .contact-detail__value {
    font-family: var(--font-display);
    font-size: 17px; 
    letter-spacing: 0.02em;
    color: var(--c-white); 
    text-decoration: none;
    transition: color 0.3s ease;
  }

  a.contact-detail__value:hover { color: var(--c-accent); }

  .contact-form-wrap {
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 32px;
    background: #0a0a0a;
    border: 1px solid var(--c-border);
  }

  .contact-field { display: flex; flex-direction: column; gap: 8px; }

  .contact-field label {
    font-family: var(--font-mono);
    font-size: 10px; 
    letter-spacing: 0.15em;
    text-transform: uppercase; 
    color: var(--c-muted);
  }

  .contact-input,
  .contact-select,
  .contact-textarea {
    background: #000;
    border: 1px solid var(--c-border);
    color: var(--c-white);
    font-family: var(--font-primary);
    font-size: 14px;
    padding: 14px; 
    width: 100%; 
    outline: none;
    transition: all 0.3s ease;
    border-radius: 0;
    -webkit-appearance: none;
  }

  .contact-select {
    background-image: url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%3E%3Cpolyline%20points%3D%226%209%2012%2015%2018%209%22%3E%3C%2Fpolyline%3E%3C%2Fsvg%3E");
    background-repeat: no-repeat;
    background-position: right 12px center;
    background-size: 16px;
    padding-right: 40px;
  }

  .contact-select option {
    background-color: #000;
    color: #fff;
  }

  .contact-input:focus,
  .contact-select:focus,
  .contact-textarea:focus {
    border-color: var(--c-accent);
    background: #050505;
  }

  .contact-textarea { resize: vertical; min-height: 120px; }

  .contact-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
  }

  .contact-field-err {
    font-family: var(--font-mono);
    font-size: 10px; 
    color: var(--c-accent);
    margin-top: 4px;
  }

  .contact-success {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 20px;
    padding: 40px 20px;
  }

  .contact-success__icon { 
    font-size: 40px;
    color: var(--c-accent); 
  }

  .contact-success__title {
    font-family: var(--font-display);
    font-size: 24px;
    color: var(--c-white);
    text-transform: uppercase;
  }

  .contact-success__text {
    font-family: var(--font-primary);
    font-size: 14px; 
    color: var(--c-muted); 
    line-height: 1.6;
    margin-bottom: 10px;
  }

  @media (max-width: 1024px) {
    .contact-page { grid-template-columns: 1fr; gap: 48px; padding: 40px 24px; }
    .contact-info { position: static; }
    .contact-form-wrap { padding: 24px; }
  }

  @media (max-width: 600px) {
    .contact-row { grid-template-columns: 1fr; }
  }
`
function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

const DIRECTOR_EMAIL = 'officialdirectorbee@gmail.com'

const PROJECT_TYPES = [
  'Music Video',
  'Rollout Campaign',
  'Short Film',
  'Mobile Content',
  'Brand / Commercial',
  'Documentary',
  'Other',
]

const BUDGET_RANGES = [
  'Below ₦1M',
  '₦1M - ₦2M',
  '₦2M - ₦5M',
  '₦10M - ₦15M',
  '₦15M+',
]

const EMPTY = { email: '', phone: '', artist: '', type: '', timeline: '', hasConcept: '', budget: '', message: '' }

export function Contact() {
  injectCSS('contact-css', CSS)

  const [form, setForm] = useState(EMPTY)
  const [errors, setErrors] = useState({})
  const [submitted, setSubmitted] = useState(false)

  const f = (key) => (e) => setForm((p) => ({ ...p, [key]: e.target.value }))

  function validate() {
    const errs = {}
    if (!form.email.trim()) errs.email = 'Required'
    if (!/\S+@\S+\.\S+/.test(form.email)) errs.email = 'Invalid email'
    if (!form.message.trim()) errs.message = 'Message required'
    return errs
  }

  function buildMailto() {
    const subject = encodeURIComponent(
      `Project Inquiry${form.artist ? ` — ${form.artist}` : ''}`
    )
    const body = encodeURIComponent(
      `Email: ${form.email}\n` +
      `Phone/WhatsApp: ${form.phone || '—'}\n` +
      `Artist/Brand: ${form.artist || '—'}\n` +
      `Type: ${form.type || '—'}\n` +
      `Has Concept: ${form.hasConcept || '—'}\n` +
      `Budget Range: ${form.budget || '—'}\n` +
      `Timeline: ${form.timeline || '—'}\n\n` +
      `Message:\n${form.message}`
    )
    return `mailto:${DIRECTOR_EMAIL}?subject=${subject}&body=${body}`
  }

  function handleSubmit() {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    window.location.href = buildMailto()
    setTimeout(() => setSubmitted(true), 400)
  }

  return (
    <main className="contact-page">
      <div className="contact-info">
        <span className="contact-eyebrow">  Start A Project</span>
        <h1 className="contact-h1">
          Let's build
          <em>The Vision.</em>
        </h1>
        <p className="contact-tagline">
          Ready to scale your visual identity? Reach out with your project details 
          and let’s craft something cinematic.
        </p>

        <div className="contact-details">
          <div className="contact-detail">
            <span className="contact-detail__label">Direct Mail</span>
            <a href={`mailto:${DIRECTOR_EMAIL}`} className="contact-detail__value">
              {DIRECTOR_EMAIL}
            </a>
          </div>
          <div className="contact-detail">
            <span className="contact-detail__label">Location</span>
            <span className="contact-detail__value">Lagos, Nigeria</span>
          </div>
          <div className="contact-detail">
            <span className="contact-detail__label">Availability</span>
            <span className="contact-detail__value">Available Worldwide</span>
          </div>
        </div>
      </div>

      <div className="contact-form-wrap">
        {submitted ? (
          <div className="contact-success">
            <RiCheckLine className="contact-success__icon" />
            <p className="contact-success__title">Inquiry Sent</p>
            <p className="contact-success__text">
              Thank you. Your mail  has been sent.<br />
              Expect a response within 48 hours.
            </p>
            <Button onClick={() => { setSubmitted(false); setForm(EMPTY) }}>
              Send Another
            </Button>
          </div>
        ) : (
          <>
            <div className="contact-row">
              <div className="contact-field">
                <label>Email *</label>
                <input className="contact-input" type="email" value={form.email} onChange={f('email')} placeholder="yourmail@gmail.com" />
                {errors.email && <span className="contact-field-err">{errors.email}</span>}
              </div>
              <div className="contact-field">
                <label>Phone / WhatsApp</label>
                <input className="contact-input" value={form.phone} onChange={f('phone')} placeholder="+234..." />
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-field">
                <label>Artist / Brand</label>
                <input className="contact-input" value={form.artist} onChange={f('artist')} placeholder="Who are we filming?" />
              </div>
              <div className="contact-field">
                <label>Project Type</label>
                <select className="contact-select" value={form.type} onChange={f('type')}>
                  <option value="">Select Project Type</option>
                  {PROJECT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>

            <div className="contact-row">
              <div className="contact-field">
                <label>Do you have a concept?</label>
                <select className="contact-select" value={form.hasConcept} onChange={f('hasConcept')}>
                  <option value="">Select Option</option>
                  <option value="Yes">Yes</option>
                  <option value="No">No</option>
                </select>
              </div>
              <div className="contact-field">
                <label>Budget Range</label>
                <select className="contact-select" value={form.budget} onChange={f('budget')}>
                  <option value="">Select Range</option>
                  {BUDGET_RANGES.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="contact-field">
              <label> Execution Timeline</label>
              <input className="contact-input" value={form.timeline} onChange={f('timeline')} placeholder="e.g. Next Month" />
            </div>

            <div className="contact-field">
              <label>Project Details *</label>
              <textarea className="contact-textarea" value={form.message} onChange={f('message')} placeholder="Tell me about the vision..." />
              {errors.message && <span className="contact-field-err">{errors.message}</span>}
            </div>

            <Button onClick={handleSubmit}>
              Book  A Shoot
            </Button>
          </>
        )}
      </div>
    </main>
  )
}