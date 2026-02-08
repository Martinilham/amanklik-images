const API_BASE = 'https://amanklik-images-api.vercel.app' || '' // set to http://localhost:5000 for dev if needed
// const API_BASE = 'http://localhost:5000' || '' // set to http://localhost:5000 for dev if needed
export async function fetchImages() {
  const res = await fetch(`${API_BASE}/api/images`)
  if (!res.ok) throw new Error('Failed to fetch images')
  return res.json()
}

export async function uploadImage(formData, onProgress) {
  // Using fetch; onProgress can be supported in modern browsers via XHR only.
  // For simplicity we'll use fetch and ignore progress here.
  const res = await fetch(`${API_BASE}/api/images`, {
    method: 'POST',
    body: formData
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'Upload failed')
  }
  return res.json()
}

export async function deleteImage(id) {
  const res = await fetch(`${API_BASE}/api/images/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('Delete failed')
  return res.json()
}

export async function searchImages(q) {
  const res = await fetch(`${API_BASE}/api/images?q=${encodeURIComponent(q)}`)
  if (!res.ok) throw new Error('Search failed')
  return res.json()
}
