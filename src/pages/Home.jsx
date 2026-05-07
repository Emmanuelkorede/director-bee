import { useState, useEffect } from 'react'
import { VideoGrid } from '../components/cinema/VideoGrid'
import { TheaterModal } from '../components/cinema/TheaterModal'
import { Link } from 'react-router'
import { RiArrowRightLine } from 'react-icons/ri'

const CSS = `
  .home-cta-wrap {
    padding: 100px 48px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-top: 1px solid var(--c-border);
    background: #000;
  }

  .cta-eyebrow {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.4em;
    text-transform: uppercase;
    color: var(--c-accent);
    margin-bottom: 24px;
    display: block;
  }

  .start-project-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 16px;
    text-decoration: none;
    
    font-family: var(--font-mono);
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 0.25em;
    text-transform: uppercase;
    
    background: var(--c-accent);
    color: #000;
    border: 1px solid var(--c-accent);
    
    padding: 24px 60px;
    transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
    position: relative;
    width: 100%;
    max-width: 400px;
  }

  .start-project-btn svg {
    font-size: 18px;
    transition: transform 0.4s ease;
  }

  .start-project-btn:hover {
    background: transparent;
    color: var(--c-accent);
    transform: translateY(-4px);
    box-shadow: 0 10px 30px rgba(var(--c-accent-rgb), 0.2);
  }

  .start-project-btn:hover svg {
    transform: translateX(8px);
  }

  @media (max-width: 768px) {
    .home-cta-wrap {
      padding: 80px 24px;
    }
    .start-project-btn {
      padding: 20px 32px;
      font-size: 11px;
      max-width: 100%;
    }
  }
`

function applyCSS(id, text) {
  if (typeof document === 'undefined' || document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id
  tag.textContent = text
  document.head.appendChild(tag)
}

function Contents() {
  useEffect(() => {
    applyCSS('home-styles', CSS)
  }, [])

  return (
    <section className="home-cta-wrap">
      <span className="cta-eyebrow">Ready to Vision?</span>
      <Link to="/contact" className="start-project-btn">
        Start a Project <RiArrowRightLine />
      </Link>
    </section>
  )
}

export function Home() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
      <VideoGrid onSelectVideo={setActiveVideo} />
      <TheaterModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
      <Contents />
    </>
  )
}