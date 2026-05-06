// src/pages/Frames.jsx
//
// Behind-the-scenes gallery page.
// Thin wrapper around ShootGallery — all data-fetching and lightbox
// logic lives inside that component so this page stays clean.

import { ShootGallery } from '../components/frames/ShootGallery'

export function Frames() {
  return <ShootGallery />
}