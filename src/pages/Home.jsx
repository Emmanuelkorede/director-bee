// src/pages/Home.jsx
//
// Cinema landing page.
// Owns the activeVideo state that bridges VideoGrid → TheaterModal.
// The iframe only renders when activeVideo is non-null (no background load).

import { useState } from 'react'
import { VideoGrid }    from '../components/cinema/VideoGrid'
import { TheaterModal } from '../components/cinema/TheaterModal'

export function Home() {
  const [activeVideo, setActiveVideo] = useState(null)

  return (
    <>
      <VideoGrid onSelectVideo={setActiveVideo} />
      <TheaterModal
        video={activeVideo}
        onClose={() => setActiveVideo(null)}
      />
    </>
  )
}