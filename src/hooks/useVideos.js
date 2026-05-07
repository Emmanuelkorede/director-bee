
import { supabase } from '../lib/supabase'

export function getYoutubeThumbnail(youtubeId, quality = 'maxresdefault') {
  return `https://img.youtube.com/vi/${youtubeId}/${quality}.jpg`
}

export function getYoutubeEmbedUrl(youtubeId, autoplay = false) {
  const params = new URLSearchParams({
    autoplay:       autoplay ? '1' : '0',
    rel:            '0',   
    modestbranding: '1',   // hide YouTube logo in controls
    color:          'white',
  })
  return `https://www.youtube.com/embed/${youtubeId}?${params.toString()}`
}


export async function getFeaturedVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('is_featured', true)
    .order('sort_order', { ascending: true })

  return { data, error }
}


export async function getMusicVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', 'music_video')
    .order('sort_order', { ascending: true })

  return { data, error }
}


export async function getRolloutVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', 'rollout')
    .order('sort_order', { ascending: true })

  return { data, error }
}

export async function getMobileVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('category', 'mobile_content')
    .order('sort_order', { ascending: true })

  return { data, error }
}


export async function createVideo(videoData) {
  const { data, error } = await supabase
    .from('videos')
    .insert([videoData])
    .select()
    .single()

  return { data, error }
}


export async function updateVideo(id, updates) {
  const { data, error } = await supabase
    .from('videos')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}


export async function deleteVideo(id) {
  const { error } = await supabase
    .from('videos')
    .delete()
    .eq('id', id)

  return { error }
}

export async function toggleFeatured(id, isFeatured) {
  const { data, error } = await supabase
    .from('videos')
    .update({ is_featured: isFeatured })
    .eq('id', id)
    .select()
    .single()

  return { data, error }
}