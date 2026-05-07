

import { Routes, Route } from 'react-router'

// Layout shell
import { Layout } from './components/layout/layouy'
import { ProtectedRoute } from './components/auth/ProtectedRoute'

// Public pages
import { Home }        from './pages/Home'
import { MusicVideos } from './pages/MusicVideos'
import { Rollout }     from './pages/Rollout'
import { Frames }      from './pages/Frames'
import { About }       from './pages/About'
import { Contact }     from './pages/Contact'
import { MobileContent } from './pages/MoileContents'

// Auth + private pages
import Login     from './pages/Login'
import Dashboard from './pages/Dashboard'

function App() {
  return (
    <Routes>

      
      <Route element={<Layout />}>
        <Route path="/"             element={<Home />}        />
        <Route path="music-videos"  element={<MusicVideos />} />
        <Route path="rollout"       element={<Rollout />}     />
        <Route path="mobile-content" element={<MobileContent />} />
        <Route path="frames"        element={<Frames />}      />
        <Route path="about"         element={<About />}       />
        <Route path="contact"       element={<Contact />}     />
      </Route>


      <Route path="login" element={<Login />} />


      <Route
        path="dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />

    </Routes>
  )
}

export default App