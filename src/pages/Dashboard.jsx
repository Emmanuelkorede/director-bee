import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { VideoManager } from '../components/dashboard/VideoManager'
import { FramesUploader } from '../components/dashboard/FramesUploader'
import { Button } from '../components/ui/Button'
import { RiVideoLine, RiImageLine, RiLogoutCircleRLine, RiUserLine } from 'react-icons/ri'

const CSS = `
  .dash-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #050505;
    color: #FFFFFF;
  }

  /* ── Header ── */
  .dash-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    padding: 20px 24px;
    background: #000000;
    border-bottom: 1px solid #222;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  @media (min-width: 768px) {
    .dash-topbar {
      height: 80px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
      padding: 0 40px;
    }
  }

  .dash-wordmark {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #FFFFFF;
    text-decoration: none;
    text-align: center;
  }

  .dash-wordmark span { color: var(--c-accent); }

  .dash-topbar__right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
  }

  .dash-user-badge {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--font-mono);
    font-size: 10px;
    color: #888;
    background: rgba(255,255,255,0.05);
    padding: 6px 12px;
    border-radius: 4px;
    max-width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Mobile-First Nav ── */
  .dash-nav-container {
    background: #0A0A0A;
    border-bottom: 1px solid #222;
  }

  .dash-tabs {
    display: grid;
    grid-template-columns: 1fr 1fr;
    width: 100%;
  }

  .dash-tab {
    background: transparent;
    border: none;
    padding: 16px 10px;
    font-family: var(--font-mono);
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #555;
    cursor: pointer;
    display: flex;
    flex-direction: column; /* Stack icon and text on mobile */
    align-items: center;
    gap: 6px;
    transition: all 0.2s ease;
    border-bottom: 2px solid transparent;
  }

  @media (min-width: 768px) {
    .dash-tabs { display: flex; width: auto; gap: 4px; }
    .dash-tab { 
      flex-direction: row; 
      padding: 24px 30px; 
      font-size: 12px; 
      border-bottom-width: 3px;
    }
  }

  .dash-tab--active {
    color: var(--c-accent) !important;
    border-bottom-color: var(--c-accent);
    background: rgba(var(--c-accent-rgb), 0.05);
  }

  .dash-tab svg { font-size: 18px; }

  /* ── Content ── */
  .dash-content {
    flex: 1;
    padding: 32px 20px;
    width: 100%;
    max-width: 1400px;
    margin: 0 auto;
  }

  @media (min-width: 768px) {
    .dash-content { padding: 60px 40px; }
  }
`

function injectCSS(id, css) {
  if (typeof document === 'undefined') return
  if (document.getElementById(id)) return
  const tag = document.createElement('style')
  tag.id = id; tag.textContent = css
  document.head.appendChild(tag)
}

export default function Dashboard() {
  injectCSS('dash-mobile-fixed-css', CSS)

  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('videos')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await logout()
  }

  return (
    <div className="dash-page">
      <header className="dash-topbar">
        <a href="/dashboard" className="dash-wordmark">
          Director <span>Bee</span>
        </a>

        <div className="dash-topbar__right">
          <div className="dash-user-badge">
            <RiUserLine />
            <span>{user?.email?.split('@')[0]}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            style={{ border: '1px solid #333', fontSize: '10px', height: '32px' }}
          >
            <RiLogoutCircleRLine />
            <span style={{ marginLeft: '6px' }}>Exit</span>
          </Button>
        </div>
      </header>

      <div className="dash-nav-container">
        <nav className="dash-tabs">
          <button
            className={`dash-tab ${activeTab === 'videos' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <RiVideoLine />
            <span>Library</span>
          </button>
          <button
            className={`dash-tab ${activeTab === 'frames' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('frames')}
          >
            <RiImageLine />
            <span>Frames</span>
          </button>
        </nav>
      </div>

      <main className="dash-content">
        {activeTab === 'videos' ? <VideoManager /> : <FramesUploader />}
      </main>
    </div>
  )
}