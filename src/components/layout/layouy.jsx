

import { Outlet } from 'react-router'
import { Navbar } from './Navbar'
import { Footer } from './Footer'

const CSS = `
  .layout-root {
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background: var(--c-black);
  }

  .layout-main {
    flex: 1;
    padding-top: var(--nav-h);   /* clears the fixed navbar */
  }
`

function injectLayoutCSS() {
  if (typeof document === 'undefined') return
  if (document.getElementById('layout-css')) return
  const tag = document.createElement('style')
  tag.id = 'layout-css'
  tag.textContent = CSS
  document.head.appendChild(tag)
}

export function Layout() {
  injectLayoutCSS()

  return (
    <div className="layout-root">
      <Navbar />
      <main className="layout-main" id="main-content">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}