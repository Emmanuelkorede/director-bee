
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