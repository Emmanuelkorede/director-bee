import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { VideoManager } from '../components/dashboard/VideoManager'
import { FramesUploader } from '../components/dashboard/FramesUploader'
import { Button } from '../components/ui/Button'
import { RiVideoLine, RiImageLine, RiLogoutCircleRLine, RiUserLine, RiDashboardLine } from 'react-icons/ri'

const CSS = `
  .dash-page {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: #050505; /* Deep black for maximum contrast */
    color: #FFFFFF;
  }

  /* ── High-Visibility Top Bar ── */
  .dash-topbar {
    position: sticky;
    top: 0;
    z-index: 100;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 40px;
    background: #000000;
    border-bottom: 2px solid #222; /* Thicker, visible border */
  }

  .dash-topbar__left {
    display: flex;
    align-items: center;
    gap: 24px;
  }

  .dash-wordmark {
    font-family: var(--font-display);
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.02em;
    text-transform: uppercase;
    color: #FFFFFF;
    text-decoration: none;
  }

  .dash-wordmark span {
    color: var(--c-accent); /* Your brown/accent color */
  }

  .dash-status-pill {
    display: flex;
    align-items: center;
    gap: 8px;
    background: rgba(255, 255, 255, 0.05);
    padding: 6px 12px;
    border: 1px solid #333;
    border-radius: 100px;
  }

  .dash-status-pill i {
    width: 6px;
    height: 6px;
    background: #50fa7b; /* Green for "Live" status */
    border-radius: 50%;
  }

  .dash-status-pill span {
    font-family: var(--font-mono);
    font-size: 10px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #888;
  }

  /* ── High-Contrast Navigation ── */
  .dash-nav-container {
    background: #0A0A0A;
    padding: 0 40px;
    border-bottom: 1px solid #222;
  }

  .dash-tabs {
    display: flex;
    gap: 4px;
  }

  .dash-tab {
    background: transparent;
    border: none;
    padding: 24px 30px;
    font-family: var(--font-mono);
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 0.15em;
    text-transform: uppercase;
    color: #666; /* Muted by default */
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: all 0.2s ease;
    border-bottom: 3px solid transparent;
  }

  .dash-tab:hover {
    color: #FFF;
    background: rgba(255,255,255,0.03);
  }

  .dash-tab--active {
    color: var(--c-accent) !important;
    border-bottom-color: var(--c-accent);
  }

  .dash-tab svg {
    font-size: 20px;
  }

  /* ── Main Content Area ── */
  .dash-content {
    flex: 1;
    padding: 60px 40px;
    width: 100%;
    max-width: 1600px;
    margin: 0 auto;
  }

  .dash-user-badge {
    display: flex;
    align-items: center;
    gap: 12px;
    font-family: var(--font-mono);
    font-size: 11px;
    color: #AAA;
    margin-right: 20px;
  }

  @media (max-width: 800px) {
    .dash-topbar, .dash-nav-container { padding: 0 20px; }
    .dash-tab { padding: 20px 15px; font-size: 10px; }
    .dash-user-badge { display: none; }
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
  injectCSS('dash-v2-css', CSS)

  const { user, logout } = useAuth()
  const [activeTab, setActiveTab] = useState('videos')
  const [isLoggingOut, setIsLoggingOut] = useState(false)

  async function handleLogout() {
    setIsLoggingOut(true)
    await logout()
  }

  return (
    <div className="dash-page">
      {/* ── Header ── */}
      <header className="dash-topbar">
        <div className="dash-topbar__left">
          <a href="/dashboard" className="dash-wordmark">
            Director <span>Bee</span>
          </a>
          <div className="dash-status-pill">
            <i />
            <span>System Active</span>
          </div>
        </div>

        <div className="dash-topbar__right" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="dash-user-badge">
            <RiUserLine />
            {user?.email}
          </div>
          <Button
            variant="outline"
            onClick={handleLogout}
            isLoading={isLoggingOut}
            style={{ border: '1px solid #444', color: '#FFF' }}
          >
            <RiLogoutCircleRLine style={{ marginRight: '8px' }} />
            Logout
          </Button>
        </div>
      </header>

      {/* ── Navigation ── */}
      <div className="dash-nav-container">
        <nav className="dash-tabs" role="tablist">
          <button
            className={`dash-tab ${activeTab === 'videos' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('videos')}
          >
            <RiVideoLine />
            Library
          </button>
          <button
            className={`dash-tab ${activeTab === 'frames' ? 'dash-tab--active' : ''}`}
            onClick={() => setActiveTab('frames')}
          >
            <RiImageLine />
            Frames
          </button>
        </nav>
      </div>

      {/* ── Content ── */}
      <main className="dash-content">
        {activeTab === 'videos' ? <VideoManager /> : <FramesUploader />}
      </main>
    </div>
  )
}