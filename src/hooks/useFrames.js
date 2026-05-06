
import { supabase } from '../lib/supabase'

const BUCKET = 'portfolio-assets'

export async function getShoots() {
  const { data, error } = await supabase
    .from('shoots')   
    .select('*')
    .order('sort_order', { ascending: true })

  return { data, error }
}


export async function getShootFrames(shootId) {
  const { data, error } = await supabase
    .from('frames')
    .select('*')
    .eq('shoot_id', shootId)
    .order('sort_order', { ascending: true })

  return { data, error }
}

export async function createShoot(shootData) {
  const { data, error } = await supabase
    .from('shoots')
    .insert([shootData])
    .select()
    .single()

  return { data, error }
}

export async function updateShoot(shootId, updates) {
  const { data, error } = await supabase
    .from('shoots')
    .update(updates)
    .eq('id', shootId)
    .select()
    .single()

  return { data, error }
}


export async function deleteShoot(shootId) {
  const { data: frames, error: fetchError } = await supabase
    .from('frames')
    .select('image_path')
    .eq('shoot_id', shootId)

  if (fetchError) return { error: fetchError }

  if (frames && frames.length > 0) {
    const paths = frames.map((f) => f.image_path)
    const { error: storageError } = await supabase.storage
      .from(BUCKET)
      .remove(paths)

    if (storageError) return { error: storageError }
  }

  const { error: deleteError } = await supabase
    .from('shoots')
    .delete()
    .eq('id', shootId)

  return { error: deleteError }
}


export async function uploadFrame(shootId, file, options = {}) {
  const { sortOrder = 0 } = options

  const safeName    = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const storagePath = `${shootId}/${Date.now()}-${safeName}`

  const { error: uploadError } = await supabase.storage
    .from(BUCKET)
    .upload(storagePath, file, {
      cacheControl: '3600',
      upsert:       false,   
      contentType:  file.type,
    })

  if (uploadError) return { data: null, error: uploadError }

  const { data: urlData } = supabase.storage
    .from(BUCKET)
    .getPublicUrl(storagePath)

  const storageUrl = urlData.publicUrl

  const { data, error: insertError } = await supabase
    .from('frames')
    .insert([{
      shoot_id:     shootId,
      image_url:  storageUrl,
      image_path: storagePath,
      sort_order:   sortOrder,
    }])
    .select()
    .single()

  return { data, error: insertError }
}

export async function uploadFrames(shootId, files, options = {}) {
  const { onFileComplete } = options
  const total     = files.length
  const succeeded = []
  const failed    = []

  const CONCURRENCY = 3
  const queue = [...files.entries()]   

  async function processNext() {
    if (queue.length === 0) return
    const [index, file] = queue.shift()

    const { data, error } = await uploadFrame(shootId, file, {
      sortOrder: index,
    })

    if (error) {
      failed.push({ file, error })
    } else {
      succeeded.push(data)
    }

    onFileComplete?.(index + 1, total)
    await processNext()
  }

  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, files.length) }, processNext)
  )

  return { succeeded, failed }
}


export async function deleteFrame(frameId, storagePath) {
  const { error: storageError } = await supabase.storage
    .from(BUCKET)
    .remove([storagePath])

  if (storageError) return { error: storageError }

  const { error: deleteError } = await supabase
    .from('frames')
    .delete()
    .eq('id', frameId)

  return { error: deleteError }
}